// A Mermaid diagram in the Hoop style. The page keeps the Mermaid code:
//   <Diagram chart={`flowchart LR
//     A --> B:::focus`} />
// window.hoopDiagram (scripts.js) draws it. On a failure it shows the error and the code.
export const Diagram = ({ chart }) => {
  const [svg, setSvg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let live = true;
    const started = Date.now();
    const run = () => {
      if (!live) return;
      if (!window.hoopDiagram) {
        if (Date.now() - started > 10000) setError("scripts.js did not load the diagram renderer");
        else setTimeout(run, 100);
        return;
      }
      window.hoopDiagram(chart).then(
        (s) => live && setSvg(s),
        (e) => live && setError(String((e && e.message) || e))
      );
    };
    run();
    return () => {
      live = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="hoop-diagram hoop-diagram-error">
        <p>This diagram could not be drawn: {error}</p>
        <pre>{chart}</pre>
      </div>
    );
  }
  if (!svg) return <div className="hoop-diagram hoop-diagram-loading" aria-busy="true" />;
  return (
    <div className="hoop-diagram" data-enlarge="">
      <div className="hoop-diagram-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      <button type="button" className="hoop-diagram-enlarge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16" y2="16" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
        Click to enlarge
      </button>
    </div>
  );
};
