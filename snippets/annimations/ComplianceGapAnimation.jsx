/**
 * ComplianceGapAnimation — Audit checklist with unanswered questions
 *
 * Shows a compliance audit checklist where questions appear one by one.
 * Some get a green check (provable), but the critical ones get a red "?"
 * or "NO PROOF" badge — conveying audit gaps.
 *
 * Pure CSS + React state.
 */

export const ComplianceGapAnimation = () => {
  const CHECKS = [
    { q: 'VPN access logs collected?',              status: 'pass' },
    { q: 'Database audit logging enabled?',         status: 'pass' },
    { q: 'Who saw data in query responses?',        status: 'fail' },
    { q: 'What did AI agent do during access?',     status: 'fail' },
    { q: 'PII masked when contractor queried DB?',  status: 'fail' },
    { q: 'Session-level actions tied to identity?',  status: 'fail' },
  ];

  const ITEM_DELAY = 800;
  const CYCLE_PAD = 2500;

  const [cycle, setCycle]     = useState(0);
  const [visible, setVisible] = useState(0);
  const timers                = useRef([]);

  function T(fn, ms) { const id = setTimeout(fn, ms); timers.current.push(id); }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(0);

    CHECKS.forEach((_, i) => {
      T(() => setVisible(i + 1), (i + 1) * ITEM_DELAY);
    });

    T(() => setCycle((c) => c + 1), CHECKS.length * ITEM_DELAY + CYCLE_PAD);
    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  const failCount = CHECKS.filter((c) => c.status === 'fail').length;
  const shownFails = CHECKS.slice(0, visible).filter((c) => c.status === 'fail').length;

  return (
    <div className="cg-root" aria-hidden="true">
      <div className="mock-container cg-mock">
        <div className="mock-toolbar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="mock-dot" /><div className="mock-dot" /><div className="mock-dot" />
          </div>
          <span className="cg-title">SOX / SOC2 · audit review</span>
          <span style={{ width: 48 }} />
        </div>

        <div className="cg-list">
          {CHECKS.map((c, i) => {
            const show = i < visible;
            const isFail = c.status === 'fail';
            return (
              <div key={i} className={`cg-item${show ? ' cg-vis' : ''}${isFail && show ? ' cg-fail' : ''}`}>
                <span className={`cg-icon${isFail ? ' cg-icon-fail' : ' cg-icon-pass'}`}>
                  {show ? (isFail ? '?' : '\u2713') : ''}
                </span>
                <span className="cg-question">{c.q}</span>
                {isFail && show && <span className="cg-badge">NO PROOF</span>}
              </div>
            );
          })}
        </div>

        <div className="cg-footer">
          <span className={`cg-status${shownFails > 0 ? ' cg-status-warn' : ''}`}>
            {shownFails > 0
              ? `${shownFails} of ${failCount} critical gaps found`
              : 'Reviewing...'}
          </span>
        </div>
      </div>

      <style>{`
        .cg-root { width: 100%; }
        .cg-mock { border-radius: 12px; overflow: hidden; }
        .cg-title { font-family: var(--mono); font-size: 11px; color: rgba(var(--sand-100-rgb),0.2); }

        .cg-list { padding: 10px 16px; display: flex; flex-direction: column; gap: 2px; min-height: 210px; }

        .cg-item {
          display: flex; align-items: center; gap: 10px;
          padding: 7px 10px; border-radius: 4px;
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
        }
        .cg-item.cg-vis { opacity: 1; transform: translateY(0); }
        .cg-item.cg-fail { background: rgba(var(--error-rgb),0.06); }

        .cg-icon {
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; flex-shrink: 0;
        }
        .cg-icon-pass { background: rgba(var(--success-rgb),0.15); color: rgba(var(--success-rgb),0.8); }
        .cg-icon-fail { background: rgba(var(--error-rgb),0.15); color: var(--error); }

        .cg-question { font-family: var(--sans); font-size: 12px; color: rgba(var(--sand-100-rgb),0.5); flex: 1; }
        .cg-fail .cg-question { color: rgba(var(--sand-100-rgb),0.65); }

        .cg-badge {
          font-family: var(--sans); font-size: 9px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--error); background: rgba(var(--error-rgb),0.1);
          padding: 2px 7px; border-radius: 3px; flex-shrink: 0;
        }

        .cg-footer {
          padding: 10px 16px; border-top: 1px solid rgba(var(--sand-100-rgb),0.06);
          font-family: var(--sans); font-size: 11px; color: rgba(var(--sand-100-rgb),0.25);
        }
        .cg-status-warn { color: var(--error); font-weight: 500; }
      `}</style>
    </div>
  );
}
