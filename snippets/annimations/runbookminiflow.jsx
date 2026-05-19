export const RunbooksAnimation = () => {
  const BRONZE = "var(--bronze)";
  const BRONZE_DARK = "var(--bronze-dark)";
  const ESPRESSO = "var(--gradient-dark-mid)";
  const WARM_GOLD = "var(--warm-gold)";
  const SAND_100 = "var(--sand-100)";
  const SAND_200 = "var(--sand-200)";
  const SAND_300 = "var(--sand-300)";
  const SAND_400 = "var(--sand-400)";
  const SAND_500 = "var(--sand-500)";
  const TEXT_PRIMARY = "#111111";
  const TEXT_STRONG = "#333333";
  const TEXT_BODY = "#555555";
  const TEXT_SECONDARY = "#777777";
  const TEXT_MUTED = "#999999";

  const FONTS = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');`;

  const PHASES = [
    { id: "git-sync", label: "Git Sync", duration: 5000 },
    { id: "select", label: "Select Runbook", duration: 4200 },
    { id: "fill-params", label: "Fill Parameters", duration: 5200 },
    { id: "approval", label: "Approval", duration: 4800 },
    { id: "execute", label: "Execute", duration: 6000 },
    { id: "audit", label: "Audit Trail", duration: 5000 },
  ];

  const TOTAL_DURATION = PHASES.reduce((a, p) => a + p.duration, 0);

  function easeOut(t) {
    return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  }
  function easeInOut(t) {
    t = Math.min(1, Math.max(0, t));
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function HoopDots({ size = 14, color = SAND_500 }) {
    const r = size * 0.145;
    const g = size * 0.29;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2 - g} cy={size / 2 - g} r={r} fill={color} />
        <circle cx={size / 2 + g} cy={size / 2 - g} r={r} fill={color} />
        <circle cx={size / 2 - g} cy={size / 2 + g} r={r} fill={color} />
        <circle cx={size / 2 + g} cy={size / 2 + g} r={r} fill={color} />
      </svg>
    );
  }

  function MockFrame({ children, title = "hoop.dev", phase }) {
    return (
      <div
        style={{
          background: "rgba(var(--sand-100-rgb),0.04)",
          border: "1px solid rgba(var(--sand-100-rgb),0.08)",
          borderRadius: 12,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            background: "rgba(var(--sand-100-rgb),0.03)",
            borderBottom: "1px solid rgba(var(--sand-100-rgb),0.06)",
          }}
        >
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: `rgba(var(--sand-100-rgb),0.10)`,
                }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(var(--sand-100-rgb),0.04)",
              borderRadius: 5,
              padding: "4px 12px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "rgba(var(--sand-100-rgb),0.20)",
              letterSpacing: "0.02em",
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ padding: "20px 24px", height: 300, overflow: "hidden" }}>{children}</div>
      </div>
    );
  }

  function GitSyncScene({ progress }) {
    const showBranch = progress > 0.1;
    const showFiles = progress > 0.3;
    const syncPulse = progress > 0.55;
    const synced = progress > 0.8;

    const files = [
      "team/dba/ops/restart-service.runbook.sh",
      "team/finops/sql/fetch-customer.runbook.sql",
      "team/sre/k8s/rollout-deploy.runbook.sh",
    ];

    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            opacity: easeOut(progress * 3),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="3" r="2" stroke={WARM_GOLD} strokeWidth="1.2" fill="none" />
            <circle cx="8" cy="13" r="2" stroke={WARM_GOLD} strokeWidth="1.2" fill="none" />
            <line x1="8" y1="5" x2="8" y2="11" stroke={WARM_GOLD} strokeWidth="1.2" />
            {showBranch && (
              <>
                <circle cx="13" cy="8" r="2" stroke="rgba(var(--sand-100-rgb),0.3)" strokeWidth="1.2" fill="none" />
                <path d="M8 7 Q10 7 13 6" stroke="rgba(var(--sand-100-rgb),0.3)" strokeWidth="1.2" fill="none" />
              </>
            )}
          </svg>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: "rgba(var(--sand-100-rgb),0.5)",
            }}
          >
            main
          </span>
          {syncPulse && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: synced ? WARM_GOLD : "rgba(var(--sand-100-rgb),0.25)",
                background: synced
                  ? "rgba(var(--warm-gold-rgb),0.12)"
                  : "rgba(var(--sand-100-rgb),0.04)",
                padding: "2px 8px",
                borderRadius: 20,
                transition: "all 0.5s ease",
              }}
            >
              {synced ? "synced" : "syncing..."}
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f, i) => {
            const fileProgress = Math.max(
              0,
              Math.min(1, (progress - 0.3 - i * 0.12) * 5)
            );
            return (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: easeOut(fileProgress),
                  transform: `translateX(${(1 - easeOut(fileProgress)) * 20}px)`,
                  transition: "transform 0.3s ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect
                    x="2"
                    y="1"
                    width="10"
                    height="12"
                    rx="1.5"
                    stroke="rgba(var(--sand-100-rgb),0.2)"
                    strokeWidth="1"
                    fill="none"
                  />
                  <line
                    x1="4.5"
                    y1="5"
                    x2="9.5"
                    y2="5"
                    stroke="rgba(var(--sand-100-rgb),0.12)"
                    strokeWidth="0.8"
                  />
                  <line
                    x1="4.5"
                    y1="7.5"
                    x2="8"
                    y2="7.5"
                    stroke="rgba(var(--sand-100-rgb),0.12)"
                    strokeWidth="0.8"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "rgba(var(--sand-100-rgb),0.5)",
                  }}
                >
                  {f}
                </span>
              </div>
            );
          })}
        </div>

        {synced && (
          <div
            style={{
              marginTop: 20,
              padding: "10px 14px",
              background: "rgba(var(--sand-100-rgb),0.03)",
              borderRadius: 6,
              border: "1px solid rgba(var(--sand-100-rgb),0.06)",
              opacity: easeOut((progress - 0.8) * 5),
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: WARM_GOLD,
              }}
            >
              a3f8c2e
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: "rgba(var(--sand-100-rgb),0.35)",
                marginLeft: 10,
              }}
            >
              add k8s rollout runbook
            </span>
          </div>
        )}
      </div>
    );
  }

  function SelectScene({ progress }) {
    const runbooks = [
      { name: "fetch-customer.runbook.sql", team: "finops", selected: false },
      { name: "restart-service.runbook.sh", team: "dba", selected: true },
      { name: "rollout-deploy.runbook.sh", team: "sre", selected: false },
    ];
    const selectProgress = easeInOut(Math.max(0, (progress - 0.4) * 2.5));

    return (
      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: WARM_GOLD,
            marginBottom: 14,
            opacity: easeOut(progress * 3),
          }}
        >
          Select Runbook
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {runbooks.map((rb, i) => {
            const rowOpacity = easeOut(Math.max(0, (progress - i * 0.1) * 4));
            const isHighlighted = rb.selected && selectProgress > 0;
            return (
              <div
                key={rb.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 6,
                  background: isHighlighted
                    ? `rgba(var(--warm-gold-rgb),${0.08 * selectProgress})`
                    : "rgba(var(--sand-100-rgb),0.02)",
                  border: `1px solid ${
                    isHighlighted
                      ? `rgba(var(--warm-gold-rgb),${0.2 * selectProgress})`
                      : "rgba(var(--sand-100-rgb),0.04)"
                  }`,
                  opacity: rowOpacity,
                  transform: `translateY(${(1 - rowOpacity) * 8}px)`,
                  transition: "background 0.4s, border-color 0.4s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: isHighlighted
                        ? WARM_GOLD
                        : "rgba(var(--sand-100-rgb),0.5)",
                      transition: "color 0.4s",
                    }}
                  >
                    {rb.name}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "rgba(var(--sand-100-rgb),0.2)",
                    background: "rgba(var(--sand-100-rgb),0.04)",
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  {rb.team}
                </span>
              </div>
            );
          })}
        </div>
        {selectProgress > 0.5 && (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: easeOut((selectProgress - 0.5) * 2),
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill={WARM_GOLD}>
              <polygon points="2,1 8,5 2,9" />
            </svg>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: "rgba(var(--sand-100-rgb),0.4)",
              }}
            >
              Connection: <span style={{ color: "rgba(var(--sand-100-rgb),0.6)" }}>prod-postgres</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  function FillParamsScene({ progress }) {
    const typingProgress = easeOut(Math.max(0, (progress - 0.2) * 1.8));
    const typedText = "1040".slice(0, Math.floor(typingProgress * 4));
    const cursorVisible = progress < 0.85 && Math.floor(progress * 10) % 2 === 0;
    const templateShown = progress > 0.6;

    return (
      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: WARM_GOLD,
            marginBottom: 14,
            opacity: easeOut(progress * 4),
          }}
        >
          restart-service.runbook.sh
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ opacity: easeOut(progress * 3) }}>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: "rgba(var(--sand-100-rgb),0.3)",
                marginBottom: 4,
              }}
            >
              service_name <span style={{ color: "rgba(var(--warm-gold-rgb),0.5)", fontSize: 9 }}>required</span>
            </div>
            <div
              style={{
                padding: "8px 12px",
                background: "rgba(var(--sand-100-rgb),0.04)",
                border: "1px solid rgba(var(--sand-100-rgb),0.08)",
                borderRadius: 5,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "rgba(var(--sand-100-rgb),0.6)",
              }}
            >
              payment-api
            </div>
          </div>

          <div style={{ opacity: easeOut(Math.max(0, (progress - 0.1) * 3)) }}>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: "rgba(var(--sand-100-rgb),0.3)",
                marginBottom: 4,
              }}
            >
              namespace
            </div>
            <div
              style={{
                padding: "8px 12px",
                background: "rgba(var(--sand-100-rgb),0.04)",
                border: `1px solid ${
                  typingProgress > 0 && typingProgress < 1
                    ? "rgba(var(--warm-gold-rgb),0.3)"
                    : "rgba(var(--sand-100-rgb),0.08)"
                }`,
                borderRadius: 5,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "rgba(var(--sand-100-rgb),0.6)",
                transition: "border-color 0.3s",
              }}
            >
              production
            </div>
          </div>

          <div style={{ opacity: easeOut(Math.max(0, (progress - 0.15) * 3)) }}>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: "rgba(var(--sand-100-rgb),0.3)",
                marginBottom: 4,
              }}
            >
              replicas <span style={{ color: "rgba(var(--sand-100-rgb),0.15)", fontSize: 9 }}>default: 2</span>
            </div>
            <div
              style={{
                padding: "8px 12px",
                background: "rgba(var(--sand-100-rgb),0.04)",
                border: "1px solid rgba(var(--sand-100-rgb),0.08)",
                borderRadius: 5,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "rgba(var(--sand-100-rgb),0.35)",
              }}
            >
              3{cursorVisible && typingProgress < 1 ? "" : ""}
            </div>
          </div>
        </div>

        {templateShown && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: ESPRESSO,
              borderRadius: 6,
              opacity: easeOut((progress - 0.6) * 2.5),
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                lineHeight: 2,
              }}
            >
              <span style={{ color: "var(--prompt)" }}>$</span>{" "}
              <span style={{ color: "var(--sand-300)" }}>kubectl rollout restart</span>{" "}
              <span style={{ color: WARM_GOLD }}>payment-api</span>{" "}
              <span style={{ color: "var(--sand-300)" }}>-n</span>{" "}
              <span style={{ color: WARM_GOLD }}>production</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  function ApprovalScene({ progress }) {
    const requestSent = progress > 0.15;
    const reviewerAppears = progress > 0.35;
    const approved = progress > 0.7;

    return (
      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: WARM_GOLD,
            marginBottom: 14,
            opacity: easeOut(progress * 4),
          }}
        >
          Just-in-Time Review
        </div>

        <div
          style={{
            padding: "14px 16px",
            background: "rgba(var(--sand-100-rgb),0.03)",
            border: "1px solid rgba(var(--sand-100-rgb),0.06)",
            borderRadius: 8,
            marginBottom: 12,
            opacity: easeOut(Math.max(0, (progress - 0.05) * 4)),
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: SAND_100 }}>
              restart-service.runbook.sh
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: requestSent
                  ? approved
                    ? WARM_GOLD
                    : "rgba(var(--sand-100-rgb),0.4)"
                  : "rgba(var(--sand-100-rgb),0.2)",
                background: approved
                  ? "rgba(var(--warm-gold-rgb),0.12)"
                  : "rgba(var(--sand-100-rgb),0.04)",
                padding: "2px 8px",
                borderRadius: 20,
                transition: "all 0.5s ease",
              }}
            >
              {approved ? "approved" : requestSent ? "pending" : "draft"}
            </span>
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: "rgba(var(--sand-100-rgb),0.3)",
            }}
          >
            Requested by <span style={{ color: "rgba(var(--sand-100-rgb),0.5)" }}>ana@company.com</span>
            {" · "}prod-postgres
          </div>
        </div>

        {reviewerAppears && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              opacity: easeOut((progress - 0.35) * 3),
              transform: `translateY(${(1 - easeOut((progress - 0.35) * 3)) * 10}px)`,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(var(--sand-100-rgb),0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(var(--sand-100-rgb),0.3)",
              }}
            >
              MP
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "rgba(var(--sand-100-rgb),0.5)",
                }}
              >
                marcos@company.com
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  color: approved ? WARM_GOLD : "rgba(var(--sand-100-rgb),0.2)",
                  transition: "color 0.5s",
                }}
              >
                {approved ? "Approved" : "Reviewing..."}
              </div>
            </div>
            {approved && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                style={{
                  marginLeft: "auto",
                  opacity: easeOut((progress - 0.7) * 3),
                }}
              >
                <circle cx="9" cy="9" r="8" fill="rgba(var(--warm-gold-rgb),0.15)" />
                <polyline
                  points="5.5,9.5 8,12 12.5,6.5"
                  stroke={WARM_GOLD}
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    );
  }

  function ExecuteScene({ progress }) {
    const lines = [
      { type: "prompt", text: "$ kubectl rollout restart payment-api -n production" },
      { type: "output", text: "deployment.apps/payment-api restarted" },
      { type: "output", text: "Waiting for rollout to finish: 0 of 3 updated..." },
      { type: "output", text: "Waiting for rollout to finish: 1 of 3 updated..." },
      { type: "output", text: "Waiting for rollout to finish: 2 of 3 updated..." },
      { type: "success", text: "deployment \"payment-api\" successfully rolled out" },
    ];

    const visibleLines = Math.floor(progress * (lines.length + 1));

    return (
      <div
        style={{
          background: ESPRESSO,
          borderRadius: 8,
          padding: "18px 20px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          lineHeight: 2.2,
        }}
      >
        {lines.slice(0, visibleLines).map((line, i) => {
          const lineProgress = easeOut(
            Math.max(0, (progress - (i / lines.length) * 0.85) * 4)
          );
          return (
            <div
              key={i}
              style={{
                opacity: lineProgress,
                transform: `translateY(${(1 - lineProgress) * 6}px)`,
              }}
            >
              {line.type === "prompt" && (
                <>
                  <span style={{ color: "var(--prompt)" }}>$ </span>
                  <span style={{ color: "var(--sand-300)" }}>{line.text.slice(2)}</span>
                </>
              )}
              {line.type === "output" && (
                <span style={{ color: "rgba(232,221,208,0.45)" }}>{line.text}</span>
              )}
              {line.type === "success" && (
                <span style={{ color: WARM_GOLD, fontWeight: 500 }}>
                  {line.text}
                </span>
              )}
            </div>
          );
        })}
        {visibleLines <= lines.length && (
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 14,
              background: "rgba(var(--sand-100-rgb),0.3)",
              animation: "blink 1s step-end infinite",
              verticalAlign: "middle",
              marginTop: 2,
            }}
          />
        )}
      </div>
    );
  }

  function AuditScene({ progress }) {
    const events = [
      { time: "14:32:01", action: "Runbook selected", user: "ana@company.com", icon: "file" },
      { time: "14:32:08", action: "Parameters filled", user: "ana@company.com", icon: "edit" },
      { time: "14:32:15", action: "Review requested", user: "ana@company.com", icon: "clock" },
      { time: "14:33:42", action: "Approved", user: "marcos@company.com", icon: "check" },
      { time: "14:33:44", action: "Executed", user: "system", icon: "play" },
      { time: "14:34:12", action: "Session recorded", user: "system", icon: "record" },
    ];

    return (
      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: WARM_GOLD,
            marginBottom: 14,
            opacity: easeOut(progress * 4),
          }}
        >
          Audit Trail
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {events.map((evt, i) => {
            const evtProgress = easeOut(Math.max(0, (progress - i * 0.1) * 3));
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "7px 12px",
                  opacity: evtProgress,
                  transform: `translateY(${(1 - evtProgress) * 8}px)`,
                  borderLeft: `2px solid ${
                    i === events.length - 1 && progress > 0.8
                      ? WARM_GOLD
                      : "rgba(var(--sand-100-rgb),0.06)"
                  }`,
                  transition: "border-color 0.5s",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "rgba(var(--sand-100-rgb),0.2)",
                    minWidth: 56,
                  }}
                >
                  {evt.time}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "rgba(var(--sand-100-rgb),0.55)",
                    flex: 1,
                  }}
                >
                  {evt.action}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "rgba(var(--sand-100-rgb),0.2)",
                  }}
                >
                  {evt.user}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function Timeline({ currentPhaseIndex, phaseProgress }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          width: "100%",
          padding: "0 4px",
        }}
      >
        {PHASES.map((phase, i) => {
          const isActive = i === currentPhaseIndex;
          const isPast = i < currentPhaseIndex;
          return (
            <div
              key={phase.id}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 2,
                  background: "rgba(var(--sand-100-rgb),0.06)",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${isPast ? 100 : isActive ? phaseProgress * 100 : 0}%`,
                    background: isPast || isActive ? WARM_GOLD : "transparent",
                    borderRadius: 1,
                    transition: isPast ? "none" : "width 0.1s linear",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 9,
                  fontWeight: isActive ? 600 : 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: isActive
                    ? WARM_GOLD
                    : isPast
                    ? "rgba(var(--sand-100-rgb),0.3)"
                    : "rgba(var(--sand-100-rgb),0.12)",
                  transition: "color 0.3s",
                  whiteSpace: "nowrap",
                }}
              >
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  function useAnimationClock() {
    const [elapsed, setElapsed] = useState(0);
    const rafRef = useRef();
    const startRef = useRef();

    useEffect(() => {
      startRef.current = performance.now();
      const tick = (now) => {
        const e = now - startRef.current;
        setElapsed(e % TOTAL_DURATION);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }, []);

    let cumulative = 0;
    let currentPhaseIndex = 0;
    let phaseProgress = 0;
    for (let i = 0; i < PHASES.length; i++) {
      if (elapsed < cumulative + PHASES[i].duration) {
        currentPhaseIndex = i;
        phaseProgress = (elapsed - cumulative) / PHASES[i].duration;
        break;
      }
      cumulative += PHASES[i].duration;
    }

    return { elapsed, currentPhaseIndex, phaseProgress };
  }

  const { currentPhaseIndex, phaseProgress } = useAnimationClock();

  const scenes = [
    GitSyncScene,
    SelectScene,
    FillParamsScene,
    ApprovalScene,
    ExecuteScene,
    AuditScene,
  ];
  const CurrentScene = scenes[currentPhaseIndex];

  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          margin: "0 auto",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)",
            borderRadius: 14,
            padding: "28px 28px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-30%",
              right: "-10%",
              width: "60%",
              height: "160%",
              background:
                "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <HoopDots size={14} color={SAND_100} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: SAND_100,
                  letterSpacing: "0.01em",
                }}
              >
                hoop.dev
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: WARM_GOLD,
                letterSpacing: "-0.01em",
              }}
            >
              Runbooks
            </span>
          </div>

          <div style={{ position: "relative", zIndex: 1, marginBottom: 20 }}>
            <MockFrame title="app.hoop.dev/runbooks" phase={currentPhaseIndex}>
              <CurrentScene progress={phaseProgress} />
            </MockFrame>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Timeline
              currentPhaseIndex={currentPhaseIndex}
              phaseProgress={phaseProgress}
            />
          </div>
        </div>
      </div>
    </>
  );
}
