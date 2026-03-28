/**
 * ObservabilityAnimation — Agent session log with live scoring
 *
 * Shows a session log where agent actions appear one by one.
 * Each gets a risk score and status tag (logged/blocked/approved).
 * Conveys: every agent action is recorded, scored, reviewable.
 *
 * Pure CSS + React state.
 */

export const ObservabilityAnimation = () => {
  const ACTIONS = [
    { action: 'SELECT * FROM users',          score: 'low',     status: 'logged',    color: 'rgba(var(--success-rgb),0.7)' },
    { action: 'kubectl get pods -n prod',     score: 'low',     status: 'logged',    color: 'rgba(var(--success-rgb),0.7)' },
    { action: 'UPDATE config SET rate=500',   score: 'medium',  status: 'approved',  color: 'var(--warm-gold)' },
    { action: 'DELETE FROM cache WHERE 1=1',  score: 'high',    status: 'approved',  color: 'var(--warm-gold)' },
    { action: 'DROP TABLE temp_exports',      score: 'critical',status: 'blocked',   color: 'var(--error)' },
  ];

  const ITEM_DELAY = 900;
  const CYCLE_PAD = 2500;

  const [cycle, setCycle]     = useState(0);
  const [visible, setVisible] = useState(0);
  const timers                = useRef([]);

  function T(fn, ms) { const id = setTimeout(fn, ms); timers.current.push(id); }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(0);

    ACTIONS.forEach((_, i) => {
      T(() => setVisible(i + 1), (i + 1) * ITEM_DELAY);
    });

    T(() => setCycle((c) => c + 1), ACTIONS.length * ITEM_DELAY + CYCLE_PAD);
    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  const logged = ACTIONS.slice(0, visible).length;
  const blocked = ACTIONS.slice(0, visible).filter((a) => a.status === 'blocked').length;

  return (
    <div className="ob-root" aria-hidden="true">
      <div className="mock-container ob-mock">
        <div className="mock-toolbar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="mock-dot" /><div className="mock-dot" /><div className="mock-dot" />
          </div>
          <span className="ob-title">agent session · sess_01jkx7r2nb4f</span>
          <span style={{ width: 48 }} />
        </div>

        {/* Header row */}
        <div className="ob-header">
          <span className="ob-col-action">Action</span>
          <span className="ob-col-risk">Risk</span>
          <span className="ob-col-status">Status</span>
        </div>

        <div className="ob-list">
          {ACTIONS.map((a, i) => {
            const show = i < visible;
            return (
              <div key={i} className={`ob-row${show ? ' ob-vis' : ''}`}>
                <span className="ob-action">{a.action}</span>
                <span className="ob-risk" style={{ color: a.color }}>{show ? a.score : ''}</span>
                <span className={`ob-status ob-status-${a.status}`}>{show ? a.status : ''}</span>
              </div>
            );
          })}
        </div>

        <div className="ob-footer">
          <span className="ob-footer-dot" />
          <span>{logged} actions logged &middot; {blocked} blocked</span>
        </div>
      </div>

      <style>{`
        .ob-root { width: 100%; }
        .ob-mock { border-radius: 12px; overflow: hidden; }
        .ob-title { font-family: var(--mono); font-size: 11px; color: rgba(var(--sand-100-rgb),0.2); }

        .ob-header {
          display: grid; grid-template-columns: 1fr 70px 80px; gap: 8px;
          padding: 8px 16px; border-bottom: 1px solid rgba(var(--sand-100-rgb),0.06);
          font-family: var(--sans); font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: rgba(var(--sand-100-rgb),0.25);
        }

        .ob-list { padding: 4px 16px; min-height: 180px; }

        .ob-row {
          display: grid; grid-template-columns: 1fr 70px 80px; gap: 8px;
          padding: 7px 0; border-bottom: 1px solid rgba(var(--sand-100-rgb),0.04);
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .ob-row.ob-vis { opacity: 1; transform: translateY(0); }

        .ob-action { font-family: var(--mono); font-size: 11px; color: rgba(var(--sand-100-rgb),0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ob-risk { font-family: var(--sans); font-size: 10px; font-weight: 600; text-transform: uppercase; }

        .ob-status {
          font-family: var(--sans); font-size: 10px; font-weight: 500;
        }
        .ob-status-logged { color: rgba(var(--sand-100-rgb),0.3); }
        .ob-status-approved { color: var(--warm-gold); }
        .ob-status-blocked { color: var(--error); }

        .ob-footer {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 16px; border-top: 1px solid rgba(var(--sand-100-rgb),0.06);
          font-family: var(--sans); font-size: 11px; color: rgba(var(--sand-100-rgb),0.25);
        }
        .ob-footer-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--warm-gold);
          animation: ob-p 2s ease-in-out infinite;
        }
        @keyframes ob-p { 0%,100%{opacity:.5} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
