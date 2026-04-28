export const WorkflowObservabilityAnimation = () => {
  const SCENARIOS = [
    {
      caller: "deploy-pipeline",
      keyHash: "hpk_xR9a",
      icon: "ci",
      correlationId: "deploy-2026-04-24-17a",
      sessions: [
        { connection: "postgres-migrate",   command: "ALTER TABLE users ADD COLUMN locale TEXT", duration: 340 },
        { connection: "postgres-migrate",   command: "INSERT INTO schema_versions VALUES ('2026_04_24_a')", duration: 89 },
        { connection: "internal-api",       command: "POST /healthcheck", duration: 120 },
        { connection: "postgres-analytics", command: "SELECT COUNT(*) FROM active_users", duration: 74 },
      ],
    },
    {
      caller: "nightly-report",
      keyHash: "hpk_m4Tk",
      icon: "cron",
      correlationId: "cron-2026-04-24T02:00",
      sessions: [
        { connection: "warehouse-read",   command: "SELECT * FROM fact_sales WHERE ds = CURRENT_DATE - 1", duration: 612 },
        { connection: "warehouse-read",   command: "SELECT * FROM dim_customer", duration: 418 },
        { connection: "s3-exports",       command: "PUT s3://reports/2026-04-24/daily.parquet", duration: 204 },
        { connection: "slack-notify",     command: "POST /notify #data-reports", duration: 93 },
      ],
    },
    {
      caller: "ticket-agent",
      keyHash: "hpk_qB7w",
      icon: "agent",
      correlationId: "task-12345",
      sessions: [
        { connection: "tickets-db",       command: "SELECT * FROM automation_tasks WHERE id = 12345", duration: 128 },
        { connection: "docs-api",         command: "GET /documents/47219", duration: 208 },
        { connection: "third-party-api",  command: "POST /enrich", duration: 416 },
        { connection: "tickets-db",       command: "UPDATE automation_tasks SET status='done' WHERE id = 12345", duration: 94 },
      ],
    },
  ];

  const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&family=Sora:wght@600;700;800&display=swap";

  const animationStyles = `
    @keyframes workflowSlideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes workflowFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes workflowPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.25); opacity: 0.5; }
    }
    @keyframes workflowScanLine {
      0% { left: 0%; opacity: 0; }
      15% { opacity: 1; }
      85% { opacity: 1; }
      100% { left: 100%; opacity: 0; }
    }
    @keyframes workflowKeyShine {
      0%, 100% { filter: drop-shadow(0 0 0px rgba(var(--warm-gold-rgb),0)); }
      50% { filter: drop-shadow(0 0 8px rgba(var(--warm-gold-rgb),0.45)); }
    }
  `;

  const CallerIcon = ({ kind, size = 22 }) => {
    const color = "var(--warm-gold)";
    if (kind === "ci") {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
        </svg>
      );
    }
    if (kind === "cron") {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
          <path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="5" y="7" width="14" height="12" rx="2" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
        <path d="M12 7V3" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1" fill={color} />
        <circle cx="9.5" cy="13" r="1.2" fill={color} />
        <circle cx="14.5" cy="13" r="1.2" fill={color} />
      </svg>
    );
  };

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [runningIdx, setRunningIdx] = useState(-1);
  const timerRef = useRef(null);

  const scenario = SCENARIOS[scenarioIdx];

  useEffect(() => {
    setVisibleCount(0);
    setRunningIdx(-1);

    let step = 0;
    const stepThrough = () => {
      if (step < scenario.sessions.length) {
        setRunningIdx(step);
        setVisibleCount(step + 1);
        step += 1;
        timerRef.current = setTimeout(() => {
          setRunningIdx(-1);
          timerRef.current = setTimeout(stepThrough, 350);
        }, 900);
      } else {
        timerRef.current = setTimeout(() => {
          setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
        }, 2200);
      }
    };

    timerRef.current = setTimeout(stepThrough, 500);
    return () => clearTimeout(timerRef.current);
  }, [scenarioIdx]);

  const totalDuration = scenario.sessions
    .slice(0, visibleCount)
    .reduce((acc, s) => acc + s.duration, 0);

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      borderRadius: 12,
      padding: "20px 24px 16px",
      position: "relative",
      overflow: "hidden",
      width: "100%",
      height: "100%",
      color: "var(--sand-100)",
    }}>
      <style>{animationStyles}</style>
      <link rel="stylesheet" href={FONT_URL} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "-40%", left: "30%", width: "60%", height: "180%",
        background: "radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.1) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Header: caller identity */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        paddingBottom: 14,
        borderBottom: "1px solid rgba(var(--sand-100-rgb),0.08)",
        position: "relative",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(var(--warm-gold-rgb),0.1)",
          border: "1px solid rgba(var(--warm-gold-rgb),0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "workflowKeyShine 2.5s ease-in-out infinite",
        }}>
          <CallerIcon kind={scenario.icon} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div key={scenario.caller} style={{
            fontSize: 13, fontWeight: 600, color: "var(--sand-100)",
            animation: "workflowSlideIn 0.4s ease-out",
          }}>{scenario.caller}</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: "var(--warm-gold)",
            marginTop: 2,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>{scenario.keyHash}</span>
            <span style={{ color: "rgba(var(--sand-100-rgb),0.25)" }}>****</span>
          </div>
        </div>
        <div style={{
          fontSize: 9, fontWeight: 600,
          color: "rgba(var(--sand-100-rgb),0.35)",
          textTransform: "uppercase", letterSpacing: "0.1em",
          padding: "4px 8px",
          background: "rgba(var(--sand-100-rgb),0.04)",
          border: "1px solid rgba(var(--sand-100-rgb),0.08)",
          borderRadius: 4,
        }}>API Key</div>
      </div>

      {/* Correlation ID ribbon */}
      <div style={{
        marginTop: 12, marginBottom: 12,
        padding: "8px 12px",
        background: "rgba(var(--warm-gold-rgb),0.06)",
        border: "1px dashed rgba(var(--warm-gold-rgb),0.25)",
        borderRadius: 6,
        display: "flex", alignItems: "center", gap: 10,
        position: "relative",
        overflow: "hidden",
      }}>
        <span style={{
          fontSize: 9, fontWeight: 600,
          color: "rgba(var(--sand-100-rgb),0.4)",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>correlation-id</span>
        <span key={scenario.correlationId} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, color: "var(--warm-gold)",
          animation: "workflowSlideIn 0.4s ease-out",
        }}>{scenario.correlationId}</span>
        {runningIdx >= 0 && (
          <div style={{
            position: "absolute", top: 0, width: 60, height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(var(--warm-gold-rgb),0.15), transparent)",
            animation: "workflowScanLine 1.2s ease-in-out",
          }} />
        )}
      </div>

      {/* Session stream */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 6,
        height: 180, overflow: "hidden",
      }}>
        {scenario.sessions.map((s, i) => {
          const visible = i < visibleCount;
          const running = i === runningIdx;
          const done = i < visibleCount && !running;
          return (
            <div key={`${scenarioIdx}-${i}`} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px",
              borderRadius: 6,
              background: running
                ? "rgba(var(--warm-gold-rgb),0.08)"
                : done
                  ? "rgba(var(--sand-100-rgb),0.03)"
                  : "transparent",
              border: running
                ? "1px solid rgba(var(--warm-gold-rgb),0.25)"
                : done
                  ? "1px solid rgba(var(--sand-100-rgb),0.06)"
                  : "1px solid transparent",
              opacity: visible ? 1 : 0,
              animation: visible ? "workflowFadeIn 0.3s ease-out" : "none",
            }}>
              {/* Status dot */}
              <span style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: running ? "var(--warm-gold)" : done ? "#4A7C59" : "rgba(var(--sand-100-rgb),0.15)",
                animation: running ? "workflowPulse 1s ease-in-out infinite" : "none",
              }} />
              {/* Connection name */}
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 500,
                color: "var(--sand-300)",
                flexShrink: 0,
                minWidth: 130,
              }}>{s.connection}</span>
              {/* Command */}
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(var(--sand-100-rgb),0.45)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                flex: 1,
              }}>{s.command}</span>
              {/* Duration / status */}
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, fontWeight: 500,
                color: running ? "var(--warm-gold)" : done ? "#7CB88A" : "rgba(var(--sand-100-rgb),0.2)",
                flexShrink: 0,
              }}>
                {running ? "running…" : done ? `${s.duration}ms` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20,
        marginTop: 10, paddingTop: 10,
        borderTop: "1px solid rgba(var(--sand-100-rgb),0.06)",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: "rgba(var(--sand-100-rgb),0.35)",
        }}>{visibleCount} / {scenario.sessions.length} sessions</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: "rgba(var(--sand-100-rgb),0.35)",
        }}>1 workflow run</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: "var(--warm-gold)",
          marginLeft: "auto",
        }}>{totalDuration}ms total</span>
      </div>
    </div>
  );
};
