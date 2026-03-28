export const ActionAccessAnimation = () => {
  const ESPRESSO = "var(--gradient-dark-mid)";
  const WARM_GOLD = "var(--warm-gold)";
  const SAND_100 = "var(--sand-100)";
  const SAND_300 = "var(--sand-300)";
  const SAND_500 = "var(--sand-500)";

  const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=JetBrains+Mono:wght@400;500&family=Sora:wght@600;700;800&display=swap');`;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function useTypingText(text, speed, trigger) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    useEffect(() => {
      if (!trigger) { setDisplayed(""); setDone(false); return; }
      setDisplayed(""); setDone(false);
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, [trigger, text, speed]);
    return { displayed, done };
  }

  const Cursor = ({ visible = true }) => (
    <span style={{
      display: "inline-block", width: 2, height: "1.1em",
      background: visible ? WARM_GOLD : "transparent",
      marginLeft: 2, verticalAlign: "text-bottom",
      animation: visible ? "hoop_blink 1s step-end infinite" : "none",
    }} />
  );

  const StepIndicator = ({ steps, activeStep }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 18, minWidth: 44 }}>
      {steps.map((s, i) => {
        const isActive = i === activeStep;
        const isPast = i < activeStep;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500,
              transition: "all 0.5s ease",
              background: isPast ? WARM_GOLD : isActive ? "rgba(var(--warm-gold-rgb),0.18)" : "rgba(var(--sand-100-rgb),0.06)",
              color: isPast ? ESPRESSO : isActive ? WARM_GOLD : "rgba(var(--sand-100-rgb),0.25)",
              border: isActive ? `1.5px solid ${WARM_GOLD}` : "1.5px solid transparent",
            }}>
              {isPast ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke={ESPRESSO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 1.5, height: 24,
                background: isPast ? WARM_GOLD : "rgba(var(--sand-100-rgb),0.08)",
                transition: "background 0.5s ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );

  const [phase, setPhase] = useState("idle");
  const [typingTrigger, setTypingTrigger] = useState(0);
  const [slackVisible, setSlackVisible] = useState(false);
  const [approveClicked, setApproveClicked] = useState(false);
  const [resultTrigger, setResultTrigger] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);
  const [pendingVisible, setPendingVisible] = useState(false);
  const [approvedLine, setApprovedLine] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [fade, setFade] = useState(true);
  const running = useRef(false);

  const COMMAND = `UPDATE users SET status = 'inactive' WHERE id = 123`;
  const RESULT_TEXT = `UPDATE 1\n\n1 row affected.`;

  const commandTyping = useTypingText(COMMAND, 38, typingTrigger);
  const resultTyping = useTypingText(RESULT_TEXT, 28, resultTrigger);

  async function runLoop() {
    if (running.current) return;
    running.current = true;

    while (running.current) {
      // Reset all state while faded out
      setPhase("idle");
      setSlackVisible(false);
      setApproveClicked(false);
      setActiveStep(-1);
      setPendingVisible(false);
      setApprovedLine(false);
      setShowResult(false);
      await sleep(400);

      // Fade in
      setFade(false);
      await sleep(500);

      // 1: Type command
      setPhase("typing");
      setActiveStep(0);
      setTypingTrigger((t) => t + 1);
      await sleep(COMMAND.length * 38 + 500);

      // 2: Pending
      setPhase("pending");
      setActiveStep(1);
      setPendingVisible(true);
      await sleep(1400);

      // 3: Slack appears, pending stays
      setPhase("slack");
      setActiveStep(2);
      setSlackVisible(true);
      await sleep(2000);

      // 4: Approve click, everything stays
      setApproveClicked(true);
      await sleep(700);

      // 5: Swap pending to approved line, slack stays with approved state
      setPhase("approved");
      setActiveStep(3);
      setPendingVisible(false);
      setApprovedLine(true);
      await sleep(800);

      // 6: Result streams in, everything still visible
      setShowResult(true);
      setResultTrigger((t) => t + 1);
      await sleep(RESULT_TEXT.length * 28 + 2800);

      // 7: Fade out whole card
      setFade(true);
      await sleep(1200);
    }
  }

  useEffect(() => {
    runLoop();
    return () => { running.current = false; };
  }, []);

  const steps = ["Execute", "Review", "Approve", "Complete"];
  const showCmdCursor = phase === "typing" && !commandTyping.done;
  const showResCursor = showResult && !resultTyping.done;

  return (
    <div style={{
      width: "100%", maxWidth: 780, margin: "0 auto",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <style>{FONTS}{`
        @keyframes hoop_blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hoop_fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hoop_fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes hoop_pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes hoop_scaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes hoop_checkPop { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* Overline */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
        color: WARM_GOLD, letterSpacing: "0.1em", textTransform: "uppercase",
        marginBottom: 12, textAlign: "center",
      }}>
        Action Access Requests
      </div>

      {/* Main card, fades as a whole */}
      <div style={{
        background: "linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)",
        borderRadius: 14, padding: "32px 28px 28px",
        position: "relative", overflow: "hidden", height: 520,
        transition: "opacity 0.9s ease",
        opacity: fade ? 0 : 1,
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "160%",
          background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", gap: 20, position: "relative", zIndex: 1 }}>
          <StepIndicator steps={steps} activeStep={activeStep} />

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* ---- TERMINAL ---- */}
            <div style={{
              background: "rgba(var(--sand-100-rgb),0.04)",
              border: "1px solid rgba(var(--sand-100-rgb),0.08)",
              borderRadius: 10, overflow: "hidden",
              minHeight: 220,
            }}>
              {/* Toolbar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 14px",
                borderBottom: "1px solid rgba(var(--sand-100-rgb),0.06)",
                background: "rgba(var(--sand-100-rgb),0.03)",
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(var(--sand-100-rgb),0.10)" }} />
                ))}
                <span style={{
                  marginLeft: 10, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: "rgba(var(--sand-100-rgb),0.25)",
                }}>Terminal</span>
              </div>

              {/* Body */}
              <div style={{ padding: "16px 18px" }}>
                {/* Command */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    color: SAND_500, marginRight: 8, lineHeight: 2.0,
                  }}>$</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    color: SAND_300, lineHeight: 2.0,
                  }}>hoop exec prod-db -i "</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    color: WARM_GOLD, fontWeight: 500, lineHeight: 2.0,
                  }}>{commandTyping.displayed}</span>
                  {showCmdCursor && <Cursor />}
                  {commandTyping.done && commandTyping.displayed && (
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                      color: SAND_300, lineHeight: 2.0,
                    }}>"</span>
                  )}
                </div>

                {/* Pending */}
                {pendingVisible && (
                  <div style={{
                    marginTop: 14, display: "flex", alignItems: "center", gap: 10,
                    animation: "hoop_fadeIn 0.4s ease",
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", background: WARM_GOLD,
                      animation: "hoop_pulse 1.5s ease infinite",
                    }} />
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                      color: "rgba(var(--sand-100-rgb),0.35)",
                    }}>Waiting for approval...</span>
                  </div>
                )}

                {/* Approved */}
                {approvedLine && (
                  <div style={{
                    marginTop: 14, display: "flex", alignItems: "center", gap: 10,
                    animation: "hoop_fadeIn 0.3s ease",
                  }}>
                    <div style={{ animation: "hoop_checkPop 0.4s ease", display: "flex" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill={WARM_GOLD} />
                        <path d="M4 7l2 2 4-4" stroke={ESPRESSO} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                      color: WARM_GOLD,
                    }}>Approved. Executing...</span>
                  </div>
                )}

                {/* Result */}
                {showResult && (
                  <div style={{ marginTop: 16, animation: "hoop_fadeInUp 0.4s ease" }}>
                    <div style={{ height: 1, background: "rgba(var(--sand-100-rgb),0.06)", marginBottom: 14 }} />
                    <pre style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                      color: WARM_GOLD, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap",
                    }}>
                      {resultTyping.displayed}{showResCursor && <Cursor />}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* ---- SLACK CARD ---- */}
            <div style={{
              overflow: "hidden",
              transition: "max-height 0.5s ease, opacity 0.5s ease",
              maxHeight: slackVisible ? 260 : 0,
              opacity: slackVisible ? 1 : 0,
            }}>
              <div style={{
                background: "rgba(var(--sand-100-rgb),0.04)",
                border: "1px solid rgba(var(--sand-100-rgb),0.08)",
                borderRadius: 10, padding: "16px 18px",
                animation: slackVisible ? "hoop_scaleIn 0.4s cubic-bezier(0.34, 1.4, 0.64, 1)" : "none",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: "rgba(var(--sand-100-rgb),0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 11, color: "rgba(var(--sand-100-rgb),0.4)" }}>#</span>
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                    color: "rgba(var(--sand-100-rgb),0.60)",
                  }}>#access-requests</span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                    color: "rgba(var(--sand-100-rgb),0.20)", marginLeft: "auto",
                  }}>just now</span>
                </div>

                {/* Body */}
                <div style={{ borderLeft: `2.5px solid ${WARM_GOLD}`, paddingLeft: 14, marginBottom: 14 }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                    color: "rgba(var(--sand-100-rgb),0.70)", marginBottom: 6,
                  }}>
                    Access Request from alice@company.com
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                        color: "rgba(var(--sand-100-rgb),0.30)", minWidth: 70,
                      }}>Connection</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                        color: "rgba(var(--sand-100-rgb),0.50)",
                      }}>prod-db</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                        color: "rgba(var(--sand-100-rgb),0.30)", minWidth: 70,
                      }}>Command</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                        color: WARM_GOLD, fontWeight: 500, wordBreak: "break-all",
                      }}>UPDATE users SET status = 'inactive' WHERE id = 123</span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                    padding: "6px 20px", borderRadius: 6, border: "none", cursor: "pointer",
                    transition: "all 0.3s ease",
                    background: approveClicked ? WARM_GOLD : SAND_100,
                    color: ESPRESSO,
                    transform: approveClicked ? "scale(0.96)" : "scale(1)",
                  }}>
                    {approveClicked ? "✓ Approved" : "Approve"}
                  </button>
                  <button style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                    padding: "6px 20px", borderRadius: 6,
                    border: "1px solid rgba(var(--sand-100-rgb),0.12)",
                    background: "transparent", color: "rgba(var(--sand-100-rgb),0.35)",
                    cursor: "pointer",
                    opacity: approveClicked ? 0.3 : 1,
                    transition: "opacity 0.3s ease",
                  }}>
                    Reject
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          marginTop: 28, paddingTop: 12,
          borderTop: "1px solid rgba(var(--sand-100-rgb),0.06)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(var(--sand-100-rgb),0.2)">
            <circle cx="7" cy="7" r="3.5"/><circle cx="17" cy="7" r="3.5"/>
            <circle cx="7" cy="17" r="3.5"/><circle cx="17" cy="17" r="3.5"/>
          </svg>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
            color: "rgba(var(--sand-100-rgb),0.2)",
          }}>hoop.dev</span>
          <div style={{ flex: 1, height: 1, background: "rgba(var(--sand-100-rgb),0.06)" }} />
        </div>
      </div>
    </div>
  );
}
