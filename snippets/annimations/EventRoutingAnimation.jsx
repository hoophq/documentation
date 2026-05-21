export const EventRoutingAnimation = () => {
  const FONTS_URL =
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap";

  const C = {
    warmGold: "var(--warm-gold)",
    sand100: "var(--sand-100)",
  };

  const ROWS = [
    {
      event: "session.guardrail_violation",
      category: "Session",
      runbook: "quarantine-connection",
      duration: "198 ms",
    },
    {
      event: "alert.sensitive_data_detected",
      category: "Alert",
      runbook: "revoke-ai-agent-access",
      duration: "241 ms",
    },
    {
      event: "session.anomaly_detected",
      category: "Session",
      runbook: "page-oncall",
      duration: "167 ms",
    },
  ];

  const ROW_DELAY = 1700;
  const CROSS_DURATION = 550;
  const HOLD = 2800;

  function RouterIcon({ active, done }) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 22 20"
        fill="none"
        style={{
          animation: done ? "erRouteIn 0.5s ease-out" : undefined,
          opacity: active ? 1 : 0.3,
          transition: "opacity 0.4s ease",
        }}
      >
        <circle
          cx="3" cy="10" r="2.5"
          fill={done ? "rgba(var(--warm-gold-rgb),0.15)" : "rgba(var(--sand-100-rgb),0.05)"}
          stroke={done ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.15)"}
          strokeWidth="1.2"
        />
        <circle
          cx="19" cy="5" r="2.5"
          fill={done ? "rgba(var(--warm-gold-rgb),0.15)" : "rgba(var(--sand-100-rgb),0.05)"}
          stroke={done ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.15)"}
          strokeWidth="1.2"
        />
        <circle
          cx="19" cy="15" r="2.5"
          fill={done ? "rgba(var(--warm-gold-rgb),0.15)" : "rgba(var(--sand-100-rgb),0.05)"}
          stroke={done ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.15)"}
          strokeWidth="1.2"
        />
        {done && (
          <path
            d="M5.5 10H10.5M10.5 10L16.5 5M10.5 10L16.5 15"
            stroke="var(--warm-gold)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    );
  }

  const [rowPhases, setRowPhases] = useState(ROWS.map(() => "hidden"));
  const [dispatchPhases, setDispatchPhases] = useState(ROWS.map(() => "hidden"));
  const [allDone, setAllDone] = useState(false);
  const [routerActive, setRouterActive] = useState(false);
  const [routerGlow, setRouterGlow] = useState(false);
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
      setDispatchPhases(ROWS.map(() => "hidden"));
      setAllDone(false);
      setRouterActive(false);
      setRouterGlow(false);

      later(() => {
        if (cancelled) return;
        setRouterActive(true);
      }, 300);

      ROWS.forEach((_, i) => {
        const t0 = 600 + i * ROW_DELAY;

        later(() => {
          if (cancelled) return;
          setRowPhases(p => { const n = [...p]; n[i] = "approaching"; return n; });
        }, t0);

        later(() => {
          if (cancelled) return;
          setRowPhases(p => { const n = [...p]; n[i] = "crossing"; return n; });
          setRouterGlow(true);
          later(() => { if (!cancelled) setRouterGlow(false); }, 350);
        }, t0 + 500);

        later(() => {
          if (cancelled) return;
          setRowPhases(p => { const n = [...p]; n[i] = "through"; return n; });
          setDispatchPhases(p => { const n = [...p]; n[i] = "processing"; return n; });
        }, t0 + 500 + CROSS_DURATION);

        later(() => {
          if (cancelled) return;
          setDispatchPhases(p => { const n = [...p]; n[i] = "delivered"; return n; });
        }, t0 + 500 + CROSS_DURATION + 700);
      });

      const total = 600 + (ROWS.length - 1) * ROW_DELAY + 500 + CROSS_DURATION + 900;
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
        @keyframes erRouteIn {
          0%   { opacity: 0; transform: scale(0.6); }
          60%  { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes erNodePulse {
          0%, 100% { box-shadow: 0 0 8px 0 rgba(var(--warm-gold-rgb), 0.10); }
          50%       { box-shadow: 0 0 24px 4px rgba(var(--warm-gold-rgb), 0.35); }
        }
        @keyframes erSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        height: "100%", boxSizing: "border-box",
        padding: "20px 20px 16px",
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        display: "flex", flexDirection: "column",
      }}>

        <div style={{
          position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "160%",
          background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 24, position: "relative", zIndex: 1,
        }}>
          <RouterIcon done={allDone} active={routerActive} />
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
            color: C.sand100, letterSpacing: "-0.01em",
          }}>Event Routing</span>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: allDone ? C.warmGold : "rgba(var(--sand-100-rgb),0.18)",
            background: allDone ? "rgba(var(--warm-gold-rgb),0.10)" : "rgba(var(--sand-100-rgb),0.04)",
            padding: "2px 8px", borderRadius: 99, transition: "all 0.3s ease",
          }}>
            {allDone ? "3 dispatched" : routerGlow ? "Routing" : "Active"}
          </span>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 52px 1fr",
          gap: 0, position: "relative", zIndex: 1,
          flex: 1, minHeight: 0,
        }}>

          <div style={{ position: "relative", display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500,
              color: "rgba(var(--sand-100-rgb),0.20)", textTransform: "uppercase",
              letterSpacing: "0.1em", marginBottom: 10, paddingLeft: 2, flexShrink: 0,
            }}>Platform events</div>

            <div style={{
              background: "rgba(var(--sand-100-rgb),0.03)",
              border: "1px solid rgba(var(--sand-100-rgb),0.06)",
              borderRadius: 8, overflow: "hidden", flex: 1,
            }}>
              {ROWS.map((row, i) => {
                const phase = rowPhases[i];
                const show = phase === "approaching" || phase === "crossing";
                return (
                  <div key={i} style={{
                    padding: "9px 12px",
                    borderBottom: i < ROWS.length - 1 ? "1px solid rgba(var(--sand-100-rgb),0.04)" : "none",
                    opacity: show ? 1 : phase === "through" ? 0.14 : 0,
                    transform: show ? "translateX(0)" : phase === "hidden" ? "translateX(-10px)" : "translateX(0)",
                    transition: phase === "through"
                      ? "opacity 0.5s ease"
                      : "opacity 0.3s ease, transform 0.3s ease",
                    height: 64, boxSizing: "border-box",
                    display: "flex", flexDirection: "column", justifyContent: "center", gap: 5,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                        background: show ? C.warmGold : "rgba(var(--sand-100-rgb),0.2)",
                        boxShadow: show ? "0 0 5px rgba(var(--warm-gold-rgb),0.5)" : "none",
                        transition: "background 0.3s, box-shadow 0.3s",
                      }} />
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        color: "rgba(var(--sand-100-rgb),0.50)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        flex: 1, minWidth: 0,
                      }}>{row.event}</span>
                    </div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 500,
                      color: "rgba(var(--sand-100-rgb),0.20)", paddingLeft: 10,
                    }}>{row.category}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", height: "100%",
          }}>
            <div style={{
              width: 3, height: "calc(100% - 20px)", marginTop: 20,
              background: routerActive
                ? "linear-gradient(180deg, transparent 0%, var(--warm-gold) 20%, var(--warm-gold) 80%, transparent 100%)"
                : "rgba(var(--sand-100-rgb),0.08)",
              borderRadius: 2, position: "relative",
              transition: "background 0.6s ease",
              animation: routerGlow ? "erNodePulse 0.4s ease-out" : undefined,
              boxShadow: routerActive ? "0 0 12px 2px rgba(var(--warm-gold-rgb),0.15)" : "none",
            }}>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 32, height: 32, borderRadius: "50%",
                background: routerGlow ? "rgba(var(--warm-gold-rgb),0.12)" : "#1a1614",
                border: `1.5px solid ${routerGlow ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.12)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.3s ease, border-color 0.3s ease",
                animation: routerGlow ? "erNodePulse 0.4s ease-out" : undefined,
                zIndex: 5,
              }}>
                <svg width="13" height="13" viewBox="0 0 20 18" fill="none">
                  <circle cx="2.5" cy="9" r="2"
                    fill={routerGlow ? "rgba(var(--warm-gold-rgb),0.2)" : "rgba(var(--sand-100-rgb),0.05)"}
                    stroke={routerGlow ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.15)"}
                    strokeWidth="1.2"
                  />
                  <circle cx="17.5" cy="3" r="2"
                    fill={routerGlow ? "rgba(var(--warm-gold-rgb),0.2)" : "rgba(var(--sand-100-rgb),0.05)"}
                    stroke={routerGlow ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.15)"}
                    strokeWidth="1.2"
                  />
                  <circle cx="17.5" cy="15" r="2"
                    fill={routerGlow ? "rgba(var(--warm-gold-rgb),0.2)" : "rgba(var(--sand-100-rgb),0.05)"}
                    stroke={routerGlow ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.15)"}
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4.5 9H9.5M9.5 9L15.5 3M9.5 9L15.5 15"
                    stroke={routerGlow ? "var(--warm-gold)" : "rgba(var(--sand-100-rgb),0.15)"}
                    strokeWidth="1.2" strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500,
              color: "rgba(var(--sand-100-rgb),0.20)", textTransform: "uppercase",
              letterSpacing: "0.1em", marginBottom: 10, paddingLeft: 2, flexShrink: 0,
            }}>Runbook dispatches</div>

            <div style={{
              background: "rgba(var(--sand-100-rgb),0.03)",
              border: "1px solid rgba(var(--sand-100-rgb),0.06)",
              borderRadius: 8, overflow: "hidden", flex: 1,
            }}>
              {ROWS.map((row, i) => {
                const dPhase = dispatchPhases[i];
                const show = dPhase === "processing" || dPhase === "delivered";
                return (
                  <div key={i} style={{
                    padding: "9px 12px",
                    borderBottom: i < ROWS.length - 1 ? "1px solid rgba(var(--sand-100-rgb),0.04)" : "none",
                    opacity: show ? 1 : 0,
                    transform: show ? "translateX(0)" : "translateX(10px)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    height: 64, boxSizing: "border-box",
                    display: "flex", flexDirection: "column", justifyContent: "center", gap: 5,
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
                      color: "rgba(var(--sand-100-rgb),0.55)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{row.runbook}</div>

                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {dPhase === "processing" && (
                        <>
                          <div style={{
                            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                            border: "1.5px solid rgba(var(--warm-gold-rgb),0.3)",
                            borderTopColor: C.warmGold,
                            animation: "erSpin 0.7s linear infinite",
                          }} />
                          <span style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 9,
                            color: "rgba(var(--warm-gold-rgb),0.55)",
                          }}>processing</span>
                        </>
                      )}
                      {dPhase === "delivered" && (
                        <>
                          <div style={{
                            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                            background: C.warmGold,
                          }} />
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                            color: C.warmGold,
                          }}>{row.duration}</span>
                          <span style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 9,
                            color: "rgba(var(--sand-100-rgb),0.20)",
                          }}>delivered</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{
          display: "flex", gap: 8, marginTop: 16, position: "relative", zIndex: 1,
          opacity: allDone ? 1 : 0, transform: allDone ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.5s ease, transform 0.5s ease", height: 20,
        }}>
          {["Fully audited", "Replay on failure", "Approval pipeline", "Zero manual intervention"].map((tag) => (
            <span key={tag} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600,
              textTransform: "uppercase", color: "rgba(var(--sand-100-rgb),0.25)",
              background: "rgba(var(--sand-100-rgb),0.04)", padding: "2px 8px",
              borderRadius: 99, letterSpacing: "0.04em",
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
};
