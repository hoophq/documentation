export const RunbooksAnimation = () => {
  const COLORS = {
    nearBlack: "#111111",
    strong: "#333333",
    body: "#555555",
    secondary: "#777777",
    muted: "#999999",
    bronze: "var(--bronze)",
    bronzeDark: "var(--bronze-dark)",
    espresso: "var(--gradient-dark-mid)",
    warmGold: "var(--warm-gold)",
    sand100: "var(--sand-100)",
    sand200: "var(--sand-200)",
    sand300: "var(--sand-300)",
    sand400: "var(--sand-400)",
    sand500: "var(--sand-500)",
  };

  const icons = {
    key: (color) => (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="5.5" r="3" />
        <path d="M8.2 7.8L3 13l0-2.5L5.5 13" />
        <path d="M5.5 10.5l2-2" />
      </svg>
    ),
    scale: (color) => (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8h12M8 2v12M4 4l8 8M12 4l-8 8" />
      </svg>
    ),
    restart: (color) => (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8a5 5 0 0 1 9-3" />
        <path d="M13 8a5 5 0 0 1-9 3" />
        <polyline points="12 2 12 5 9 5" />
        <polyline points="4 14 4 11 7 11" />
      </svg>
    ),
    cache: (color) => (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="8" cy="4" rx="5.5" ry="2" />
        <path d="M2.5 4v4c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2V4" />
        <path d="M2.5 8v4c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2V8" />
      </svg>
    ),
    spinner: (color) => (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
        <path d="M8 2a6 6 0 0 1 6 6" />
      </svg>
    ),
  };

  const RUNBOOKS = [
    { name: "Rotate DB Credentials", icon: "key", tag: "security" },
    { name: "Scale Production Pods", icon: "scale", tag: "kubernetes" },
    { name: "Restart Service Fleet", icon: "restart", tag: "operations" },
    { name: "Flush Redis Cache", icon: "cache", tag: "database" },
  ];

  const RESOURCES = [
    { name: "prod-api-east-1", type: "server" },
    { name: "prod-api-east-2", type: "server" },
    { name: "prod-api-west-1", type: "server" },
    { name: "prod-db-primary", type: "database" },
    { name: "prod-db-replica-1", type: "database" },
    { name: "k8s-cluster-east", type: "kubernetes" },
  ];

  const PARAMS = [
    { label: "Replicas", value: "5" },
    { label: "Namespace", value: "production" },
    { label: "Timeout", value: "120s" },
  ];

  const PHASES = {
    IDLE: 0,
    SELECT_RUNBOOK: 1,
    FILL_PARAMS: 2,
    SELECT_RESOURCES: 3,
    EXECUTING: 4,
    RESULTS: 5,
    PAUSE: 6,
  };

  const PHASE_DURATION = {
    [PHASES.IDLE]: 1200,
    [PHASES.SELECT_RUNBOOK]: 2200,
    [PHASES.FILL_PARAMS]: 2400,
    [PHASES.SELECT_RESOURCES]: 2800,
    [PHASES.EXECUTING]: 3200,
    [PHASES.RESULTS]: 3000,
    [PHASES.PAUSE]: 1500,
  };

  const frosted = (opacity = 0.04, borderOpacity = 0.08) => ({
    background: `rgba(var(--sand-100-rgb),${opacity})`,
    border: `1px solid rgba(var(--sand-100-rgb),${borderOpacity})`,
  });

  function PhaseIndicator({ phase }) {
    const labels = ["", "Selecting runbook", "Configuring parameters", "Choosing targets", "Running commands", "Complete", ""];
    const label = labels[phase] || "";

    return (
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 20,
          fontSize: 9,
          fontWeight: 500,
          color: phase === PHASES.RESULTS ? COLORS.warmGold : "rgba(var(--sand-100-rgb),0.25)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          transition: "all 0.3s ease",
          opacity: label ? 1 : 0,
          height: 14,
        }}
      >
        {label}
      </div>
    );
  }

  const [phase, setPhase] = useState(PHASES.IDLE);
  const [selectedRunbook, setSelectedRunbook] = useState(-1);
  const [filledParams, setFilledParams] = useState(0);
  const [selectedResources, setSelectedResources] = useState([]);
  const [executingIdx, setExecutingIdx] = useState(-1);
  const [completedResources, setCompletedResources] = useState([]);
  const timersRef = useRef([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const resetState = useCallback(() => {
    setSelectedRunbook(-1);
    setFilledParams(0);
    setSelectedResources([]);
    setExecutingIdx(-1);
    setCompletedResources([]);
  }, []);

  useEffect(() => {
    clearAllTimers();

    if (phase === PHASES.IDLE) {
      resetState();
      addTimer(() => setPhase(PHASES.SELECT_RUNBOOK), PHASE_DURATION[PHASES.IDLE]);
    }

    if (phase === PHASES.SELECT_RUNBOOK) {
      addTimer(() => setSelectedRunbook(1), 800);
      addTimer(() => setPhase(PHASES.FILL_PARAMS), PHASE_DURATION[PHASES.SELECT_RUNBOOK]);
    }

    if (phase === PHASES.FILL_PARAMS) {
      PARAMS.forEach((_, i) => addTimer(() => setFilledParams(i + 1), 500 + i * 600));
      addTimer(() => setPhase(PHASES.SELECT_RESOURCES), PHASE_DURATION[PHASES.FILL_PARAMS]);
    }

    if (phase === PHASES.SELECT_RESOURCES) {
      const targets = [0, 1, 2, 5];
      targets.forEach((idx, i) => addTimer(() => setSelectedResources((prev) => [...prev, idx]), 400 + i * 500));
      addTimer(() => setPhase(PHASES.EXECUTING), PHASE_DURATION[PHASES.SELECT_RESOURCES]);
    }

    if (phase === PHASES.EXECUTING) {
      const targets = [0, 1, 2, 5];
      targets.forEach((idx, i) => {
        addTimer(() => setExecutingIdx(idx), 200 + i * 400);
        addTimer(() => setCompletedResources((prev) => [...prev, idx]), 800 + i * 500);
      });
      addTimer(() => setPhase(PHASES.RESULTS), PHASE_DURATION[PHASES.EXECUTING]);
    }

    if (phase === PHASES.RESULTS) {
      addTimer(() => setPhase(PHASES.PAUSE), PHASE_DURATION[PHASES.RESULTS]);
    }

    if (phase === PHASES.PAUSE) {
      addTimer(() => setPhase(PHASES.IDLE), PHASE_DURATION[PHASES.PAUSE]);
    }

    return clearAllTimers;
  }, [phase, resetState, clearAllTimers, addTimer]);

  const isResourceSelected = (i) => selectedResources.includes(i);
  const isResourceComplete = (i) => completedResources.includes(i);
  const isResourceExecuting = (i) => executingIdx === i && !isResourceComplete(i);

  const show = (fromPhase) => ({
    opacity: phase >= fromPhase ? 1 : 0,
    transform: phase >= fromPhase ? "translateY(0)" : "translateY(6px)",
    transition: "opacity 0.5s ease, transform 0.5s ease",
    pointerEvents: phase >= fromPhase ? "auto" : "none",
  });

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          background: "linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)",
          borderRadius: 14,
          padding: "28px 32px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-10%",
            width: "60%",
            height: "160%",
            background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Toolbar */}
        <div
          style={{
            ...frosted(0.03, 0.06),
            borderRadius: "10px 10px 0 0",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {[0.12, 0.10, 0.10].map((op, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: `rgba(var(--sand-100-rgb),${op})` }} />
            ))}
          </div>
          <div
            style={{
              ...frosted(0.04, 0.06),
              borderRadius: 5,
              padding: "4px 12px",
              marginLeft: 12,
              flex: 1,
            }}
          >
            <span style={{ color: "rgba(var(--sand-100-rgb),0.2)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
              app.hoop.dev/runbooks
            </span>
          </div>
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 4,
              background: "rgba(var(--sand-100-rgb),0.04)",
              border: "1px solid rgba(var(--sand-100-rgb),0.08)",
              fontSize: 10,
              fontWeight: 600,
              color: COLORS.warmGold,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Parallel
          </div>
        </div>

        {/* Main content, fixed height */}
        <div
          style={{
            ...frosted(0.04, 0.08),
            borderRadius: "0 0 10px 10px",
            borderTop: "none",
            display: "flex",
            position: "relative",
            zIndex: 2,
            height: 460,
            overflow: "hidden",
          }}
        >
          {/* Sidebar */}
          <div
            style={{
              width: 200,
              flexShrink: 0,
              borderRight: "1px solid rgba(var(--sand-100-rgb),0.06)",
              padding: "16px 0",
            }}
          >
            <div
              style={{
                padding: "0 16px 12px",
                fontSize: 10,
                fontWeight: 600,
                color: COLORS.warmGold,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Runbooks
            </div>

            {RUNBOOKS.map((rb, i) => {
              const isSelected = selectedRunbook === i;
              const iconColor = isSelected ? COLORS.warmGold : "rgba(var(--sand-100-rgb),0.25)";
              return (
                <div
                  key={i}
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: isSelected ? "rgba(var(--sand-100-rgb),0.06)" : "transparent",
                    borderLeft: isSelected ? `2px solid ${COLORS.warmGold}` : "2px solid transparent",
                    transition: "all 0.4s ease",
                    cursor: "default",
                  }}
                >
                  <div style={{ width: 14, height: 14, flexShrink: 0, transition: "all 0.3s ease" }}>
                    {icons[rb.icon](iconColor)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? COLORS.sand100 : "rgba(var(--sand-100-rgb),0.5)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {rb.name}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(var(--sand-100-rgb),0.2)", marginTop: 2 }}>
                      {rb.tag}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right panel */}
          <div style={{ flex: 1, padding: 20, position: "relative", overflow: "hidden" }}>
            <PhaseIndicator phase={phase} />

            {/* Runbook header */}
            <div style={{ ...show(PHASES.SELECT_RUNBOOK), marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, flexShrink: 0 }}>
                  {selectedRunbook >= 0
                    ? icons[RUNBOOKS[selectedRunbook].icon](COLORS.warmGold)
                    : icons.scale("rgba(var(--sand-100-rgb),0.15)")}
                </div>
                <span
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: COLORS.sand100,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selectedRunbook >= 0 ? RUNBOOKS[selectedRunbook].name : "Select a runbook"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(var(--sand-100-rgb),0.4)", marginLeft: 24 }}>
                Scales deployment replicas across selected resource roles
              </div>
            </div>

            {/* Parameters */}
            <div style={{ ...show(PHASES.FILL_PARAMS), marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: COLORS.warmGold,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Parameters
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {PARAMS.map((p, i) => {
                  const filled = i < filledParams;
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        ...frosted(0.03, 0.06),
                        borderRadius: 6,
                        padding: "8px 12px",
                        opacity: filled ? 1 : 0.4,
                        transition: "all 0.4s ease",
                        borderColor: filled ? "rgba(var(--warm-gold-rgb),0.25)" : "rgba(var(--sand-100-rgb),0.06)",
                      }}
                    >
                      <div style={{ fontSize: 9, color: "rgba(var(--sand-100-rgb),0.3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {p.label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 500,
                          color: filled ? COLORS.sand100 : "transparent",
                          transition: "color 0.3s ease",
                          minHeight: 18,
                        }}
                      >
                        {p.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resources + execution */}
            <div style={{ ...show(PHASES.SELECT_RESOURCES) }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: COLORS.warmGold,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  transition: "all 0.3s ease",
                }}
              >
                {phase >= PHASES.EXECUTING ? "Execution" : "Select Resources"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {RESOURCES.map((r, i) => {
                  const selected = isResourceSelected(i);
                  const executing = isResourceExecuting(i);
                  const complete = isResourceComplete(i);
                  return (
                    <div
                      key={i}
                      style={{
                        ...frosted(selected ? 0.05 : 0.02, selected ? 0.1 : 0.04),
                        borderRadius: 6,
                        padding: "8px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.35s ease",
                        borderColor: complete
                          ? "rgba(var(--warm-gold-rgb),0.3)"
                          : executing
                          ? "rgba(var(--warm-gold-rgb),0.15)"
                          : selected
                          ? "rgba(var(--sand-100-rgb),0.1)"
                          : "rgba(var(--sand-100-rgb),0.04)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 3,
                            border: `1.5px solid ${selected ? COLORS.warmGold : "rgba(var(--sand-100-rgb),0.15)"}`,
                            background: selected ? "rgba(var(--warm-gold-rgb),0.15)" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                            flexShrink: 0,
                          }}
                        >
                          {selected && (
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke={COLORS.warmGold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="2 5.5 4 7.5 8 3" />
                            </svg>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 400,
                            color: selected ? "rgba(var(--sand-100-rgb),0.7)" : "rgba(var(--sand-100-rgb),0.35)",
                            transition: "color 0.3s ease",
                          }}
                        >
                          {r.name}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            padding: "1px 6px",
                            borderRadius: 3,
                            background: "rgba(var(--sand-100-rgb),0.04)",
                            color: "rgba(var(--sand-100-rgb),0.25)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {r.type}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 70, justifyContent: "flex-end" }}>
                        {phase >= PHASES.EXECUTING && selected && (
                          complete ? (
                            <>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.warmGold }} />
                              <span style={{ fontSize: 10, color: COLORS.warmGold, fontWeight: 500 }}>Success</span>
                            </>
                          ) : executing ? (
                            <>
                              {icons.spinner("rgba(var(--sand-100-rgb),0.4)")}
                              <span style={{ fontSize: 10, color: "rgba(var(--sand-100-rgb),0.4)" }}>Running</span>
                            </>
                          ) : (
                            <span style={{ fontSize: 10, color: "rgba(var(--sand-100-rgb),0.2)" }}>Queued</span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Button/results area, fixed height */}
              <div style={{ marginTop: 16, height: 54, position: "relative" }}>
                <div
                  style={{
                    opacity: phase >= PHASES.SELECT_RESOURCES && phase < PHASES.RESULTS ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <div
                    style={{
                      background: phase === PHASES.EXECUTING ? "rgba(var(--warm-gold-rgb),0.15)" : COLORS.sand100,
                      color: phase === PHASES.EXECUTING ? COLORS.warmGold : COLORS.espresso,
                      padding: "9px 24px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      transition: "all 0.4s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      border: phase === PHASES.EXECUTING ? "1px solid rgba(var(--warm-gold-rgb),0.2)" : "1px solid transparent",
                    }}
                  >
                    {phase === PHASES.EXECUTING ? (
                      <>
                        {icons.spinner(COLORS.warmGold)}
                        Executing on {selectedResources.length} resources...
                      </>
                    ) : (
                      "Execute Runbook"
                    )}
                  </div>
                </div>

                <div
                  style={{
                    opacity: phase >= PHASES.RESULTS ? 1 : 0,
                    transform: phase >= PHASES.RESULTS ? "translateY(0)" : "translateY(6px)",
                    transition: "all 0.4s ease",
                    ...frosted(0.04, 0.08),
                    borderRadius: 8,
                    padding: "14px 16px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    pointerEvents: phase >= PHASES.RESULTS ? "auto" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.warmGold }} />
                      <span
                        style={{
                          fontFamily: "'Sora', sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: COLORS.sand100,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        All resources completed
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: COLORS.warmGold }}>
                      4/4
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(var(--sand-100-rgb),0.35)", marginTop: 6, marginLeft: 16 }}>
                    Scaled to 5 replicas across all selected clusters and servers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 0 0",
            marginTop: 12,
            position: "relative",
            zIndex: 2,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(var(--sand-100-rgb),0.2)">
            <circle cx="7" cy="7" r="3.5" />
            <circle cx="17" cy="7" r="3.5" />
            <circle cx="7" cy="17" r="3.5" />
            <circle cx="17" cy="17" r="3.5" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(var(--sand-100-rgb),0.2)", letterSpacing: "0.01em" }}>
            hoop.dev
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(var(--sand-100-rgb),0.06)" }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
