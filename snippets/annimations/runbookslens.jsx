export const OverlayLens = () => {
  const WG = "var(--warm-gold)";
  const S1 = "var(--sand-100)";
  const S5 = "var(--sand-500)";
  const GRAD = "linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)";
  const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&family=Sora:wght@600;700;800&display=swap";
  const rgba = (a) => `rgba(var(--sand-100-rgb),${a})`;
  const mono = "'JetBrains Mono', monospace";
  const sans = "'DM Sans', sans-serif";

  function useTypewriter(text, active, speed = 65) {
    const [out, setOut] = useState("");
    const [done, setDone] = useState(false);
    useEffect(() => {
      if (!active) { setOut(""); setDone(false); return; }
      let i = 0; setOut(""); setDone(false);
      const iv = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) { clearInterval(iv); setDone(true); } }, speed);
      return () => clearInterval(iv);
    }, [text, active, speed]);
    return [out, done];
  }

  function Overline({ children, style }) {
    return <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, color: WG, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, ...style }}>{children}</div>;
  }

  function Check({ checked, label }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: sans, fontSize: 11.5, color: checked ? rgba(0.55) : rgba(0.25), transition: "color 0.3s" }}>
        <div style={{ width: 16, height: 16, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? "rgba(var(--warm-gold-rgb),0.12)" : rgba(0.03), border: checked ? "1px solid rgba(var(--warm-gold-rgb),0.3)" : `1px solid ${rgba(0.08)}`, transition: "all 0.4s" }}>
          {checked
            ? <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke={WG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <div style={{ width: 7, height: 7, borderRadius: "50%", border: `2px solid ${rgba(0.12)}`, borderTopColor: "rgba(var(--warm-gold-rgb),0.4)", animation: "v4Spin 0.8s linear infinite" }}/>}
        </div>
        {label}
      </div>
    );
  }

  function Connector({ visible }) {
    return <div style={{ display: "flex", justifyContent: "center", height: visible ? 16 : 0, overflow: "hidden", transition: "height 0.4s cubic-bezier(.4,0,.2,1)" }}><div style={{ width: 1, height: "100%", background: "linear-gradient(to bottom, rgba(var(--warm-gold-rgb),0.25), transparent)" }}/></div>;
  }

  const CODE_LINES = [
    { t: "comment", v: "-- customer-lookup.runbook.sql" },
    { t: "kw", v: "SELECT" },
    { t: "f", v: "  customer_id, name, email, status" },
    { t: "kw", v: "FROM customers" },
    { t: "kw", v: "WHERE" },
    { t: "param", v: '  customer_id = {{ .customer_id | required | type "number" }}' },
  ];

  const PHASES = [
    { label: "Template", ms: 3000 },
    { label: "Lens view", ms: 5000 },
    { label: "Review", ms: 2500 },
    { label: "Results", ms: 4000 },
  ];

  const [phase, setPhase] = useState(0);
  const [checks, setChecks] = useState(0);
  const [lensPos, setLensPos] = useState(0);

  const [typed, typedDone] = useTypewriter("40192", phase >= 1, 75);

  useEffect(() => {
    let t;
    const run = (p) => { t = setTimeout(() => { const n = (p + 1) % 4; setPhase(n); if (n === 0) { setChecks(0); setLensPos(0); } run(n); }, PHASES[p].ms); };
    run(0); return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    setLensPos(0);
    const start = performance.now();
    const duration = 1800;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setLensPos(eased * 100);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) { setChecks(0); return; }
    let c = 0;
    const iv = setInterval(() => { c++; setChecks(c); if (c >= 3) clearInterval(iv); }, 600);
    return () => clearInterval(iv);
  }, [phase]);

  const lensActive = phase >= 1;
  const lensWidth = lensActive ? lensPos : 0;

  return (
    <>
      <style>{`@import url('${FONT_URL}');`}</style>
      <style>{`
        @keyframes v4Blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes v4Up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes v4Spin{to{transform:rotate(360deg)}}
        @keyframes v4Pulse{0%,100%{opacity:.12}50%{opacity:.2}}
      `}</style>

      <div style={{ background: GRAD, borderRadius: 14, overflow: "hidden", position: "relative", fontFamily: sans, maxWidth: 780, margin: "0 auto" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "160%", background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)", pointerEvents: "none", animation: "v4Pulse 4s ease-in-out infinite" }}/>

        {/* Top bar */}
        <div style={{ position: "relative", padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${rgba(0.06)}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={S1}><circle cx="7" cy="7" r="3.5"/><circle cx="17" cy="7" r="3.5"/><circle cx="7" cy="17" r="3.5"/><circle cx="17" cy="17" r="3.5"/></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: S1 }}>Runbooks</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {PHASES.map((_, i) => (
              <div key={i} style={{ width: i === phase ? 22 : 7, height: 7, borderRadius: 4, background: i === phase ? WG : i < phase ? "rgba(var(--warm-gold-rgb),0.4)" : rgba(0.1), transition: "all 0.5s cubic-bezier(.4,0,.2,1)" }}/>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: rgba(0.3) }}>{PHASES[phase].label}</div>
        </div>

        {/* Body */}
        <div style={{ position: "relative", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Code + Lens overlay area */}
          <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", minHeight: 260 }}>

            {/* BOTTOM LAYER: Code */}
            <div style={{
              background: rgba(0.04), border: `1px solid ${rgba(0.08)}`,
              borderRadius: 10, padding: "16px 20px",
              fontFamily: mono, fontSize: 12.5, lineHeight: 2,
              position: "relative", zIndex: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Overline style={{ marginBottom: 0 }}>Template</Overline>
                <div style={{ fontFamily: mono, fontSize: 9, color: rgba(0.2) }}>customer-lookup.runbook.sql</div>
              </div>
              {CODE_LINES.map((l, i) => {
                let color = rgba(0.55);
                if (l.t === "comment") color = S5;
                if (l.t === "kw") color = WG;
                if (l.t === "param") color = rgba(0.35);
                return <div key={i} style={{ color }}>{l.v}</div>;
              })}
            </div>

            {/* TOP LAYER: Lens overlay (clips from left) */}
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: `${lensWidth}%`,
              overflow: "hidden",
              zIndex: 2,
              borderRadius: 10,
              transition: phase === 0 ? "width 0.3s" : "none",
            }}>
              {/* Lens content: rendered form */}
              <div style={{
                background: "rgba(45,30,18,0.92)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid rgba(var(--warm-gold-rgb),0.15)`,
                borderRadius: 10,
                padding: "16px 20px",
                minWidth: 700,
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <Overline style={{ marginBottom: 0 }}>Customer Lookup</Overline>
                  <div style={{ fontFamily: sans, fontSize: 9, color: rgba(0.25), display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: WG }}/>
                    Form view
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontFamily: sans, fontWeight: 500, color: rgba(0.5), marginBottom: 5 }}>
                    Customer ID <span style={{ fontSize: 9, color: "rgba(var(--warm-gold-rgb),0.5)", fontStyle: "italic" }}>required · number</span>
                  </div>
                  <div style={{
                    background: rgba(0.03), border: typedDone ? "1px solid rgba(var(--warm-gold-rgb),0.35)" : `1px solid ${rgba(0.1)}`,
                    borderRadius: 6, padding: "9px 12px", fontFamily: mono, fontSize: 13, color: S1,
                    minHeight: 18, transition: "border-color 0.3s", display: "flex", alignItems: "center",
                  }}>
                    {typed}
                    {phase === 1 && !typedDone && <span style={{ display: "inline-block", width: 2, height: 15, background: WG, marginLeft: 1, animation: "v4Blink 1s step-end infinite" }}/>}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontFamily: sans, fontWeight: 500, color: rgba(0.5), marginBottom: 5 }}>Output columns</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["customer_id", "name", "email", "status"].map(f => (
                      <span key={f} style={{ background: rgba(0.04), border: `1px solid ${rgba(0.08)}`, borderRadius: 4, padding: "3px 8px", fontFamily: mono, fontSize: 10, color: rgba(0.3) }}>{f}</span>
                    ))}
                  </div>
                </div>

                {typedDone && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(var(--warm-gold-rgb),0.08)", border: "1px solid rgba(var(--warm-gold-rgb),0.2)", borderRadius: 14, padding: "4px 10px", fontSize: 10, fontWeight: 500, color: WG, animation: "v4Up 0.3s ease-out" }}>
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke={WG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Ready to execute
                  </div>
                )}
              </div>

              {/* Lens edge glow */}
              {lensActive && lensWidth < 100 && (
                <div style={{
                  position: "absolute", top: 0, right: -1, bottom: 0, width: 3,
                  background: `linear-gradient(to bottom, rgba(var(--warm-gold-rgb),0.5), rgba(var(--warm-gold-rgb),0.1))`,
                  borderRadius: 2,
                  boxShadow: "0 0 12px rgba(var(--warm-gold-rgb),0.3)",
                }}/>
              )}
            </div>
          </div>

          <Connector visible={phase >= 2} />

          {/* Review */}
          <div style={{
            background: rgba(0.04), border: `1px solid ${rgba(0.08)}`, borderRadius: 10, padding: "14px 18px",
            opacity: phase >= 2 ? 1 : 0, maxHeight: phase >= 2 ? 160 : 0, overflow: "hidden",
            transition: "opacity 0.4s 0.1s, max-height 0.4s cubic-bezier(.4,0,.2,1)",
          }}>
            <Overline>Access Review</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <Check checked={checks >= 1} label="Guardrails passed" />
              <Check checked={checks >= 2} label="Data masking enabled" />
              <Check checked={checks >= 3} label="Approved by policy" />
            </div>
          </div>

          <Connector visible={phase >= 3} />

          {/* Results */}
          <div style={{
            background: rgba(0.04), border: `1px solid ${rgba(0.08)}`, borderRadius: 10, padding: 0, overflow: "hidden",
            opacity: phase >= 3 ? 1 : 0, maxHeight: phase >= 3 ? 200 : 0,
            transition: "opacity 0.4s 0.1s, max-height 0.4s cubic-bezier(.4,0,.2,1)",
          }}>
            <div style={{ background: rgba(0.03), borderBottom: `1px solid ${rgba(0.06)}`, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Overline style={{ marginBottom: 0 }}>Results</Overline>
              <span style={{ fontFamily: mono, fontSize: 9, color: rgba(0.2) }}>1 row · 42ms</span>
            </div>
            <div style={{ padding: "0 14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 60px", padding: "6px 0", borderBottom: `1px solid ${rgba(0.04)}`, fontFamily: sans, fontSize: 9, fontWeight: 600, color: rgba(0.25), textTransform: "uppercase" }}>
                <span>ID</span><span>Name</span><span>Email</span><span>Status</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 60px", padding: "8px 0", fontFamily: mono, fontSize: 11, color: rgba(0.55), animation: phase >= 3 ? "v4Up 0.4s ease-out" : "none" }}>
                <span>40192</span><span>Acme Corp</span>
                <span style={{ color: WG, fontWeight: 500 }}>a●●●@acme.io</span>
                <span><span style={{ background: "rgba(var(--warm-gold-rgb),0.08)", border: "1px solid rgba(var(--warm-gold-rgb),0.2)", borderRadius: 10, padding: "1px 6px", fontSize: 8.5, fontFamily: sans, fontWeight: 600, color: WG, textTransform: "uppercase" }}>active</span></span>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${rgba(0.04)}`, padding: "7px 14px", display: "flex", gap: 10, fontSize: 9, color: rgba(0.18) }}>
              <span>Recorded</span><span>·</span><span>Audited</span><span>·</span><span>Masked</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
