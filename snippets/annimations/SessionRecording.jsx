export const SessionRecording = () => {
  const COLORS = {
    espresso: "var(--gradient-dark-mid)",
    bronzeDark: "var(--bronze-dark)",
    bronze: "var(--bronze)",
    warmGold: "var(--warm-gold)",
    sand100: "var(--sand-100)",
    sand200: "var(--sand-200)",
    sand300: "var(--sand-300)",
    sand400: "var(--sand-400)",
    sand500: "var(--sand-500)",
    nearBlack: "#111111",
    strong: "#333333",
    body: "#555555",
    secondary: "#777777",
    muted: "#999999",
  };

  const SESSION_LINES = [
    { type: "prompt", text: "maria@prod-db-01:~$", cmd: " SELECT * FROM users WHERE role = 'admin';" },
    { type: "output", lines: [
      "  id  | name            | role   | last_login",
      " -----+-----------------+--------+---------------------",
      "  142 | sarah.chen       | admin  | 2026-03-21 09:14:22",
      "  287 | james.walker     | admin  | 2026-03-20 18:47:01",
      "  391 | alex.kumar       | admin  | 2026-03-21 11:02:55",
      " (3 rows)",
    ]},
    { type: "prompt", text: "maria@prod-db-01:~$", cmd: " UPDATE users SET mfa_enabled = true WHERE role = 'admin';" },
    { type: "output", lines: ["UPDATE 3"] },
    { type: "prompt", text: "maria@prod-db-01:~$", cmd: " \\q" },
    { type: "output", lines: ["Connection closed."] },
  ];

  const SESSION_META = {
    user: "Maria Oliveira",
    email: "maria@acme.com",
    connection: "prod-db-01 (PostgreSQL)",
    started: "Mar 21, 2026 · 11:02 UTC",
    duration: "2m 34s",
    status: "Completed",
  };

  /* ── Typewriter ── */
  const useTypewriter = (text, speed = 32, startDelay = 0, active = false) => {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    const timerRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
      if (!active) {
        if (!done) { setDisplayed(""); setDone(false); }
        return;
      }
      setDisplayed(""); setDone(false);
      let i = 0;
      timerRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          i++;
          setDisplayed(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(intervalRef.current);
            setDone(true);
          }
        }, speed);
      }, startDelay);
      return () => {
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
      };
    }, [text, speed, startDelay, active]);

    return { displayed, done };
  };

  /* ── Playback bar ── */
  const PlaybackBar = ({ progress, elapsed, total }) => {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 18px",
        background: "rgba(0,0,0,0.25)",
        borderTop: "1px solid rgba(var(--sand-100-rgb),0.06)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      }}>
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <path d="M1.5 1v12l9.5-6L1.5 1z" fill={COLORS.warmGold} opacity={0.6} />
        </svg>
        <span style={{ color: "rgba(var(--sand-100-rgb),0.35)", minWidth: 38 }}>{elapsed}</span>
        <div style={{
          flex: 1, height: 3, borderRadius: 2,
          background: "rgba(var(--sand-100-rgb),0.08)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: `linear-gradient(90deg, ${COLORS.warmGold}, ${COLORS.bronze})`,
            borderRadius: 2, transition: "width 0.4s linear",
          }} />
        </div>
        <span style={{ color: "rgba(var(--sand-100-rgb),0.2)", minWidth: 38, textAlign: "right" }}>{total}</span>
      </div>
    );
  };

  /* ── Meta sidebar ── */
  const MetaPanel = ({ visible }) => {
    const rows = [
      { label: "USER", value: SESSION_META.user, sub: SESSION_META.email },
      { label: "CONNECTION", value: SESSION_META.connection },
      { label: "STARTED", value: SESSION_META.started },
      { label: "DURATION", value: SESSION_META.duration },
      { label: "STATUS", value: SESSION_META.status, badge: true },
    ];
    return (
      <div style={{
        width: 210, flexShrink: 0,
        background: "rgba(0,0,0,0.18)",
        borderLeft: "1px solid rgba(var(--sand-100-rgb),0.06)",
        padding: "18px 16px",
        display: "flex", flexDirection: "column", gap: 14,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(16px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
          color: COLORS.warmGold, textTransform: "uppercase",
          paddingBottom: 6,
          borderBottom: "1px solid rgba(var(--sand-100-rgb),0.06)",
        }}>Session Details</div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
              color: "rgba(var(--sand-100-rgb),0.25)", textTransform: "uppercase",
            }}>{r.label}</span>
            {r.badge ? (
              <span style={{
                display: "inline-block", width: "fit-content",
                fontSize: 10, fontWeight: 600,
                padding: "2px 8px", borderRadius: 99,
                background: "rgba(var(--warm-gold-rgb),0.15)",
                color: COLORS.warmGold,
              }}>{r.value}</span>
            ) : (
              <span style={{ fontSize: 12, color: "rgba(var(--sand-100-rgb),0.6)", lineHeight: 1.4 }}>
                {r.value}
              </span>
            )}
            {r.sub && (
              <span style={{ fontSize: 11, color: "rgba(var(--sand-100-rgb),0.3)" }}>{r.sub}</span>
            )}
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 2 }}>
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
            color: "rgba(var(--sand-100-rgb),0.25)", textTransform: "uppercase",
          }}>TAGS</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {["production", "database", "mfa-update"].map(tag => (
              <span key={tag} style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 4,
                background: "rgba(var(--sand-100-rgb),0.06)",
                color: "rgba(var(--sand-100-rgb),0.3)",
                border: "1px solid rgba(var(--sand-100-rgb),0.08)",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ── Recording dot ── */
  const RecordingDot = ({ active }) => {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        opacity: active ? 1 : 0.3, transition: "opacity 0.4s ease",
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: active ? "#E05A47" : "rgba(var(--sand-100-rgb),0.2)",
          boxShadow: active ? "0 0 8px rgba(224,90,71,0.4)" : "none",
          animation: active ? "recPulse 1.4s ease-in-out infinite" : "none",
        }} />
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
          color: active ? "rgba(var(--sand-100-rgb),0.45)" : "rgba(var(--sand-100-rgb),0.15)",
          textTransform: "uppercase", fontFamily: "'Inter', sans-serif",
        }}>REC</span>
      </div>
    );
  };

  /* ── Terminal line ── */
  const TermLine = ({ item, animate, onDone, delay = 0 }) => {
    const [showOutput, setShowOutput] = useState(false);
    const [outputCount, setOutputCount] = useState(0);

    const { displayed: cmdText, done: cmdDone } = useTypewriter(
      item.type === "prompt" ? item.cmd : "", 32, delay,
      animate && item.type === "prompt"
    );

    useEffect(() => {
      if (item.type === "prompt" && cmdDone) {
        const t = setTimeout(() => onDone?.(), 250);
        return () => clearTimeout(t);
      }
    }, [cmdDone]);

    useEffect(() => {
      if (item.type === "output" && animate) {
        const t = setTimeout(() => {
          setShowOutput(true);
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setOutputCount(i);
            if (i >= item.lines.length) {
              clearInterval(interval);
              setTimeout(() => onDone?.(), 350);
            }
          }, 100);
        }, delay);
        return () => clearTimeout(t);
      }
    }, [animate]);

    if (item.type === "prompt") {
      return (
        <div style={{ display: "flex", lineHeight: 2.0, whiteSpace: "pre" }}>
          <span style={{ color: COLORS.warmGold, opacity: 0.7 }}>{item.text}</span>
          <span style={{ color: COLORS.sand100, opacity: 0.85 }}>{cmdText}</span>
          {animate && !cmdDone && (
            <span style={{
              display: "inline-block", width: 7, height: 15,
              background: COLORS.warmGold, marginLeft: 1,
              animation: "blink 0.7s step-end infinite",
              verticalAlign: "middle", marginTop: 5,
              borderRadius: 1,
            }} />
          )}
        </div>
      );
    }

    if (!showOutput) return null;
    return (
      <div style={{ marginBottom: 4 }}>
        {item.lines.slice(0, outputCount).map((line, i) => (
          <div key={i} style={{
            color: "rgba(var(--sand-100-rgb),0.45)", lineHeight: 1.8,
            whiteSpace: "pre", opacity: 0,
            animation: "fadeInLine 0.25s ease forwards",
            animationDelay: `${i * 50}ms`,
          }}>{line}</div>
        ))}
      </div>
    );
  };

  /* ── Main state ── */
  const [phase, setPhase] = useState(0);
  const [metaVisible, setMetaVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(0);
  const termRef = useRef(null);
  const totalSteps = SESSION_LINES.length;

  const handleLineDone = useCallback(() => {
    setPhase(p => {
      const next = p + 1;
      setProgress((next / totalSteps) * 100);
      return next;
    });
  }, [totalSteps]);

  useEffect(() => {
    const t = setTimeout(() => setMetaVisible(true), 900);
    return () => clearTimeout(t);
  }, [cycle]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [phase]);

  useEffect(() => {
    if (phase >= totalSteps) {
      const t = setTimeout(() => {
        setPhase(0);
        setProgress(0);
        setMetaVisible(false);
        setCycle(c => c + 1);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [phase, totalSteps]);

  const fmtTime = (pct) => {
    const s = Math.round((pct / 100) * 154);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div style={{ width: "100%", maxWidth: 860, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes recPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.85)} }
        @keyframes fadeInLine { from{opacity:0;transform:translateY(2px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Outer frame: self-contained dark gradient */}
      <div style={{
        background: "linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)",
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
      }}>
        {/* Radial glow overlay */}
        <div style={{
          position: "absolute", top: "-30%", right: "-10%",
          width: "60%", height: "160%",
          background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
        }}>
          {/* Toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "11px 18px",
            background: "rgba(0,0,0,0.2)",
            borderBottom: "1px solid rgba(var(--sand-100-rgb),0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.12)" }} />
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "4px 14px", borderRadius: 5,
              background: "rgba(0,0,0,0.15)",
              border: "1px solid rgba(var(--sand-100-rgb),0.04)",
              fontSize: 11, color: "rgba(var(--sand-100-rgb),0.25)",
              fontFamily: "'Inter', sans-serif",
            }}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="7" width="12" height="2" rx="1" fill="rgba(var(--sand-100-rgb),0.15)" />
                <rect x="7" y="2" width="2" height="12" rx="1" fill="rgba(var(--sand-100-rgb),0.15)" />
              </svg>
              app.hoop.dev/sessions/rec-3f8a2e
            </div>
            <RecordingDot active={phase < totalSteps} />
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", gap: 0,
            background: "rgba(0,0,0,0.12)",
            borderBottom: "1px solid rgba(var(--sand-100-rgb),0.06)",
            fontFamily: "'Inter', sans-serif", fontSize: 12,
          }}>
            {["Terminal", "Logs", "Video"].map((tab, i) => (
              <div key={tab} style={{
                padding: "9px 20px",
                color: i === 0 ? "rgba(var(--sand-100-rgb),0.75)" : "rgba(var(--sand-100-rgb),0.2)",
                borderBottom: i === 0 ? `2px solid ${COLORS.warmGold}` : "2px solid transparent",
                background: i === 0 ? "rgba(var(--sand-100-rgb),0.02)" : "transparent",
                cursor: "default",
              }}>{tab}</div>
            ))}
          </div>

          {/* Main content */}
          <div style={{
            display: "flex",
            background: "rgba(0,0,0,0.10)",
            minHeight: 340,
          }}>
            {/* Terminal */}
            <div
              ref={termRef}
              style={{
                flex: 1, padding: "20px 22px",
                overflowY: "auto", overflowX: "hidden",
                maxHeight: 340, scrollbarWidth: "none",
              }}
            >
              {SESSION_LINES.filter((_, i) => i <= phase).map((item, i) => (
                <TermLine
                  key={`${cycle}-${i}`}
                  item={item}
                  animate={phase === i}
                  onDone={handleLineDone}
                  delay={i === 0 ? 700 : 200}
                />
              ))}

              {phase >= totalSteps && (
                <div style={{
                  marginTop: 18, padding: "10px 14px",
                  borderRadius: 6,
                  background: "rgba(var(--warm-gold-rgb),0.08)",
                  border: "1px solid rgba(var(--warm-gold-rgb),0.15)",
                  display: "flex", alignItems: "center", gap: 8,
                  animation: "slideUp 0.5s ease forwards",
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke={COLORS.warmGold} strokeWidth="1" opacity={0.5} />
                    <path d="M4.5 7l1.8 1.8L9.5 5.5" stroke={COLORS.warmGold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  <span style={{
                    fontSize: 12, color: COLORS.warmGold, opacity: 0.8,
                    fontFamily: "'Inter', sans-serif",
                  }}>Session recorded. 6 events captured.</span>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <MetaPanel visible={metaVisible} />
          </div>

          {/* Playback */}
          <PlaybackBar progress={progress} elapsed={fmtTime(progress)} total="2:34" />
        </div>
      </div>
    </div>
  );
}
