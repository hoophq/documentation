export const ProxyMembrane = () => {
  const FONTS_URL =
    "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=JetBrains+Mono:wght@400;500&family=Sora:wght@600;700;800&display=swap";

  const C = {
    espresso: "var(--gradient-dark-mid)",
    warmGold: "var(--warm-gold)",
    sand100: "var(--sand-100)",
    sand300: "var(--sand-300)",
    sand500: "var(--sand-500)",
  };

  const ROWS = [
    { raw: ["Sarah Chen", "sarah.chen@acme.io", "284-19-7653", "+1 415-892-3041"], masked: ["[PERSON]", "[EMAIL]", "[SSN]", "[PHONE]"] },
    { raw: ["Marcus Webb", "m.webb@globex.com", "531-77-0294", "+1 212-555-8817"], masked: ["[PERSON]", "[EMAIL]", "[SSN]", "[PHONE]"] },
    { raw: ["Elena Ruiz", "eruiz@initech.co", "719-42-8106", "+44 20-7946-0958"], masked: ["[PERSON]", "[EMAIL]", "[SSN]", "[PHONE]"] },
    { raw: ["James Okafor", "j.okafor@stark.dev", "603-88-1542", "+1 650-331-7720"], masked: ["[PERSON]", "[EMAIL]", "[SSN]", "[PHONE]"] },
  ];

  const ROW_DELAY = 800;
  const CROSS_DURATION = 600;
  const HOLD = 3000;

  function ShieldIcon({ active, done }) {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{
        animation: done ? "shieldIn 0.5s ease-out" : undefined,
        opacity: active ? 1 : 0.3, transition: "opacity 0.4s ease",
      }}>
        <path d="M10 2L3 5.5V10C3 14.5 6 17.5 10 19C14 17.5 17 14.5 17 10V5.5L10 2Z"
          fill={done ? "rgba(var(--warm-gold-rgb),0.15)" : "rgba(var(--sand-100-rgb),0.05)"}
          stroke={done ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.15)"} strokeWidth="1.2" />
        {done && (
          <path d="M7 10.5L9 12.5L13 8" stroke="var(--warm-gold)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    );
  }

  const [rowPhases, setRowPhases] = useState(ROWS.map(() => "hidden"));
  const [allDone, setAllDone] = useState(false);
  const [membraneActive, setMembraneActive] = useState(false);
  const [membraneGlow, setMembraneGlow] = useState(false);
  const timeouts = useRef([]);

  const clearAll = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeouts.current.push(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const cycle = () => {
      if (cancelled) return;
      setRowPhases(ROWS.map(() => "hidden"));
      setAllDone(false);
      setMembraneActive(false);
      setMembraneGlow(false);

      later(() => {
        if (cancelled) return;
        setMembraneActive(true);
      }, 400);

      ROWS.forEach((_, i) => {
        const t0 = 700 + i * ROW_DELAY;

        later(() => {
          if (cancelled) return;
          setRowPhases(p => { const n = [...p]; n[i] = "approaching"; return n; });
        }, t0);

        later(() => {
          if (cancelled) return;
          setRowPhases(p => { const n = [...p]; n[i] = "crossing"; return n; });
          setMembraneGlow(true);
          later(() => { if (!cancelled) setMembraneGlow(false); }, 300);
        }, t0 + 400);

        later(() => {
          if (cancelled) return;
          setRowPhases(p => { const n = [...p]; n[i] = "through"; return n; });
        }, t0 + 400 + CROSS_DURATION);
      });

      const total = 700 + (ROWS.length - 1) * ROW_DELAY + 400 + CROSS_DURATION + 300;
      later(() => { if (!cancelled) setAllDone(true); }, total);
      later(() => { if (!cancelled) cycle(); }, total + HOLD);
    };

    cycle();
    return () => { cancelled = true; clearAll(); };
  }, [later, clearAll]);

  return (
    <>
      <link rel="stylesheet" href={FONTS_URL} />
      <style>{`
        @keyframes approachSlide {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes crossFlash {
          0% { opacity: 1; filter: blur(0); }
          30% { opacity: 0.3; filter: blur(4px); transform: scaleY(0.8); }
          60% { opacity: 0.6; filter: blur(2px); transform: scaleY(1.05); }
          100% { opacity: 1; filter: blur(0); transform: scaleY(1); }
        }
        @keyframes throughSlide {
          from { opacity: 0; transform: translateX(0); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes membranePulse {
          0%, 100% { box-shadow: 0 0 8px 0 rgba(var(--warm-gold-rgb),0.1); }
          50% { box-shadow: 0 0 24px 4px rgba(var(--warm-gold-rgb),0.3); }
        }
        @keyframes membraneFlash {
          0% { background: rgba(var(--warm-gold-rgb),0.15); }
          100% { background: rgba(var(--warm-gold-rgb),0.06); }
        }
        @keyframes shieldIn {
          0% { opacity:0; transform:scale(0.6); }
          60% { opacity:1; transform:scale(1.08); }
          100% { opacity:1; transform:scale(1); }
        }
      `}</style>

      <div style={{
        background: "linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)",
        borderRadius: 14, padding: "32px 28px 28px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        position: "relative", overflow: "hidden", maxWidth: 760, margin: "0 auto",
        height: 420,
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "160%",
          background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 24, position: "relative", zIndex: 1,
        }}>
          <ShieldIcon done={allDone} active={membraneActive} />
          <span style={{
            fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600,
            color: C.sand100, letterSpacing: "-0.01em",
          }}>Live Data Masking</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: allDone ? C.warmGold : "rgba(var(--sand-100-rgb),0.18)",
            background: allDone ? "rgba(var(--warm-gold-rgb),0.10)" : "rgba(var(--sand-100-rgb),0.04)",
            padding: "2px 8px", borderRadius: 99, transition: "all 0.3s ease",
          }}>{allDone ? "Protected" : membraneActive ? "Active" : "Ready"}</span>
        </div>

        {/* Three-zone layout: Raw | Membrane | Masked */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 48px 1fr",
          gap: 0, position: "relative", zIndex: 1, minHeight: 220,
        }}>
          {/* Left: raw data zone */}
          <div style={{ position: "relative" }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500,
              color: "rgba(var(--sand-100-rgb),0.20)", textTransform: "uppercase",
              letterSpacing: "0.1em", marginBottom: 10, paddingLeft: 2,
            }}>Database response</div>

            <div style={{
              background: "rgba(var(--sand-100-rgb),0.03)", border: "1px solid rgba(var(--sand-100-rgb),0.06)",
              borderRadius: 8, overflow: "hidden",
            }}>
              {ROWS.map((row, i) => {
                const phase = rowPhases[i];
                const show = phase === "approaching" || phase === "crossing";
                return (
                  <div key={i} style={{
                    padding: "8px 12px",
                    borderBottom: i < ROWS.length - 1 ? "1px solid rgba(var(--sand-100-rgb),0.04)" : "none",
                    opacity: show ? 1 : phase === "through" ? 0.15 : 0,
                    transform: show ? "translateX(0)" : "translateX(-10px)",
                    transition: phase === "through" ? "opacity 0.4s ease" : "opacity 0.3s ease, transform 0.3s ease",
                    minHeight: 36, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2,
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      color: "rgba(var(--sand-100-rgb),0.50)", whiteSpace: "nowrap", overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>{row.raw[0]} , {row.raw[1]}</div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                      color: "rgba(var(--sand-100-rgb),0.30)", whiteSpace: "nowrap",
                    }}>{row.raw[2]} , {row.raw[3]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center: membrane barrier */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              width: 3, height: "calc(100% - 20px)", marginTop: 20,
              background: membraneActive
                ? `linear-gradient(180deg, transparent 0%, ${C.warmGold} 20%, ${C.warmGold} 80%, transparent 100%)`
                : "rgba(var(--sand-100-rgb),0.08)",
              borderRadius: 2, position: "relative",
              transition: "background 0.6s ease",
              animation: membraneGlow ? "membranePulse 0.4s ease-out" : undefined,
              boxShadow: membraneActive ? "0 0 12px 2px rgba(var(--warm-gold-rgb),0.15)" : "none",
            }}>
              {/* Shield icon on membrane */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(var(--espresso-rgb),0.95)",
                border: `1.5px solid ${membraneActive ? C.warmGold : "rgba(var(--sand-100-rgb),0.12)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 0.4s ease",
                zIndex: 5,
              }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 5.5V10C3 14.5 6 17.5 10 19C14 17.5 17 14.5 17 10V5.5L10 2Z"
                    fill={membraneActive ? "rgba(var(--warm-gold-rgb),0.2)" : "rgba(var(--sand-100-rgb),0.05)"}
                    stroke={membraneActive ? C.warmGold : "rgba(var(--sand-100-rgb),0.15)"} strokeWidth="1.2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: masked data zone */}
          <div style={{ position: "relative" }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500,
              color: "rgba(var(--sand-100-rgb),0.20)", textTransform: "uppercase",
              letterSpacing: "0.1em", marginBottom: 10, paddingLeft: 2,
            }}>Delivered to user</div>

            <div style={{
              background: "rgba(var(--sand-100-rgb),0.03)", border: "1px solid rgba(var(--sand-100-rgb),0.06)",
              borderRadius: 8, overflow: "hidden",
            }}>
              {ROWS.map((row, i) => {
                const phase = rowPhases[i];
                const show = phase === "through";
                return (
                  <div key={i} style={{
                    padding: "8px 12px",
                    borderBottom: i < ROWS.length - 1 ? "1px solid rgba(var(--sand-100-rgb),0.04)" : "none",
                    opacity: show ? 1 : 0,
                    transform: show ? "translateX(0)" : "translateX(10px)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    minHeight: 36, display: "flex", flexDirection: "column", justifyContent: "center", gap: 2,
                  }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {row.masked.slice(0, 2).map((m, j) => (
                        <span key={j} style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                          fontWeight: 600, color: C.warmGold,
                        }}>{m}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {row.masked.slice(2).map((m, j) => (
                        <span key={j} style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                          fontWeight: 600, color: C.warmGold, opacity: 0.7,
                        }}>{m}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom tags */}
        <div style={{
          display: "flex", gap: 8, marginTop: 16, position: "relative", zIndex: 1,
          opacity: allDone ? 1 : 0, transform: allDone ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.5s ease, transform 0.5s ease", height: 20,
        }}>
          {["No schema required", "Zero-config proxy", "GDPR", "HIPAA"].map((tag) => (
            <span key={tag} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600,
              textTransform: "uppercase", color: "rgba(var(--sand-100-rgb),0.25)",
              background: "rgba(var(--sand-100-rgb),0.04)", padding: "2px 8px",
              borderRadius: 99, letterSpacing: "0.04em",
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}
