export const KubernetesNativeMasking = () => {
  const FONT_URL =
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap";

  const C = {
    sand100: "var(--sand-100)",
    sand300: "var(--sand-300)",
    sand500: "var(--sand-500)",
    warmGold: "var(--warm-gold)",
    blocked: "var(--error)",
    info: "rgba(var(--sand-100-rgb),0.45)",
    warn: "var(--warm-gold)",
    error: "var(--error)",
    dim: "rgba(var(--sand-100-rgb),0.3)",
    green: "#4A7C59",
    blue: "#5B8CB8",
  };

  const animationStyles = `
    @keyframes typeCursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes shieldFlash {
      0% { opacity: 0; transform: scale(0.8); }
      30% { opacity: 1; transform: scale(1.1); }
      100% { opacity: 0; transform: scale(1.3); }
    }
    @keyframes fadeInLine {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseBlock {
      0%, 100% { box-shadow: 0 0 0 0 rgba(199,107,74,0); }
      50% { box-shadow: 0 0 20px 4px rgba(199,107,74,0.25); }
    }
    @keyframes streamDot {
      0% { opacity: 0.3; }
      50% { opacity: 1; }
      100% { opacity: 0.3; }
    }
  `;

  const LOG_LINES = [
    {
      time: "2026-03-22 14:22:01",
      level: "INFO",
      parts: [
        { text: "User authenticated: ", masked: false },
        { text: "[EMAIL]", masked: true },
        { text: " from ", masked: false },
        { text: "[IP]", masked: true },
      ],
    },
    {
      time: "2026-03-22 14:22:03",
      level: "INFO",
      parts: [
        { text: "Query executed: SELECT * FROM users WHERE id=", masked: false },
        { text: "[REDACTED]", masked: true },
      ],
    },
    {
      time: "2026-03-22 14:22:05",
      level: "WARN",
      parts: [
        { text: "Rate limit: ", masked: false },
        { text: "[EMAIL]", masked: true },
        { text: " exceeded 100 req/min", masked: false },
      ],
    },
    {
      time: "2026-03-22 14:22:08",
      level: "INFO",
      parts: [
        { text: "Payment: card=", masked: false },
        { text: "[PCI]", masked: true },
        { text: " amount=$1,250.00 user=", masked: false },
        { text: "[EMAIL]", masked: true },
      ],
    },
    {
      time: "2026-03-22 14:22:11",
      level: "ERROR",
      parts: [
        { text: "Auth failed: ", masked: false },
        { text: "[EMAIL]", masked: true },
        { text: " invalid token from ", masked: false },
        { text: "[IP]", masked: true },
      ],
    },
  ];

  const KUBECTL_SEQUENCE = [
    {
      command: "kubectl logs api-server-7d9f8b -n production --tail=3",
      output: [
        { text: `[2026-03-22 14:22:05] WARN  Rate limit: `, parts: [{ text: "[EMAIL]", masked: true }], suffix: " exceeded 100 req/min" },
        { text: `[2026-03-22 14:22:08] INFO  Payment: card=`, parts: [{ text: "[PCI]", masked: true }], suffix: ` amount=$1,250.00 user=`, parts2: [{ text: "[EMAIL]", masked: true }] },
        { text: `[2026-03-22 14:22:11] ERROR Auth failed: `, parts: [{ text: "[EMAIL]", masked: true }], suffix: ` invalid token from `, parts2: [{ text: "[IP]", masked: true }] },
      ],
      blocked: false,
    },
    {
      command: "kubectl exec -it api-server-7d9f8b -- cat /tmp/debug.log",
      output: [
        { text: `session_token=`, parts: [{ text: "[REDACTED]", masked: true }], suffix: ` user_email=`, parts2: [{ text: "[EMAIL]", masked: true }] },
        { text: `db_password=`, parts: [{ text: "[REDACTED]", masked: true }], suffix: ` host=10.0.`, parts2: [{ text: "[IP]", masked: true }] },
        { text: `api_key=`, parts: [{ text: "[REDACTED]", masked: true }], suffix: ` card=`, parts2: [{ text: "[PCI]", masked: true }] },
      ],
      blocked: false,
    },
    {
      command: "kubectl delete namespace production",
      output: [],
      blocked: true,
      blockMessage: "hoop | BLOCKED: destructive operation (delete namespace) requires approval",
    },
  ];

  const K8sIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2L4 9v14l12 7 12-7V9L16 2z"
        stroke="#5B8CB8"
        strokeWidth="1.5"
        fill="rgba(91,140,184,0.1)"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3" stroke="#5B8CB8" strokeWidth="1.2" fill="none" />
      <g stroke="#5B8CB8" strokeWidth="1" opacity="0.6">
        <line x1="16" y1="13" x2="16" y2="6" />
        <line x1="16" y1="19" x2="16" y2="26" />
        <line x1="13.4" y1="14.5" x2="7.5" y2="11" />
        <line x1="18.6" y1="17.5" x2="24.5" y2="21" />
        <line x1="18.6" y1="14.5" x2="24.5" y2="11" />
        <line x1="13.4" y1="17.5" x2="7.5" y2="21" />
      </g>
    </svg>
  );

  const ShieldIcon = ({ active, size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={active ? { animation: "shieldFlash 0.6s ease-out" } : undefined}
    >
      <path
        d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z"
        fill={active ? "rgba(199,107,74,0.2)" : "none"}
        stroke={active ? C.blocked : C.sand500}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {active && (
        <>
          <line x1="8" y1="8" x2="16" y2="16" stroke={C.blocked} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="8" x2="8" y2="16" stroke={C.blocked} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  function levelColor(level) {
    if (level === "WARN") return C.warn;
    if (level === "ERROR") return C.error;
    return C.info;
  }

  function LogLine({ line, style }) {
    return (
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        lineHeight: "18px",
        whiteSpace: "nowrap",
        animation: "fadeInLine 0.3s ease-out",
        ...style,
      }}>
        <span style={{ color: C.dim }}>[{line.time}] </span>
        <span style={{ color: levelColor(line.level), fontWeight: 500 }}>
          {line.level.padEnd(5)}
        </span>
        <span style={{ color: "rgba(var(--sand-100-rgb),0.55)" }}> </span>
        {line.parts.map((p, i) =>
          p.masked ? (
            <span key={i} style={{ color: C.warmGold, fontWeight: 700 }}>{p.text}</span>
          ) : (
            <span key={i} style={{ color: "rgba(var(--sand-100-rgb),0.55)" }}>{p.text}</span>
          )
        )}
      </div>
    );
  }

  function KubectlOutputLine({ item }) {
    return (
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        lineHeight: "17px",
        whiteSpace: "nowrap",
        animation: "fadeInLine 0.25s ease-out",
      }}>
        <span style={{ color: "rgba(var(--sand-100-rgb),0.5)" }}>{item.text}</span>
        {item.parts?.map((p, i) => (
          <span key={i} style={{ color: C.warmGold, fontWeight: 700 }}>{p.text}</span>
        ))}
        {item.suffix && <span style={{ color: "rgba(var(--sand-100-rgb),0.5)" }}>{item.suffix}</span>}
        {item.parts2?.map((p, i) => (
          <span key={`b${i}`} style={{ color: C.warmGold, fontWeight: 700 }}>{p.text}</span>
        ))}
      </div>
    );
  }

  const [lensLogs, setLensLogs] = useState([]);
  const [kubectlState, setKubectlState] = useState({ cmdIdx: -1, typed: "", output: [], showBlock: false, cursorVisible: true });
  const [shieldActive, setShieldActive] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const timeouts = useRef([]);
  const cycleRef = useRef(null);

  const clearAll = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeouts.current.push(id);
    return id;
  }, []);

  // Left panel: streaming log lines
  useEffect(() => {
    let cancelled = false;
    let idx = 0;

    const streamLog = () => {
      if (cancelled) return;
      setLensLogs(prev => {
        const next = [...prev, LOG_LINES[idx % LOG_LINES.length]];
        // keep last 5 lines visible
        return next.slice(-5);
      });
      idx++;
    };

    const startStream = () => {
      if (cancelled) return;
      setLensLogs([]);
      idx = 0;
      // Stream lines every 1.2s
      const streamLine = (i) => {
        if (cancelled || i >= LOG_LINES.length) return;
        later(() => {
          streamLog();
          streamLine(i + 1);
        }, 1200);
      };
      streamLine(0);
    };

    // Initial stream starts immediately
    later(startStream, 300);

    return () => { cancelled = true; clearAll(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Right panel: sequential kubectl commands
  useEffect(() => {
    let cancelled = false;

    const typeCommand = (cmd, onDone) => {
      let i = 0;
      const typeChar = () => {
        if (cancelled) return;
        i++;
        setKubectlState(prev => ({ ...prev, typed: cmd.slice(0, i), cursorVisible: true }));
        if (i < cmd.length) {
          later(typeChar, 30 + Math.random() * 25);
        } else {
          later(onDone, 400);
        }
      };
      later(typeChar, 200);
    };

    const runSequence = () => {
      if (cancelled) return;
      setKubectlState({ cmdIdx: -1, typed: "", output: [], showBlock: false, cursorVisible: true });
      setShieldActive(false);
      setFadingOut(false);

      let totalDelay = 800; // initial delay

      KUBECTL_SEQUENCE.forEach((step, sIdx) => {
        const startDelay = totalDelay;

        // Start typing command
        later(() => {
          if (cancelled) return;
          setKubectlState(prev => ({ ...prev, cmdIdx: sIdx, typed: "", output: [], showBlock: false }));
          typeCommand(step.command, () => {
            if (cancelled) return;
            // Show output
            if (step.blocked) {
              later(() => {
                if (cancelled) return;
                setKubectlState(prev => ({ ...prev, showBlock: true, cursorVisible: false }));
                setShieldActive(true);
                later(() => setShieldActive(false), 800);
              }, 300);
            } else {
              // Show output lines one by one
              step.output.forEach((_, oIdx) => {
                later(() => {
                  if (cancelled) return;
                  setKubectlState(prev => ({
                    ...prev,
                    output: step.output.slice(0, oIdx + 1),
                  }));
                }, 200 + oIdx * 150);
              });
            }
          });
        }, startDelay);

        // Calculate time for this step
        const typingTime = step.command.length * 42 + 400;
        const outputTime = step.blocked ? 1200 : step.output.length * 150 + 600;
        totalDelay += typingTime + outputTime + 1000; // gap between commands
      });

      // Hold, fade, restart
      later(() => {
        if (cancelled) return;
        setFadingOut(true);
        later(() => {
          if (cancelled) return;
          setLensLogs([]);
          setKubectlState({ cmdIdx: -1, typed: "", output: [], showBlock: false, cursorVisible: true });
          later(runSequence, 500);
        }, 800);
      }, totalDelay + 3000);
    };

    cycleRef.current = runSequence;
    later(runSequence, 100);

    return () => { cancelled = true; clearAll(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const panelBg = "rgba(var(--sand-100-rgb),0.04)";
  const panelBorder = "rgba(var(--sand-100-rgb),0.08)";
  const chromeBg = "rgba(var(--sand-100-rgb),0.06)";

  const maskedCount = lensLogs.reduce((acc, l) => acc + l.parts.filter(p => p.masked).length, 0);

  return (
    <div style={{
      maxWidth: 700,
      width: "100%",
      margin: "0 auto",
      fontFamily: "'Inter', sans-serif",
      opacity: fadingOut ? 0 : 1,
      transition: "opacity 0.8s ease",
    }}>
      <style>{animationStyles}</style>
      <link rel="stylesheet" href={FONT_URL} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        height: 380,
        overflow: "hidden",
      }}>
        {/* Left Panel: Lens-style pod log viewer */}
        <div style={{
          background: panelBg,
          border: `1px solid ${panelBorder}`,
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Lens chrome */}
          <div style={{
            background: chromeBg,
            borderBottom: `1px solid ${panelBorder}`,
            padding: "7px 10px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <K8sIcon size={13} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(var(--sand-100-rgb),0.7)",
              letterSpacing: 0.3,
            }}>Lens</span>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
            </div>
          </div>

          {/* Tab bar */}
          <div style={{
            padding: "4px 10px",
            borderBottom: `1px solid ${panelBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: C.blue,
              fontWeight: 500,
              padding: "2px 6px",
              background: "rgba(91,140,184,0.08)",
              borderRadius: 4,
              borderBottom: `1.5px solid ${C.blue}`,
            }}>
              Pod Logs &middot; api-server-7d9f8b
            </div>
          </div>

          {/* Header bar */}
          <div style={{
            padding: "5px 10px",
            borderBottom: `1px solid ${panelBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(var(--sand-100-rgb),0.4)",
              background: "rgba(var(--sand-100-rgb),0.04)",
              padding: "1px 5px",
              borderRadius: 3,
              border: "1px solid rgba(var(--sand-100-rgb),0.06)",
            }}>production</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(var(--sand-100-rgb),0.35)",
            }}>api-server-7d9f8b</span>
            <div style={{ flex: 1 }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8,
              color: C.green,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: C.green,
                animation: "streamDot 1.5s ease-in-out infinite",
              }} />
              Streaming
            </span>
          </div>

          {/* Log lines */}
          <div style={{
            padding: "6px 8px",
            flex: 1,
            minHeight: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            overflow: "hidden",
          }}>
            {lensLogs.map((line, i) => (
              <LogLine key={`${line.time}-${i}`} line={line} />
            ))}
          </div>

          {/* Status bar */}
          <div style={{
            padding: "4px 10px",
            borderTop: `1px solid ${panelBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8,
              color: "rgba(var(--sand-100-rgb),0.3)",
            }}>
              {lensLogs.length} events &middot; {maskedCount} fields masked &middot; via hoop gateway
            </span>
          </div>
        </div>

        {/* Right Panel: kubectl terminal */}
        <div style={{
          background: panelBg,
          border: `1px solid ${panelBorder}`,
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Terminal chrome */}
          <div style={{
            background: chromeBg,
            borderBottom: `1px solid ${panelBorder}`,
            padding: "7px 10px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(var(--sand-100-rgb),0.7)",
              letterSpacing: 0.3,
            }}>Terminal &mdash; kubectl</span>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
            </div>
          </div>

          {/* Terminal content */}
          <div style={{
            padding: "8px 10px",
            flex: 1,
            minHeight: 160,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            lineHeight: "17px",
            overflow: "hidden",
          }}>
            {KUBECTL_SEQUENCE.map((step, sIdx) => {
              if (sIdx > kubectlState.cmdIdx) return null;
              const isCurrent = sIdx === kubectlState.cmdIdx;
              const prevComplete = sIdx < kubectlState.cmdIdx;

              return (
                <div key={sIdx} style={{ marginBottom: 8 }}>
                  {/* Command line */}
                  <div style={{ whiteSpace: "nowrap" }}>
                    <span style={{ color: C.green, fontWeight: 500 }}>$ </span>
                    <span style={{ color: "rgba(var(--sand-100-rgb),0.75)" }}>
                      {isCurrent ? kubectlState.typed : step.command}
                    </span>
                    {isCurrent && kubectlState.cursorVisible && !prevComplete && kubectlState.typed.length < step.command.length && (
                      <span style={{
                        display: "inline-block",
                        width: 6,
                        height: 13,
                        background: "rgba(var(--sand-100-rgb),0.6)",
                        marginLeft: 1,
                        verticalAlign: "text-bottom",
                        animation: "typeCursor 0.8s step-end infinite",
                      }} />
                    )}
                  </div>

                  {/* Output */}
                  {(prevComplete ? step.output : kubectlState.output).map((item, oIdx) => (
                    <KubectlOutputLine key={oIdx} item={item} />
                  ))}

                  {/* Block message */}
                  {step.blocked && (isCurrent ? kubectlState.showBlock : prevComplete) && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 3,
                      padding: "4px 8px",
                      borderRadius: 5,
                      background: "rgba(199,107,74,0.08)",
                      border: "1px solid rgba(199,107,74,0.15)",
                      animation: isCurrent ? "pulseBlock 1s ease-out" : "none",
                    }}>
                      <ShieldIcon active={shieldActive} size={14} />
                      <span style={{
                        color: C.blocked,
                        fontWeight: 600,
                        fontSize: 9,
                      }}>
                        {step.blockMessage}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Cursor when idle */}
            {kubectlState.cmdIdx === -1 && (
              <div>
                <span style={{ color: C.green, fontWeight: 500 }}>$ </span>
                <span style={{
                  display: "inline-block",
                  width: 6,
                  height: 13,
                  background: "rgba(var(--sand-100-rgb),0.6)",
                  verticalAlign: "text-bottom",
                  animation: "typeCursor 0.8s step-end infinite",
                }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
