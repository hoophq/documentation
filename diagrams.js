// Diagrams: <Diagram chart={`...`} /> (snippets/diagram.jsx) calls window.hoopDiagram.
// beautiful-mermaid draws the Mermaid code; the colors are CSS variables in style.css.
// Mintlify loads every .js file in the repo on every page.
(function () {
  var CDN = 'https://cdn.jsdelivr.net';
  var LIB = CDN + '/npm/beautiful-mermaid@1.1.3/+esm';

  // Shim: beautiful-mermaid 1.1.3 has no option for text size or node padding,
  // and its 13px/11px text is too small in the docs column. Raise the values
  // before the layout runs. Throws if they are not found: remove this shim
  // when the library adds a size option.
  var SIZES = [
    ['nodeLabel:13,edgeLabel:11,groupHeader:12', 'nodeLabel:16,edgeLabel:14,groupHeader:14'],
    ['horizontal:20,vertical:10', 'horizontal:24,vertical:14'],
  ];

  // Semantic classes: authors write :::focus or :::strong, never a color.
  var CLASSES =
    '\nclassDef focus fill:var(--hd-focus),color:var(--hd-on-focus),stroke:var(--hd-focus)' +
    '\nclassDef strong fill:var(--hd-strong),color:var(--hd-on-strong),stroke:var(--hd-strong)';

  var THEME = {
    bg: 'var(--hd-bg)', fg: 'var(--hd-fg)', line: 'var(--hd-line)',
    accent: 'var(--hd-arrow)', muted: 'var(--hd-muted)',
    surface: 'var(--hd-node)', border: 'var(--hd-node)',
    font: 'Inter', transparent: true, padding: 16, nodeSpacing: 28, layerSpacing: 40,
  };

  var lib = null;
  function load() {
    if (lib) return lib;
    lib = fetch(LIB)
      .then(function (r) {
        if (!r.ok) throw new Error('could not fetch beautiful-mermaid (' + r.status + ')');
        return r.text();
      })
      .then(function (src) {
        SIZES.forEach(function (s) {
          if (src.split(s[0]).length !== 2) throw new Error('beautiful-mermaid sizes not found; check the version');
          src = src.replace(s[0], s[1]);
        });
        // The hoop.dev CSP blocks blob: and data: scripts, but allows https:
        // imports and eval. So: import the dependencies from the CDN, and run
        // the patched module body as a function that returns its exports.
        var deps = [];
        src = src.replace(/import(\{[^}]*\}|\s*\w+)\s*from"(\/npm\/[^"]+)";/g, function (all, names, path) {
          deps.push({ names: names.trim(), url: CDN + path });
          return '';
        });
        var exp = src.match(/export\{([^}]*)\};?/);
        if (deps.length !== 2 || !exp) throw new Error('beautiful-mermaid imports/exports not found; check the version');
        src = src.replace(exp[0], 'return{' + exp[1].split(',').map(function (e) {
          var p = e.trim().split(/\s+as\s+/);
          return (p[1] || p[0]) + ':' + p[0];
        }).join(',') + '};');
        return Promise.all(deps.map(function (d) { return import(d.url); })).then(function (mods) {
          var params = [], args = [];
          deps.forEach(function (d, i) {
            if (d.names[0] === '{') {
              d.names.slice(1, -1).split(',').forEach(function (e) {
                var p = e.trim().split(/\s+as\s+/);
                params.push(p[1] || p[0]);
                args.push(mods[i][p[0]]);
              });
            } else {
              params.push(d.names);
              args.push(mods[i].default);
            }
          });
          return Function.apply(null, params.concat('"use strict";' + src)).apply(null, args);
        });
      });
    lib.catch(function () { lib = null; });
    return lib;
  }

  var count = 0;
  window.hoopDiagram = function (code) {
    return load().then(function (m) {
      var p = 'hd' + count++ + '-';
      var svg = m.renderMermaidSVG(code.trim() + CLASSES, THEME)
        .replace(/\s(rx|ry)="[^"]*"/g, ' $1="0"')
        .replace(/id="([^"]+)"/g, 'id="' + p + '$1"')
        .replace(/url\(#([^)]+)\)/g, 'url(#' + p + '$1)');
      // Fit the column. The full size opens on click (--hd-w).
      return svg.replace(/viewBox="0 0 ([\d.]+) [^"]*"[^>]*? style="/, function (all, w) {
        w = Math.round(+w);
        return all + 'width:min(100%,' + w + 'px);height:auto;--hd-w:' + w + 'px;';
      });
    });
  };

  // Click to enlarge.
  function open(diagram) {
    var svg = diagram.querySelector('svg');
    if (!svg) return;
    var overlay = document.createElement('div');
    overlay.className = 'hoop-diagram-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Diagram');
    overlay.innerHTML = '<button type="button" class="hoop-diagram-close">Close</button>';
    var frame = document.createElement('div');
    frame.className = 'hoop-diagram-full';
    frame.appendChild(svg.cloneNode(true));
    overlay.appendChild(frame);
    function close() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      var b = diagram.querySelector('.hoop-diagram-enlarge');
      if (b) b.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('.hoop-diagram-close')) close();
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
    overlay.querySelector('.hoop-diagram-close').focus();
  }
  // The button opens it, and so does a click anywhere on the diagram.
  document.addEventListener('click', function (e) {
    var d = e.target.closest && e.target.closest('.hoop-diagram[data-enlarge]');
    if (d) open(d);
  });
})();
