export const NativeClientMasking = () => {
  const C = {
    warmGold: "var(--warm-gold)",
    sand100: "var(--sand-100)",
    sand300: "var(--sand-300)",
    sand500: "var(--sand-500)",
    rawFlash: "rgba(var(--sand-100-rgb),0.4)",
  };

  /* ── Panel data ────────────────────────────────────────────── */

  const DBEAVER_COLS = ["name", "email", "ssn", "phone"];
  const DBEAVER_ROWS = [
    { raw: ["Sarah Chen", "sarah.chen@acme.io", "284-19-7653", "+1 415-892-3041"], masked: ["[PERSON]", "[EMAIL]", "[SSN]", "[PHONE]"] },
    { raw: ["Marcus Webb", "m.webb@globex.com", "531-77-0294", "+1 212-555-8817"], masked: ["[PERSON]", "[EMAIL]", "[SSN]", "[PHONE]"] },
    { raw: ["Elena Ruiz", "eruiz@initech.co", "719-42-8106", "+44 20-7946-0958"], masked: ["[PERSON]", "[EMAIL]", "[SSN]", "[PHONE]"] },
    { raw: ["James Okafor", "j.okafor@stark.dev", "603-88-1542", "+1 650-331-7720"], masked: ["[PERSON]", "[EMAIL]", "[SSN]", "[PHONE]"] },
  ];

  const PSQL_ROWS = [
    { raw: ["Sarah Chen", "sarah.chen@acme.io", "284-19-7653"], masked: ["[PERSON]", "[EMAIL]", "[SSN]"] },
    { raw: ["Marcus Webb", "m.webb@globex.com", "531-77-0294"], masked: ["[PERSON]", "[EMAIL]", "[SSN]"] },
    { raw: ["Elena Ruiz", "eruiz@initech.co", "719-42-8106"], masked: ["[PERSON]", "[EMAIL]", "[SSN]"] },
  ];

  const LENS_LINES = [
    { prefix: "[INFO] User login: ", raw: "sarah@acme.io", masked: "[EMAIL]", suffix: " from ", raw2: "192.168.1.42", masked2: "[IP]", suffixEnd: "" },
    { prefix: "[INFO] Payment processed: card ", raw: "4532-XXXX-XXXX-7821", masked: "[PCI]", suffix: " amount $142.50", raw2: null, masked2: null, suffixEnd: "" },
    { prefix: "[WARN] Failed auth: ", raw: "m.webb@globex.com", masked: "[EMAIL]", suffix: " \u00b7 ", raw2: "10.0.3.88", masked2: "[IP]", suffixEnd: "" },
  ];

  const SSH_ROWS = [
    { raw: ["Sarah Chen", "sarah.chen@acme.io", "284-19-7653"], masked: ["[PERSON]", "[EMAIL]", "[SSN]"] },
    { raw: ["Marcus Webb", "m.webb@globex.com", "531-77-0294"], masked: ["[PERSON]", "[EMAIL]", "[SSN]"] },
    { raw: ["Elena Ruiz", "eruiz@initech.co", "719-42-8106"], masked: ["[PERSON]", "[EMAIL]", "[SSN]"] },
  ];

  /* ── Timing constants ──────────────────────────────────────── */

  const PANEL_STAGGER = 800;
  const ROW_STAGGER = 400;
  const RAW_FLASH_MS = 200;
  const HOLD_MS = 3000;
  const FADE_MS = 600;

  /* ── Shared styles ─────────────────────────────────────────── */

  const mono = "var(--mono, 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace)";

  const panelBase = {
    background: "rgba(var(--sand-100-rgb),0.04)",
    border: "1px solid rgba(var(--sand-100-rgb),0.08)",
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: 180,
  };

  const maskedStyle = {
    color: C.warmGold,
    fontWeight: 600,
    fontFamily: mono,
  };

  const rawStyle = {
    color: C.rawFlash,
    fontFamily: mono,
  };

  const chromeBase = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.02em",
    borderBottom: "1px solid rgba(var(--sand-100-rgb),0.06)",
  };

  const statusBar = {
    padding: "4px 10px",
    fontSize: 9,
    color: C.sand500,
    borderTop: "1px solid rgba(var(--sand-100-rgb),0.06)",
    fontFamily: mono,
    marginTop: "auto",
  };

  /* ── Utility: cell renderer ────────────────────────────────── */

  function MaskedCell({ raw, masked, isMasked, visible }) {
    return (
      <span
        style={{
          ...(isMasked ? maskedStyle : rawStyle),
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease, color 0.15s ease",
          fontSize: 10,
        }}
      >
        {isMasked ? masked : raw}
      </span>
    );
  }

  /* ── Panel: DBeaver ────────────────────────────────────────── */

  function DBeaver({ rowStates }) {
    return (
      <div style={panelBase}>
        <div style={{ ...chromeBase, background: "rgba(30,80,30,0.15)" }}>
          <span style={{ color: "#5BA55B", fontSize: 12 }}>&#9672;</span>
          <span style={{ color: C.sand100 }}>DBeaver</span>
          <span style={{ color: C.sand500, marginLeft: "auto", fontWeight: 400 }}>customers @ prod-db</span>
        </div>
        <div style={{ padding: "8px 10px", flex: 1, overflow: "hidden" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr 1.2fr", gap: 4, marginBottom: 4, borderBottom: "1px solid rgba(var(--sand-100-rgb),0.08)", paddingBottom: 4 }}>
            {DBEAVER_COLS.map(col => (
              <span key={col} style={{ fontSize: 9, color: C.sand500, fontFamily: mono, fontWeight: 600, textTransform: "uppercase" }}>{col}</span>
            ))}
          </div>
          {/* Data rows */}
          {DBEAVER_ROWS.map((row, ri) => {
            const st = rowStates[ri] || { visible: false, masked: false };
            return (
              <div
                key={ri}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.3fr 1fr 1.2fr",
                  gap: 4,
                  padding: "2px 0",
                  opacity: st.visible ? 1 : 0,
                  transform: st.visible ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                }}
              >
                {row.raw.map((cell, ci) => (
                  <MaskedCell key={ci} raw={cell} masked={row.masked[ci]} isMasked={st.masked} visible={st.visible} />
                ))}
              </div>
            );
          })}
        </div>
        <div style={statusBar}>4 rows returned &middot; masked by hoop gateway</div>
      </div>
    );
  }

  /* ── Panel: psql ───────────────────────────────────────────── */

  function Psql({ rowStates }) {
    const pad = (s, n) => s.padEnd(n);
    const cols = ["name", "email", "ssn"];
    const widths = [12, 20, 12];
    const sep = widths.map(w => "-".repeat(w)).join("-+-");
    const header = cols.map((c, i) => pad(c, widths[i])).join(" | ");

    return (
      <div style={panelBase}>
        <div style={{ ...chromeBase, background: "rgba(var(--sand-100-rgb),0.03)" }}>
          <span style={{ color: C.sand500, fontSize: 11 }}>&#9608;</span>
          <span style={{ color: C.sand100 }}>Terminal</span>
          <span style={{ color: C.sand500, fontWeight: 400 }}>&mdash; psql</span>
        </div>
        <div style={{ padding: "8px 10px", flex: 1, fontFamily: mono, fontSize: 10, lineHeight: 1.7, color: C.sand300, overflow: "hidden" }}>
          <div><span style={{ color: C.sand500 }}>prod-db=&gt;</span> SELECT name, email, ssn FROM customers LIMIT 3;</div>
          <div style={{ color: C.sand500, marginTop: 4 }}> {header}</div>
          <div style={{ color: "rgba(var(--sand-100-rgb),0.12)" }}>{sep}</div>
          {PSQL_ROWS.map((row, ri) => {
            const st = rowStates[ri] || { visible: false, masked: false };
            const vals = st.masked ? row.masked : row.raw;
            const line = vals.map((v, ci) => pad(v, widths[ci])).join(" | ");
            return (
              <div
                key={ri}
                style={{
                  opacity: st.visible ? 1 : 0,
                  transform: st.visible ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  color: st.masked ? C.warmGold : C.rawFlash,
                  fontWeight: st.masked ? 600 : 400,
                }}
              >
                {" "}{line}
              </div>
            );
          })}
          <div style={{ color: C.sand500, marginTop: 4 }}>(3 rows) &middot; masking: active</div>
        </div>
      </div>
    );
  }

  /* ── Panel: Lens / K8s ─────────────────────────────────────── */

  function Lens({ rowStates }) {
    return (
      <div style={panelBase}>
        <div style={{ ...chromeBase, background: "rgba(50,100,200,0.12)" }}>
          <span style={{ color: "#6B9FE8", fontSize: 11 }}>&#9781;</span>
          <span style={{ color: C.sand100 }}>Lens</span>
          <span style={{ color: C.sand500, fontWeight: 400 }}>&mdash; Pod Logs</span>
        </div>
        <div style={{ padding: "8px 10px", flex: 1, fontFamily: mono, fontSize: 10, lineHeight: 1.8, overflow: "hidden" }}>
          {LENS_LINES.map((line, ri) => {
            const st = rowStates[ri] || { visible: false, masked: false };
            return (
              <div
                key={ri}
                style={{
                  opacity: st.visible ? 1 : 0,
                  transform: st.visible ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  color: C.sand300,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <span style={{ color: C.sand500 }}>{line.prefix}</span>
                <span style={st.masked ? maskedStyle : { ...rawStyle }}>{st.masked ? line.masked : line.raw}</span>
                <span style={{ color: C.sand500 }}>{line.suffix}</span>
                {line.raw2 && (
                  <>
                    <span style={st.masked ? maskedStyle : { ...rawStyle }}>{st.masked ? line.masked2 : line.raw2}</span>
                    <span style={{ color: C.sand500 }}>{line.suffixEnd}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div style={statusBar}>streaming &middot; 3 fields masked</div>
      </div>
    );
  }

  /* ── Panel: SSH ────────────────────────────────────────────── */

  function Ssh({ rowStates }) {
    return (
      <div style={panelBase}>
        <div style={{ ...chromeBase, background: "rgba(var(--sand-100-rgb),0.03)" }}>
          <span style={{ color: C.sand500, fontSize: 11 }}>&#9608;</span>
          <span style={{ color: C.sand100 }}>Terminal</span>
          <span style={{ color: C.sand500, fontWeight: 400 }}>&mdash; ssh prod-server</span>
        </div>
        <div style={{ padding: "8px 10px", flex: 1, fontFamily: mono, fontSize: 10, lineHeight: 1.7, color: C.sand300, overflow: "hidden" }}>
          <div><span style={{ color: C.sand500 }}>$</span> cat /var/log/app/users.csv</div>
          <div style={{ color: C.sand500, marginTop: 4 }}>id,name,email,ssn</div>
          {SSH_ROWS.map((row, ri) => {
            const st = rowStates[ri] || { visible: false, masked: false };
            const vals = st.masked ? row.masked : row.raw;
            return (
              <div
                key={ri}
                style={{
                  opacity: st.visible ? 1 : 0,
                  transform: st.visible ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  color: st.masked ? C.warmGold : C.rawFlash,
                  fontWeight: st.masked ? 600 : 400,
                }}
              >
                <span style={{ color: C.sand500 }}>{ri + 1},</span>{vals.join(",")}
              </div>
            );
          })}
          <div style={{ color: C.sand500, marginTop: 4 }}>file output &middot; 9 fields masked</div>
        </div>
      </div>
    );
  }

  /* ── Gateway indicator (center) ────────────────────────────── */

  function GatewayBadge({ pulsing }) {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: pulsing ? "rgba(var(--warm-gold-rgb),0.2)" : "rgba(var(--warm-gold-rgb),0.08)",
            border: `1.5px solid ${pulsing ? "rgba(var(--warm-gold-rgb),0.6)" : "rgba(var(--warm-gold-rgb),0.2)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: pulsing ? "0 0 16px rgba(var(--warm-gold-rgb),0.25)" : "none",
          }}
        >
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
            <path
              d="M7 0.5L0.5 3.5V7.5C0.5 11.5 3.3 15.1 7 15.5C10.7 15.1 13.5 11.5 13.5 7.5V3.5L7 0.5Z"
              fill={pulsing ? "rgba(var(--warm-gold-rgb),0.3)" : "rgba(var(--warm-gold-rgb),0.1)"}
              stroke={C.warmGold}
              strokeWidth="1"
              strokeLinejoin="round"
              style={{ transition: "fill 0.3s ease" }}
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: pulsing ? C.warmGold : C.sand500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: mono,
            transition: "color 0.3s ease",
          }}
        >
          hoop
        </span>
      </div>
    );
  }

  /* ── Main component ────────────────────────────────────────── */

  const PANEL_ROW_COUNTS = [4, 3, 3, 3]; // DBeaver, psql, Lens, SSH

  // rowStates[panelIdx][rowIdx] = { visible, masked }
  const [panelRows, setPanelRows] = useState(
    PANEL_ROW_COUNTS.map(n => Array.from({ length: n }, () => ({ visible: false, masked: false })))
  );
  const [gatewayPulsing, setGatewayPulsing] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const timeouts = useRef([]);

  const clearAll = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeouts.current.push(id);
  }, []);

  const setRow = useCallback((pi, ri, patch) => {
    setPanelRows(prev => {
      const next = prev.map(p => p.map(r => ({ ...r })));
      Object.assign(next[pi][ri], patch);
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const cycle = () => {
      if (cancelled) return;

      // Reset
      setPanelRows(PANEL_ROW_COUNTS.map(n => Array.from({ length: n }, () => ({ visible: false, masked: false }))));
      setGatewayPulsing(false);
      setFadeOut(false);

      let t = 200; // initial delay

      // For each panel, staggered
      PANEL_ROW_COUNTS.forEach((rowCount, pi) => {
        const panelStart = t + pi * PANEL_STAGGER;

        for (let ri = 0; ri < rowCount; ri++) {
          const rowStart = panelStart + ri * ROW_STAGGER;

          // Show row (raw flash)
          later(() => {
            if (cancelled) return;
            setRow(pi, ri, { visible: true, masked: false });
            setGatewayPulsing(true);
          }, rowStart);

          // Flip to masked
          later(() => {
            if (cancelled) return;
            setRow(pi, ri, { masked: true });
          }, rowStart + RAW_FLASH_MS);

          // Stop gateway pulse after last row of last panel
          if (pi === PANEL_ROW_COUNTS.length - 1 && ri === rowCount - 1) {
            later(() => {
              if (cancelled) return;
              setGatewayPulsing(false);
            }, rowStart + RAW_FLASH_MS + 200);
          }
        }
      });

      // Total animation time
      const lastPanel = PANEL_ROW_COUNTS.length - 1;
      const lastRowCount = PANEL_ROW_COUNTS[lastPanel];
      const totalFill = t + lastPanel * PANEL_STAGGER + (lastRowCount - 1) * ROW_STAGGER + RAW_FLASH_MS + 200;

      // Hold
      later(() => {
        if (cancelled) return;
        setFadeOut(true);
      }, totalFill + HOLD_MS);

      // Restart cycle
      later(() => {
        if (cancelled) return;
        cycle();
      }, totalFill + HOLD_MS + FADE_MS + 200);
    };

    cycle();

    return () => {
      cancelled = true;
      clearAll();
    };
  }, [later, clearAll, setRow]);

  return (
    <div
      style={{
        maxWidth: 700,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "180px 180px",
          gap: 12,
        }}
      >
        <DBeaver rowStates={panelRows[0]} />
        <Psql rowStates={panelRows[1]} />
        <Lens rowStates={panelRows[2]} />
        <Ssh rowStates={panelRows[3]} />
      </div>
    </div>
  );
}
