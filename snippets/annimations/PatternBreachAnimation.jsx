/**
 * PatternBreachAnimation — Benign queries forming a data extraction pattern
 *
 * Shows individual queries appearing one by one — each looks harmless.
 * After all appear, a "pattern detected" overlay connects them,
 * revealing the extraction. Conveys: static rules miss behavioral patterns.
 *
 * Pure CSS + React state.
 */

export const PatternBreachAnimation = () => {
  const QUERIES = [
    { cmd: 'SELECT name FROM customers LIMIT 100 OFFSET 0;',     time: '3:01:12' },
    { cmd: 'SELECT name FROM customers LIMIT 100 OFFSET 100;',   time: '3:01:14' },
    { cmd: 'SELECT name FROM customers LIMIT 100 OFFSET 200;',   time: '3:01:15' },
    { cmd: 'SELECT email FROM customers LIMIT 100 OFFSET 0;',    time: '3:01:17' },
    { cmd: 'SELECT ssn FROM customers LIMIT 100 OFFSET 0;',      time: '3:01:18' },
  ];

  const QUERY_DELAY = 700;
  const PATTERN_DELAY = 1200;
  const CYCLE_PAD = 2800;

  const [cycle, setCycle]       = useState(0);
  const [visible, setVisible]   = useState(0);
  const [detected, setDetected] = useState(false);
  const timers                  = useRef([]);

  function T(fn, ms) { const id = setTimeout(fn, ms); timers.current.push(id); }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(0);
    setDetected(false);

    QUERIES.forEach((_, i) => {
      T(() => setVisible(i + 1), (i + 1) * QUERY_DELAY);
    });

    const patternTime = QUERIES.length * QUERY_DELAY + PATTERN_DELAY;
    T(() => setDetected(true), patternTime);
    T(() => setCycle((c) => c + 1), patternTime + CYCLE_PAD);

    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  return (
    <div className="pb-root" aria-hidden="true">
      <div className="mock-container pb-mock">
        <div className="mock-toolbar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="mock-dot" /><div className="mock-dot" /><div className="mock-dot" />
          </div>
          <span className="pb-title">session monitor · alice@corp.com</span>
          <span style={{ width: 48 }} />
        </div>

        <div className="pb-stream">
          {QUERIES.map((q, i) => {
            const show = i < visible;
            return (
              <div key={i} className={`pb-row${show ? ' pb-vis' : ''}${detected ? ' pb-flagged' : ''}`}>
                <span className="pb-time">{q.time}</span>
                <span className="pb-cmd">{q.cmd}</span>
                {show && !detected && <span className="pb-ok">\u2713 pass</span>}
              </div>
            );
          })}
        </div>

        {/* Pattern detected overlay */}
        <div className={`pb-alert${detected ? ' pb-alert-vis' : ''}`}>
          <span className="pb-alert-icon">!</span>
          <div className="pb-alert-text">
            <strong>Extraction pattern detected</strong>
            <span>5 sequential queries · full table scan · 3 sensitive columns</span>
          </div>
        </div>

        <div className="pb-footer">
          <span className={`pb-status-dot${detected ? ' pb-status-warn' : ''}`} />
          <span>{detected ? 'Behavioral anomaly flagged' : 'Static rules: all queries passed'}</span>
        </div>
      </div>

      <style>{`
        .pb-root { width: 100%; }
        .pb-mock { border-radius: 12px; overflow: hidden; position: relative; }
        .pb-title { font-family: var(--mono); font-size: 11px; color: rgba(var(--sand-100-rgb),0.2); }

        .pb-stream { padding: 10px 16px; display: flex; flex-direction: column; gap: 2px; min-height: 180px; }

        .pb-row {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 8px; border-radius: 4px;
          opacity: 0; transform: translateX(-6px);
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.4s ease, border-color 0.4s ease;
          border: 1px solid transparent;
        }
        .pb-row.pb-vis { opacity: 1; transform: translateX(0); }
        .pb-row.pb-flagged {
          border-color: rgba(var(--warm-gold-rgb),0.2);
          background: rgba(var(--warm-gold-rgb),0.04);
        }

        .pb-time { font-family: var(--mono); font-size: 10px; color: rgba(var(--sand-100-rgb),0.2); flex-shrink: 0; }
        .pb-cmd { font-family: var(--mono); font-size: 11px; color: rgba(var(--sand-100-rgb),0.5); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pb-ok { font-family: var(--sans); font-size: 9px; color: rgba(var(--success-rgb),0.5); flex-shrink: 0; }

        .pb-alert {
          margin: 0 16px 10px;
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 14px; border-radius: 6px;
          background: rgba(var(--warm-gold-rgb),0.08);
          border: 1px solid rgba(var(--warm-gold-rgb),0.15);
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .pb-alert-vis { opacity: 1; transform: translateY(0); }

        .pb-alert-icon {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(var(--warm-gold-rgb),0.15); color: var(--warm-gold);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; flex-shrink: 0;
        }
        .pb-alert-text { display: flex; flex-direction: column; gap: 2px; }
        .pb-alert-text strong { font-family: var(--sans); font-size: 12px; color: var(--warm-gold); font-weight: 600; }
        .pb-alert-text span { font-family: var(--sans); font-size: 11px; color: rgba(var(--sand-100-rgb),0.35); }

        .pb-footer {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 16px; border-top: 1px solid rgba(var(--sand-100-rgb),0.06);
          font-family: var(--sans); font-size: 11px; color: rgba(var(--sand-100-rgb),0.25);
          transition: color 0.3s ease;
        }
        .pb-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(var(--sand-100-rgb),0.15);
          transition: background 0.3s ease;
        }
        .pb-status-dot.pb-status-warn { background: var(--warm-gold); }
      `}</style>
    </div>
  );
}
