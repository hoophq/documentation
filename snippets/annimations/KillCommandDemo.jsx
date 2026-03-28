export const KillCommandDemo = () => {
  const COMMANDS = [
    { cmd: "SELECT count(*) FROM orders;", blocked: false, rule: null, type: "SELECT" },
    { cmd: "kubectl get pods -n payments", blocked: false, rule: null, type: "READ" },
    { cmd: "DROP TABLE customers;", blocked: true, rule: "Destructive DDL blocked", type: "DROP" },
    { cmd: "DELETE FROM users WHERE 1=1;", blocked: true, rule: "Missing WHERE clause", type: "DELETE" },
    { cmd: "rm -rf /var/data/prod", blocked: true, rule: "Destructive exec blocked", type: "EXEC" },
  ];

  const animationStyles = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulseShield {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(var(--bronze-rgb),0)); }
      50% { transform: scale(1.08); filter: drop-shadow(0 0 12px rgba(var(--bronze-rgb),0.4)); }
    }
    @keyframes pulseShieldBlock {
      0% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(180,60,60,0)); }
      30% { transform: scale(1.15); filter: drop-shadow(0 0 16px rgba(180,60,60,0.5)); }
      100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(180,60,60,0)); }
    }
    @keyframes resultSlide {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scanLine {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
  `;

  const ShieldIcon = ({ state, size = 56 }) => {
    const color = state === "block" ? "#B43C3C" : state === "pass" ? "#4A7C59" : "var(--bronze)";
    const anim = state === "block" ? "pulseShieldBlock 0.5s ease-out" : state === "pass" ? "pulseShield 0.6s ease-out" : "none";
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ animation: anim }}>
        <path
          d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M24 8L10 14.5v9.5c0 9.2 6.4 17.8 14 20 7.6-2.2 14-10.8 14-20v-9.5L24 8z"
          fill={color}
          fillOpacity="0.08"
        />
        {state === "block" && (
          <g stroke="#B43C3C" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="18" x2="30" y2="30" />
            <line x1="30" y1="18" x2="18" y2="30" />
          </g>
        )}
        {state === "pass" && (
          <polyline
            points="16,24 22,30 32,18"
            fill="none"
            stroke="#4A7C59"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {state === "idle" && (
          <g>
            <rect x="19" y="15" width="10" height="3" rx="1.5" fill="var(--bronze)" fillOpacity="0.5" />
            <rect x="17" y="21" width="14" height="3" rx="1.5" fill="var(--bronze)" fillOpacity="0.35" />
            <rect x="19" y="27" width="10" height="3" rx="1.5" fill="var(--bronze)" fillOpacity="0.2" />
          </g>
        )}
      </svg>
    );
  };

  const CommandTag = ({ type }) => {
    const colors = {
      SELECT: { bg: "rgba(var(--bronze-rgb),0.08)", text: "var(--bronze)" },
      READ: { bg: "rgba(var(--bronze-rgb),0.08)", text: "var(--bronze)" },
      DELETE: { bg: "rgba(180,60,60,0.08)", text: "#B43C3C" },
      DROP: { bg: "rgba(180,60,60,0.08)", text: "#B43C3C" },
      EXEC: { bg: "rgba(180,60,60,0.08)", text: "#B43C3C" },
    };
    const c = colors[type] || colors.SELECT;
    return (
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 500,
        color: c.text,
        background: c.bg,
        padding: "2px 8px",
        borderRadius: 4,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>{type}</span>
    );
  };

  const [activeIndex, setActiveIndex] = useState(-1);
  const [phase, setPhase] = useState("idle"); // idle | scanning | result
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({ blocked: 0, allowed: 0 });
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  const processNext = useCallback(() => {
    const idx = indexRef.current % COMMANDS.length;
    const q = COMMANDS[idx];
    indexRef.current += 1;

    setActiveIndex(idx);
    setPhase("scanning");

    timerRef.current = setTimeout(() => {
      setPhase("result");
      setResults(prev => {
        const next = [{ ...q, ts: Date.now() }, ...prev];
        return next.slice(0, 6);
      });
      setStats(prev => ({
        blocked: prev.blocked + (q.blocked ? 1 : 0),
        allowed: prev.allowed + (q.blocked ? 0 : 1),
      }));

      timerRef.current = setTimeout(() => {
        setPhase("idle");
        timerRef.current = setTimeout(() => {
          processNext();
        }, 600);
      }, 1400);
    }, 900);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => processNext(), 800);
    return () => clearTimeout(timerRef.current);
  }, []);

  const currentCommand = activeIndex >= 0 ? COMMANDS[activeIndex] : null;
  const shieldState = phase === "result" && currentCommand
    ? (currentCommand.blocked ? "block" : "pass")
    : phase === "scanning" ? "idle" : "idle";

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      borderRadius: 12,
      padding: "20px 24px 16px",
      position: "relative",
      overflow: "hidden",
      width: "100%",
      color: "var(--sand-100)",
    }}>
      <style>{animationStyles}</style>

      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "160%",
        background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Main animation area */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: 24,
        alignItems: "start",
        position: "relative",
        height: 320,
      }}>
        {/* Left: incoming command */}
        <div style={{
          background: "rgba(var(--sand-100-rgb),0.04)",
          border: "1px solid rgba(var(--sand-100-rgb),0.08)",
          borderRadius: 10,
          padding: 20,
          height: 300,
          overflow: "hidden",
        }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: "rgba(var(--sand-100-rgb),0.25)",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14,
          }}>Incoming Command</div>

          {currentCommand && phase !== "idle" ? (
            <div key={indexRef.current} style={{ animation: "slideIn 0.35s ease-out" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <CommandTag type={currentCommand.type} />
                <span style={{ fontSize: 11, color: "rgba(var(--sand-100-rgb),0.3)" }}>
                  via CLI
                </span>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13, lineHeight: 1.7,
                color: "var(--sand-300)",
                background: "rgba(var(--sand-100-rgb),0.03)",
                padding: "14px 16px",
                borderRadius: 8,
                border: "1px solid rgba(var(--sand-100-rgb),0.06)",
                wordBreak: "break-all",
                position: "relative",
                overflow: "hidden",
              }}>
                {currentCommand.cmd}
                {phase === "scanning" && (
                  <div style={{
                    position: "absolute",
                    left: 0, width: "100%", height: 2,
                    background: "linear-gradient(90deg, transparent, var(--warm-gold), transparent)",
                    animation: "scanLine 0.8s ease-in-out",
                  }} />
                )}
              </div>

              {phase === "scanning" && (
                <div style={{
                  marginTop: 14, fontSize: 12, color: "var(--warm-gold)",
                  display: "flex", alignItems: "center", gap: 6,
                  animation: "fadeInUp 0.3s ease-out",
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--warm-gold)",
                    display: "inline-block",
                    animation: "pulseShield 1s ease-in-out infinite",
                  }} />
                  Evaluating rules...
                </div>
              )}

              {phase === "result" && (
                <div style={{
                  marginTop: 14,
                  animation: "fadeInUp 0.3s ease-out",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: currentCommand.blocked ? "#B43C3C" : "#4A7C59",
                    display: "inline-block",
                  }} />
                  <span style={{
                    fontSize: 12, fontWeight: 500,
                    color: currentCommand.blocked ? "#D4726A" : "#7CB88A",
                  }}>
                    {currentCommand.blocked ? "Blocked" : "Allowed"}
                  </span>
                  {currentCommand.rule && (
                    <span style={{ fontSize: 11, color: "rgba(var(--sand-100-rgb),0.3)" }}>
                      {currentCommand.rule}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              color: "rgba(var(--sand-100-rgb),0.15)",
              fontSize: 13, fontStyle: "italic",
              paddingTop: 20,
            }}>Waiting for next command...</div>
          )}
        </div>

        {/* Center: shield */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          paddingTop: 40, gap: 12, minWidth: 72,
        }}>
          <ShieldIcon state={shieldState} size={56} />
          <div style={{
            fontSize: 10, fontWeight: 600, color: "rgba(var(--sand-100-rgb),0.2)",
            textTransform: "uppercase", letterSpacing: "0.08em",
            textAlign: "center",
          }}>
            {phase === "scanning" ? "Checking..." :
             phase === "result" ? (currentCommand?.blocked ? "Denied" : "Clear") :
             "Ready"}
          </div>
        </div>

        {/* Right: decision log */}
        <div style={{
          background: "rgba(var(--sand-100-rgb),0.04)",
          border: "1px solid rgba(var(--sand-100-rgb),0.08)",
          borderRadius: 10,
          padding: 20,
          height: 300,
          overflow: "hidden",
        }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: "rgba(var(--sand-100-rgb),0.25)",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14,
          }}>Decision Log</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {results.length === 0 && (
              <div style={{ color: "rgba(var(--sand-100-rgb),0.15)", fontSize: 12, fontStyle: "italic" }}>
                No decisions yet
              </div>
            )}
            {results.map((r, i) => (
              <div key={r.ts} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 10px",
                background: i === 0 ? "rgba(var(--sand-100-rgb),0.03)" : "transparent",
                borderRadius: 6,
                border: i === 0 ? "1px solid rgba(var(--sand-100-rgb),0.06)" : "1px solid transparent",
                animation: i === 0 ? "resultSlide 0.3s ease-out" : "none",
                opacity: 1 - (i * 0.12),
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                  background: r.blocked ? "#B43C3C" : "#4A7C59",
                }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: "rgba(var(--sand-100-rgb),0.5)",
                  overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", flex: 1,
                }}>
                  {r.cmd.length > 32 ? r.cmd.slice(0, 32) + "..." : r.cmd}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 500, flexShrink: 0,
                  color: r.blocked ? "#D4726A" : "#7CB88A",
                }}>{r.blocked ? "BLOCKED" : "OK"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20,
        marginTop: 16, paddingTop: 12,
        borderTop: "1px solid rgba(var(--sand-100-rgb),0.06)",
        position: "relative",
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(var(--sand-100-rgb),0.25)" }}>
          {stats.blocked} blocked
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(var(--sand-100-rgb),0.25)" }}>
          {stats.allowed} allowed
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--warm-gold)" }}>
          &lt;5ms latency
        </span>
      </div>
    </div>
  );
}
