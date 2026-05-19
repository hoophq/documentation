export const PipelineFlow = () => {
  const FONTS_URL =
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap";

  const C = {
    espresso: "var(--gradient-dark-mid)",
    warmGold: "var(--warm-gold)",
    sand100: "var(--sand-100)",
    sand300: "var(--sand-300)",
    sand500: "var(--sand-500)",
  };

  const PACKETS = [
    { raw: "Sarah Chen, sarah.chen@acme.io, 284-19-7653", masked: "[PERSON], [EMAIL], [SSN]", label: "PII + Gov. ID" },
    { raw: "Marcus Webb, m.webb@globex.com, 531-77-0294", masked: "[PERSON], [EMAIL], [SSN]", label: "PII + Gov. ID" },
    { raw: "Elena Ruiz, eruiz@initech.co, 719-42-8106", masked: "[PERSON], [EMAIL], [SSN]", label: "PII + Gov. ID" },
    { raw: "James Okafor, j.okafor@stark.dev, 603-88-1542", masked: "[PERSON], [EMAIL], [SSN]", label: "PII + Gov. ID" },
  ];

  const PACKET_DELAY = 900;

  function ZoneLabel({ children, icon, center, right }) {
    const icons = {
      db: (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <ellipse cx="8" cy="4" rx="5.5" ry="2.5" stroke="rgba(var(--sand-100-rgb),0.25)" strokeWidth="1" />
          <path d="M2.5 4v8c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5V4" stroke="rgba(var(--sand-100-rgb),0.25)" strokeWidth="1" />
          <path d="M2.5 8c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5" stroke="rgba(var(--sand-100-rgb),0.15)" strokeWidth="1" />
        </svg>
      ),
      shield: (
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L3 5.5V10C3 14.5 6 17.5 10 19C14 17.5 17 14.5 17 10V5.5L10 2Z"
            stroke="var(--warm-gold)" strokeWidth="1.2" fill="none" />
        </svg>
      ),
      user: (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="3" stroke="rgba(var(--sand-100-rgb),0.25)" strokeWidth="1" />
          <path d="M2 14c0-2.76 2.69-5 6-5s6 2.24 6 5" stroke="rgba(var(--sand-100-rgb),0.25)" strokeWidth="1" />
        </svg>
      ),
    };

    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        justifyContent: center ? "center" : right ? "flex-end" : "flex-start",
      }}>
        {icons[icon]}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500,
          color: icon === "shield" ? "rgba(var(--warm-gold-rgb),0.5)" : "rgba(var(--sand-100-rgb),0.25)",
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>{children}</span>
      </div>
    );
  }

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

  // Per-packet: "hidden" | "lane1" | "gateway" | "lane2" | "arrived"
  const [packetStates, setPacketStates] = useState(PACKETS.map(() => "hidden"));
  const [gatewayFlash, setGatewayFlash] = useState(-1);
  const [allDone, setAllDone] = useState(false);
  const [detectionLabel, setDetectionLabel] = useState("");
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
      setPacketStates(PACKETS.map(() => "hidden"));
      setGatewayFlash(-1);
      setAllDone(false);
      setDetectionLabel("");

      PACKETS.forEach((pkt, i) => {
        const t0 = 600 + i * PACKET_DELAY;

        // Packet enters lane 1 (raw, traveling toward gateway)
        later(() => {
          if (cancelled) return;
          setPacketStates(p => { const n = [...p]; n[i] = "lane1"; return n; });
        }, t0);

        // Packet hits gateway (transform moment)
        later(() => {
          if (cancelled) return;
          setPacketStates(p => { const n = [...p]; n[i] = "gateway"; return n; });
          setGatewayFlash(i);
          setDetectionLabel(pkt.label);
        }, t0 + 600);

        // Packet exits gateway into lane 2 (masked)
        later(() => {
          if (cancelled) return;
          setPacketStates(p => { const n = [...p]; n[i] = "lane2"; return n; });
          setDetectionLabel("");
        }, t0 + 1100);

        // Packet arrives
        later(() => {
          if (cancelled) return;
          setPacketStates(p => { const n = [...p]; n[i] = "arrived"; return n; });
          setGatewayFlash(-1);
        }, t0 + 1600);
      });

      const total = 600 + (PACKETS.length - 1) * PACKET_DELAY + 1800;
      later(() => { if (!cancelled) setAllDone(true); }, total);
      later(() => { if (!cancelled) cycle(); }, total + 3000);
    };

    cycle();
    return () => { cancelled = true; clearAll(); };
  }, [later, clearAll]);

  const anyActive = packetStates.some(s => s !== "hidden");

  return (
    <>
      <link rel="stylesheet" href={FONTS_URL} />
      <style>{`
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes gatewayPulse {
          0% { box-shadow: 0 0 0 0 rgba(var(--warm-gold-rgb),0); }
          50% { box-shadow: 0 0 20px 6px rgba(var(--warm-gold-rgb),0.25); }
          100% { box-shadow: 0 0 0 0 rgba(var(--warm-gold-rgb),0); }
        }
        @keyframes packetGlow {
          0% { opacity: 0; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes detectionPop {
          0% { opacity: 0; transform: translateY(6px) scale(0.85); }
          30% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-4px) scale(0.95); }
        }
        @keyframes shieldIn {
          0% { opacity:0; transform:scale(0.6); }
          60% { opacity:1; transform:scale(1.08); }
          100% { opacity:1; transform:scale(1); }
        }
        @keyframes dotTravel {
          0% { opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>

      <div style={{
        background: "linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)",
        borderRadius: 14, padding: "32px 32px 28px",
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative", overflow: "hidden", maxWidth: 760, margin: "0 auto",
      }}>
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
          <ShieldIcon done={allDone} active={anyActive} />
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
            color: C.sand100, letterSpacing: "-0.01em",
          }}>Live Data Masking</span>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: allDone ? C.warmGold : anyActive ? C.warmGold : "rgba(var(--sand-100-rgb),0.18)",
            background: allDone ? "rgba(var(--warm-gold-rgb),0.10)" : anyActive ? "rgba(var(--warm-gold-rgb),0.10)" : "rgba(var(--sand-100-rgb),0.04)",
            padding: "2px 8px", borderRadius: 99, transition: "all 0.3s ease",
          }}>{allDone ? "Protected" : anyActive ? "Intercepting" : "Ready"}</span>
        </div>

        {/* Pipeline visualization */}
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Three zone headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 100px 1fr", gap: 0,
            marginBottom: 12,
          }}>
            <ZoneLabel icon="db">Database</ZoneLabel>
            <ZoneLabel icon="shield" center>Hoop Gateway</ZoneLabel>
            <ZoneLabel icon="user" right>User terminal</ZoneLabel>
          </div>

          {/* Pipeline lanes */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 100px 1fr", gap: 0,
            minHeight: 240,
          }}>
            {/* Left lane: raw packets */}
            <div style={{
              background: "rgba(var(--sand-100-rgb),0.03)",
              border: "1px solid rgba(var(--sand-100-rgb),0.06)",
              borderRadius: "8px 0 0 8px",
              borderRight: "none",
              padding: "8px 10px",
              display: "flex", flexDirection: "column", gap: 6,
            }}>
              {PACKETS.map((pkt, i) => {
                const st = packetStates[i];
                const show = st === "lane1";
                const faded = st === "gateway" || st === "lane2" || st === "arrived";
                return (
                  <div key={i} style={{
                    background: show ? "rgba(var(--sand-100-rgb),0.04)" : "transparent",
                    border: show ? "1px solid rgba(var(--sand-100-rgb),0.08)" : "1px solid transparent",
                    borderRadius: 6, padding: "7px 10px", minHeight: 48,
                    opacity: show ? 1 : faded ? 0.1 : 0,
                    transform: show ? "translateX(0)" : faded ? "translateX(0)" : "translateX(-12px)",
                    transition: "all 0.35s ease",
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                      color: "rgba(var(--sand-100-rgb),0.50)", whiteSpace: "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis",
                    }}>{pkt.raw}</div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 9,
                      color: "rgba(var(--sand-100-rgb),0.20)", marginTop: 3,
                    }}>Unmasked row {i + 1}</div>
                  </div>
                );
              })}
            </div>

            {/* Center: gateway */}
            <div style={{
              background: "rgba(var(--sand-100-rgb),0.02)",
              borderTop: "1px solid rgba(var(--sand-100-rgb),0.06)",
              borderBottom: "1px solid rgba(var(--sand-100-rgb),0.06)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              {/* Gateway core */}
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: gatewayFlash >= 0
                  ? "rgba(var(--warm-gold-rgb),0.12)"
                  : "rgba(var(--sand-100-rgb),0.04)",
                border: `1.5px solid ${gatewayFlash >= 0 ? C.warmGold : "rgba(var(--sand-100-rgb),0.10)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
                animation: gatewayFlash >= 0 ? "gatewayPulse 0.5s ease-out" : undefined,
              }}>
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 5.5V10C3 14.5 6 17.5 10 19C14 17.5 17 14.5 17 10V5.5L10 2Z"
                    fill={gatewayFlash >= 0 ? "rgba(var(--warm-gold-rgb),0.25)" : "rgba(var(--sand-100-rgb),0.06)"}
                    stroke={gatewayFlash >= 0 ? C.warmGold : "rgba(var(--sand-100-rgb),0.20)"}
                    strokeWidth="1.2" />
                  {gatewayFlash >= 0 && (
                    <path d="M7 10.5L9 12.5L13 8" stroke={C.warmGold} strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </div>

              {/* Detection label */}
              <div style={{
                marginTop: 8, minHeight: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {detectionLabel && (
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 600,
                    color: C.warmGold, background: "rgba(var(--espresso-rgb),0.95)",
                    border: "1px solid rgba(var(--warm-gold-rgb),0.3)",
                    padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
                    animation: "detectionPop 0.8s ease-out forwards",
                  }}>{detectionLabel}</span>
                )}
              </div>

              {/* Connector dots (left) */}
              <div style={{
                position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: gatewayFlash >= 0 ? C.warmGold : "rgba(var(--sand-100-rgb),0.15)",
                    transition: "background 0.2s ease",
                    opacity: gatewayFlash >= 0 ? 1 : 0.5,
                  }} />
                ))}
              </div>
              {/* Connector dots (right) */}
              <div style={{
                position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: gatewayFlash >= 0 ? C.warmGold : "rgba(var(--sand-100-rgb),0.15)",
                    transition: "background 0.2s ease",
                    opacity: gatewayFlash >= 0 ? 1 : 0.5,
                  }} />
                ))}
              </div>
            </div>

            {/* Right lane: masked packets */}
            <div style={{
              background: "rgba(var(--sand-100-rgb),0.03)",
              border: "1px solid rgba(var(--sand-100-rgb),0.06)",
              borderRadius: "0 8px 8px 0",
              borderLeft: "none",
              padding: "8px 10px",
              display: "flex", flexDirection: "column", gap: 6,
            }}>
              {PACKETS.map((pkt, i) => {
                const st = packetStates[i];
                const show = st === "lane2" || st === "arrived";
                return (
                  <div key={i} style={{
                    background: show ? "rgba(var(--warm-gold-rgb),0.06)" : "transparent",
                    border: show ? "1px solid rgba(var(--warm-gold-rgb),0.12)" : "1px solid transparent",
                    borderRadius: 6, padding: "7px 10px", minHeight: 48,
                    opacity: show ? 1 : 0,
                    transform: show ? "translateX(0)" : "translateX(12px)",
                    transition: "all 0.4s ease",
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                      fontWeight: 600, color: C.warmGold, whiteSpace: "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis",
                      animation: show ? "packetGlow 0.4s ease-out" : undefined,
                    }}>{pkt.masked}</div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 9,
                      color: "rgba(var(--sand-100-rgb),0.20)", marginTop: 3,
                    }}>Masked row {i + 1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer tags */}
        <div style={{
          display: "flex", gap: 8, marginTop: 16, position: "relative", zIndex: 1,
          opacity: allDone ? 1 : 0, transform: allDone ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.5s ease, transform 0.5s ease", height: 20,
        }}>
          {["In-transit proxy", "No schema required", "GDPR", "HIPAA", "PCI DSS"].map((tag) => (
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
}
