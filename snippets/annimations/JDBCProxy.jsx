/**
 * JDBCProxy — Animated horizontal flow diagram showing how agents/apps
 * connect through Hoop Gateway by simply changing the connection string.
 *
 * 3 stages: Sources (left) → Gateway (center) → Database (right)
 * Animated dots flow left-to-right, changing color at the gateway.
 */

export const JDBCProxy = () => {
  const SOURCES = [
    {
      name: 'Claude Code',
      icon: 'agent',
      accent: 'var(--warm-gold)',
    },
    {
      name: 'ETL Pipeline',
      icon: 'gear',
      accent: 'rgba(var(--sand-100-rgb),0.5)',
    },
    {
      name: 'DBeaver',
      icon: 'database',
      accent: 'rgba(var(--sand-100-rgb),0.5)',
    },
  ];

  const CONN_STRING = 'jdbc:postgresql://gateway.hoop.dev:5432/prod';

  const CONTROLS = [
    { label: 'Mask PII' },
    { label: 'Log session' },
    { label: 'Apply guardrails' },
  ];

  const MESSAGES = [
    'No SDK required. Just change the connection string.',
    'Same JDBC driver. Same ORM. Same code.',
    "The agent doesn't know Hoop exists.",
  ];

  /* ---- icons ---- */
  function AgentIcon({ color }) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke={color} strokeWidth="1.2" />
        <path d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  function GearIcon({ color }) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke={color} strokeWidth="1.2" />
        <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke={color} strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }

  function DbIcon({ color }) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <ellipse cx="8" cy="4" rx="5" ry="2" stroke={color} strokeWidth="1.2" />
        <path d="M3 4v8c0 1.1 2.24 2 5 2s5-.9 5-2V4" stroke={color} strokeWidth="1.2" />
        <path d="M3 8c0 1.1 2.24 2 5 2s5-.9 5-2" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  }

  function ShieldIcon({ color }) {
    return (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 5.5V10C3 14.5 6 17.5 10 19C14 17.5 17 14.5 17 10V5.5L10 2Z"
          fill="rgba(var(--warm-gold-rgb),0.10)" stroke={color} strokeWidth="1.2" />
        <path d="M7 10l2 2 4-4" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  function SourceIcon({ type, color }) {
    if (type === 'agent') return <AgentIcon color={color} />;
    if (type === 'gear') return <GearIcon color={color} />;
    return <DbIcon color={color} />;
  }

  const [activeSource, setActiveSource] = useState(-1);
  const [dotPhase, setDotPhase] = useState('idle'); // idle | toGateway | atGateway | toDb | done
  const [activeControls, setActiveControls] = useState(-1);
  const [messageIdx, setMessageIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const timers = useRef([]);

  function T(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const srcIdx = cycle % SOURCES.length;

    setActiveSource(srcIdx);
    setDotPhase('idle');
    setActiveControls(-1);

    // Dot starts moving to gateway
    T(() => setDotPhase('toGateway'), 200);

    // Dot arrives at gateway
    T(() => setDotPhase('atGateway'), 900);

    // Controls light up sequentially
    T(() => setActiveControls(0), 1000);
    T(() => setActiveControls(1), 1300);
    T(() => setActiveControls(2), 1600);

    // Dot continues to database (now gold)
    T(() => setDotPhase('toDb'), 1900);

    // Dot arrives
    T(() => setDotPhase('done'), 2500);

    // Cycle message
    T(() => setMessageIdx((m) => (m + 1) % MESSAGES.length), 2200);

    // Next cycle
    T(() => setCycle((c) => c + 1), 3400);

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  const gatewayActive = dotPhase === 'atGateway' || activeControls >= 0;

  return (
    <div className="jdbc-root" aria-hidden="true">
      <div className="jdbc-flow">
        {/* ---- Stage 1: Sources ---- */}
        <div className="jdbc-sources">
          {SOURCES.map((src, i) => {
            const active = i === activeSource;
            return (
              <div key={src.name} className={`jdbc-card${active ? ' jdbc-card--active' : ''}`}>
                <div className="jdbc-card-header">
                  <SourceIcon
                    type={src.icon}
                    color={active ? (src.icon === 'agent' ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.6)') : 'rgba(var(--sand-100-rgb),0.2)'}
                  />
                  <span className="jdbc-card-name" style={{
                    color: active ? 'var(--sand-100)' : 'rgba(var(--sand-100-rgb),0.35)',
                  }}>{src.name}</span>
                </div>
                <div className="jdbc-card-conn" style={{
                  color: active ? 'rgba(var(--warm-gold-rgb),0.6)' : 'rgba(var(--sand-100-rgb),0.12)',
                }}>{CONN_STRING}</div>
              </div>
            );
          })}
        </div>

        {/* ---- Flow line: Source → Gateway ---- */}
        <div className="jdbc-line-container">
          <div className={`jdbc-line${gatewayActive || dotPhase === 'toGateway' ? ' jdbc-line--active' : ''}`} />
          {(dotPhase === 'toGateway') && (
            <div className="jdbc-dot jdbc-dot--white jdbc-dot--move-right" />
          )}
        </div>

        {/* ---- Stage 2: Gateway ---- */}
        <div className={`jdbc-gateway${gatewayActive ? ' jdbc-gateway--active' : ''}`}>
          <ShieldIcon color={gatewayActive ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.25)'} />
          <span className="jdbc-gateway-label" style={{
            color: gatewayActive ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.3)',
          }}>Hoop Gateway</span>

          <div className="jdbc-controls">
            {CONTROLS.map((ctrl, i) => {
              const on = i <= activeControls;
              return (
                <div key={ctrl.label} className={`jdbc-ctrl${on ? ' jdbc-ctrl--on' : ''}`}>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3 8.5L6.5 12L13 4"
                      stroke={on ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.15)'}
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{ctrl.label}</span>
                </div>
              );
            })}
          </div>

          <span className="jdbc-latency" style={{
            opacity: gatewayActive ? 1 : 0.3,
          }}>{'< 5ms added latency'}</span>
        </div>

        {/* ---- Flow line: Gateway → Database ---- */}
        <div className="jdbc-line-container">
          <div className={`jdbc-line${dotPhase === 'toDb' || dotPhase === 'done' ? ' jdbc-line--active' : ''}`} />
          {(dotPhase === 'toDb') && (
            <div className="jdbc-dot jdbc-dot--gold jdbc-dot--move-right" />
          )}
        </div>

        {/* ---- Stage 3: Database ---- */}
        <div className={`jdbc-dest${dotPhase === 'done' ? ' jdbc-dest--active' : ''}`}>
          <DbIcon color={dotPhase === 'done' ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.25)'} />
          <span className="jdbc-dest-name" style={{
            color: dotPhase === 'done' ? 'var(--sand-100)' : 'rgba(var(--sand-100-rgb),0.35)',
          }}>PostgreSQL</span>
          <span className="jdbc-dest-host">prod-db-cluster.internal:5432</span>
        </div>
      </div>

      {/* ---- Callout message ---- */}
      <div className="jdbc-message" key={messageIdx}>
        {MESSAGES[messageIdx]}
      </div>

      <style>{`
        .jdbc-root {
          width: 100%;
          max-width: 650px;
          margin: 0 auto;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .jdbc-flow {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        /* ---- Sources ---- */
        .jdbc-sources {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-shrink: 0;
          width: 180px;
        }

        .jdbc-card {
          padding: 8px 10px;
          border-radius: 8px;
          background: rgba(var(--sand-100-rgb),0.04);
          border: 1px solid rgba(var(--sand-100-rgb),0.08);
          transition: all 0.4s ease;
        }
        .jdbc-card--active {
          background: rgba(var(--warm-gold-rgb),0.06);
          border-color: rgba(var(--warm-gold-rgb),0.18);
        }

        .jdbc-card-header {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 4px;
        }

        .jdbc-card-name {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          transition: color 0.4s ease;
        }

        .jdbc-card-conn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          line-height: 1.3;
          word-break: break-all;
          transition: color 0.4s ease;
        }

        /* ---- Flow lines ---- */
        .jdbc-line-container {
          flex: 1;
          min-width: 32px;
          height: 2px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .jdbc-line {
          width: 100%;
          height: 1px;
          background: rgba(var(--sand-100-rgb),0.08);
          transition: background 0.4s ease;
        }
        .jdbc-line--active {
          background: rgba(var(--warm-gold-rgb),0.3);
        }

        .jdbc-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          filter: blur(0px);
        }
        .jdbc-dot--white {
          background: var(--sand-100);
          box-shadow: 0 0 6px rgba(var(--sand-100-rgb),0.5);
        }
        .jdbc-dot--gold {
          background: var(--warm-gold);
          box-shadow: 0 0 8px rgba(var(--warm-gold-rgb),0.6);
        }
        .jdbc-dot--move-right {
          animation: jdbc-travel 0.7s ease-in-out forwards;
        }

        @keyframes jdbc-travel {
          0% { left: 0%; }
          100% { left: calc(100% - 6px); }
        }

        /* ---- Gateway ---- */
        .jdbc-gateway {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(var(--sand-100-rgb),0.04);
          border: 1px solid rgba(var(--sand-100-rgb),0.08);
          transition: all 0.4s ease;
          min-width: 130px;
        }
        .jdbc-gateway--active {
          background: rgba(var(--warm-gold-rgb),0.06);
          border-color: rgba(var(--warm-gold-rgb),0.3);
          box-shadow: 0 0 20px rgba(var(--warm-gold-rgb),0.08);
        }

        .jdbc-gateway-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          transition: color 0.4s ease;
        }

        .jdbc-controls {
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 100%;
          margin-top: 4px;
        }

        .jdbc-ctrl {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }
        .jdbc-ctrl--on {
          opacity: 1;
        }
        .jdbc-ctrl span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: rgba(var(--sand-100-rgb),0.5);
        }
        .jdbc-ctrl--on span {
          color: rgba(var(--sand-100-rgb),0.75);
        }

        .jdbc-latency {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: rgba(var(--sand-100-rgb),0.2);
          margin-top: 4px;
          transition: opacity 0.4s ease;
        }

        /* ---- Destination ---- */
        .jdbc-dest {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 12px;
          border-radius: 10px;
          background: rgba(var(--sand-100-rgb),0.02);
          border: 1px solid rgba(var(--sand-100-rgb),0.06);
          transition: all 0.4s ease;
          min-width: 100px;
        }
        .jdbc-dest--active {
          border-color: rgba(var(--warm-gold-rgb),0.15);
        }

        .jdbc-dest-name {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          transition: color 0.4s ease;
        }

        .jdbc-dest-host {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: rgba(var(--sand-100-rgb),0.2);
          text-align: center;
          word-break: break-all;
        }

        /* ---- Message callout ---- */
        .jdbc-message {
          text-align: center;
          margin-top: 20px;
          padding-top: 14px;
          border-top: 1px solid rgba(var(--sand-100-rgb),0.06);
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(var(--sand-100-rgb),0.4);
          font-style: italic;
          animation: jdbc-fade-in 0.5s ease;
        }

        @keyframes jdbc-fade-in {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
