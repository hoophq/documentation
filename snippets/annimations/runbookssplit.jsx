export const SplitScreen = () => {
  const WG = "var(--warm-gold)";
  const S1 = "var(--sand-100)";
  const S5 = "var(--sand-500)";
  const GRAD = "linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)";
  const FONT_URL = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap";
  const rgba = (a) => `rgba(var(--sand-100-rgb),${a})`;
  const mono = "'JetBrains Mono', monospace";
  const sans = "'Inter', sans-serif";

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

  const PHASES = [
    { label: "Select runbook", ms: 2500 },
    { label: "Fill parameters", ms: 4000 },
    { label: "Access review", ms: 2500 },
    { label: "Execute", ms: 4000 },
  ];

  function Overline({ children, style }) {
    return <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, color: WG, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, ...style }}>{children}</div>;
  }

  function Check({ checked, label }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: sans, fontSize: 11.5, color: checked ? rgba(0.55) : rgba(0.25), transition: "color 0.3s" }}>
        <div style={{ width: 16, height: 16, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? "rgba(var(--warm-gold-rgb),0.12)" : rgba(0.03), border: checked ? "1px solid rgba(var(--warm-gold-rgb),0.3)" : `1px solid ${rgba(0.08)}`, transition: "all 0.4s" }}>
          {checked
            ? <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke={WG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <div style={{ width: 7, height: 7, borderRadius: "50%", border: `2px solid ${rgba(0.12)}`, borderTopColor: "rgba(var(--warm-gold-rgb),0.4)", animation: "v1Spin 0.8s linear infinite" }}/>}
        </div>
        {label}
      </div>
    );
  }

  const [phase, setPhase] = useState(0);
  const [checks, setChecks] = useState(0);
  const [typed, typedDone] = useTypewriter("40192", phase >= 1, 75);

  useEffect(() => {
    let t;
    const run = (p) => { t = setTimeout(() => { const n = (p + 1) % 4; setPhase(n); if (n === 0) setChecks(0); run(n); }, PHASES[p].ms); };
    run(0); return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 2) { setChecks(0); return; }
    let c = 0;
    const iv = setInterval(() => { c++; setChecks(c); if (c >= 3) clearInterval(iv); }, 600);
    return () => clearInterval(iv);
  }, [phase]);

  const paramActive = phase >= 1;

  const lines = [
    { t: "comment", v: "-- customer-lookup.runbook.sql" },
    { t: "kw", v: "SELECT" },
    { t: "f", v: "  customer_id, name, email, status" },
    { t: "kw", v: "FROM customers" },
    { t: "kw", v: "WHERE" },
    { t: "param", v: '  customer_id = {{ .customer_id }}' },
  ];

  return (
    <>
      <style>{`@import url('${FONT_URL}');`}</style>
      <style>{`
        @keyframes v1Blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes v1Up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes v1Spin{to{transform:rotate(360deg)}}
        @keyframes v1Pulse{0%,100%{opacity:.12}50%{opacity:.2}}
        @keyframes v1Connect{from{width:0}to{width:100%}}
      `}</style>

      <div style={{ background: GRAD, borderRadius: 14, overflow: "hidden", position: "relative", fontFamily: sans, maxWidth: 820, margin: "0 auto" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "160%", background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)", pointerEvents: "none", animation: "v1Pulse 4s ease-in-out infinite" }}/>

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

        {/* Split content */}
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", height: 420 }}>

          {/* LEFT: Code */}
          <div style={{ borderRight: `1px solid ${rgba(0.06)}`, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Overline style={{ marginBottom: 0 }}>Engineer writes</Overline>
              <div style={{ fontFamily: mono, fontSize: 9, color: rgba(0.2) }}>.runbook.sql</div>
            </div>
            <div style={{ background: rgba(0.04), border: `1px solid ${rgba(0.08)}`, borderRadius: 10, padding: "14px 16px", fontFamily: mono, fontSize: 12, lineHeight: 2 }}>
              {lines.map((l, i) => {
                let color = rgba(0.55);
                if (l.t === "comment") color = S5;
                if (l.t === "kw") color = WG;
                const isP = l.t === "param";
                return (
                  <div key={i} style={{ position: "relative" }}>
                    {isP && <div style={{
                      position: "absolute", left: -6, right: -6, top: 2, bottom: 2,
                      background: paramActive ? "rgba(var(--warm-gold-rgb),0.1)" : "transparent",
                      borderRadius: 4,
                      border: paramActive ? "1px solid rgba(var(--warm-gold-rgb),0.3)" : "1px solid transparent",
                      transition: "all 0.5s",
                    }}/>}
                    <span style={{ position: "relative", color: isP && paramActive ? WG : isP ? rgba(0.3) : color, fontWeight: isP && paramActive ? 600 : 400, transition: "all 0.4s" }}>{l.v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Form / Review / Results */}
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0 }}>
              <Overline style={{ marginBottom: 0 }}>Team runs</Overline>
              <div style={{ fontFamily: sans, fontSize: 9, color: rgba(0.2), display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: phase >= 1 ? WG : rgba(0.15), transition: "background 0.3s" }}/>
                {phase >= 3 ? "Done" : phase >= 1 ? "Active" : "Waiting"}
              </div>
            </div>

            {/* Form */}
            <div style={{
              background: rgba(0.04), border: `1px solid ${rgba(0.08)}`, borderRadius: 10, padding: "14px 16px",
              opacity: phase >= 1 ? 1 : 0.3, transition: "opacity 0.5s",
            }}>
              <div style={{ fontSize: 11, fontFamily: sans, fontWeight: 500, color: rgba(0.5), marginBottom: 5 }}>
                Customer ID <span style={{ fontSize: 9, color: "rgba(var(--warm-gold-rgb),0.5)", fontStyle: "italic" }}>required</span>
              </div>
              <div style={{
                background: rgba(0.03), border: typedDone ? "1px solid rgba(var(--warm-gold-rgb),0.35)" : `1px solid ${rgba(0.1)}`,
                borderRadius: 6, padding: "8px 12px", fontFamily: mono, fontSize: 13, color: S1,
                minHeight: 18, transition: "border-color 0.3s", display: "flex", alignItems: "center",
              }}>
                {phase >= 1 ? typed : ""}
                {phase === 1 && !typedDone && <span style={{ display: "inline-block", width: 2, height: 15, background: WG, marginLeft: 1, animation: "v1Blink 1s step-end infinite" }}/>}
              </div>
              {typedDone && phase >= 1 && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, background: "rgba(var(--warm-gold-rgb),0.08)", border: "1px solid rgba(var(--warm-gold-rgb),0.2)", borderRadius: 14, padding: "3px 10px", fontSize: 10, fontWeight: 500, color: WG, animation: "v1Up 0.3s ease-out" }}>
                  <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke={WG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Valid
                </div>
              )}
            </div>

            {/* Review */}
            <div style={{
              background: rgba(0.04), border: `1px solid ${rgba(0.08)}`, borderRadius: 10, padding: "14px 16px",
              opacity: phase >= 2 ? 1 : 0, maxHeight: phase >= 2 ? 150 : 0, overflow: "hidden",
              transition: "opacity 0.4s 0.1s, max-height 0.4s cubic-bezier(.4,0,.2,1)",
            }}>
              <Overline>Access Review</Overline>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <Check checked={checks >= 1} label="Guardrails passed" />
                <Check checked={checks >= 2} label="Data masking on" />
                <Check checked={checks >= 3} label="Policy approved" />
              </div>
            </div>

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
                <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 60px", padding: "6px 0", borderBottom: `1px solid ${rgba(0.04)}`, fontFamily: sans, fontSize: 9, fontWeight: 600, color: rgba(0.25), textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <span>ID</span><span>Name</span><span>Email</span><span>Status</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 60px", padding: "8px 0", fontFamily: mono, fontSize: 11, color: rgba(0.55), animation: "v1Up 0.4s ease-out" }}>
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

          {/* Connecting line removed — caused visual misalignment */}
        </div>
      </div>
    </>
  );
}
