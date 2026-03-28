/**
 * DataFlowAnimation — Configurable sensitive-data-in-transit stream
 *
 * Props:
 *   variant — 'database' | 'phi' | 'financial' | 'general'
 *
 * Each variant shows domain-specific sensitive data flowing through
 * a wire unprotected. Items slide in, sensitive ones briefly flash
 * gold to reveal PII/PHI/financial data, then fade — conveying that
 * nothing is catching it.
 *
 * Pure CSS keyframes + React state.
 */

export const DataFlowAnimation = ({ variant = 'general' }) => {
  const VARIANTS = {
    database: {
      title: 'postgres:prod · live queries',
      items: [
        { type: 'safe',      label: 'SELECT name, dept FROM employees' },
        { type: 'sensitive',  label: '→ ssn: 123-45-6789',              tag: 'SSN' },
        { type: 'safe',      label: 'UPDATE orders SET status=shipped' },
        { type: 'sensitive',  label: '→ email: j.smith@acme.com',       tag: 'PII' },
        { type: 'safe',      label: 'SELECT count(*) FROM sessions' },
        { type: 'sensitive',  label: '→ ssn: 987-65-4321',              tag: 'SSN' },
      ],
    },
    phi: {
      title: 'ehr-db:prod · patient queries',
      items: [
        { type: 'safe',      label: 'SELECT patient_id, visit_date' },
        { type: 'sensitive',  label: '→ diagnosis: Type 2 Diabetes',    tag: 'PHI' },
        { type: 'safe',      label: 'GET /api/lab-results/4821' },
        { type: 'sensitive',  label: '→ ssn: 321-54-9876',              tag: 'SSN' },
        { type: 'safe',      label: 'SELECT medication FROM rx_active' },
        { type: 'sensitive',  label: '→ mrn: MRN-00284719',             tag: 'MRN' },
      ],
    },
    financial: {
      title: 'payments-db:prod · transactions',
      items: [
        { type: 'safe',      label: 'SELECT tx_id, amount, status' },
        { type: 'sensitive',  label: '→ card: 4532-8821-0093-4417',     tag: 'PCI' },
        { type: 'safe',      label: 'GET /api/settlements/batch-429' },
        { type: 'sensitive',  label: '→ account: 0028-4719-882',        tag: 'PII' },
        { type: 'safe',      label: 'SELECT balance FROM accounts' },
        { type: 'sensitive',  label: '→ routing: 021000021',            tag: 'PII' },
      ],
    },
    general: {
      title: 'network traffic · live',
      items: [
        { type: 'safe',      label: 'SELECT name FROM users' },
        { type: 'sensitive',  label: '→ 123-45-6789',                   tag: 'SSN' },
        { type: 'safe',      label: 'GET /api/v1/health' },
        { type: 'sensitive',  label: '→ alice@corp.com',                tag: 'PII' },
        { type: 'safe',      label: 'kubectl get pods -n prod' },
        { type: 'sensitive',  label: '→ 4532-XXXX-XXXX-8821',          tag: 'PCI' },
      ],
    },
  };

  const ITEM_DELAY = 650;
  const FLASH_DURATION = 500;
  const CYCLE_PAD = 1200;

  const config = VARIANTS[variant] || VARIANTS.general;
  const [cycle, setCycle]          = useState(0);
  const [visibleSet, setVisible]   = useState(new Set());
  const [flashSet, setFlash]       = useState(new Set());
  const timers                     = useRef([]);

  function T(fn, ms) { const id = setTimeout(fn, ms); timers.current.push(id); }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(new Set());
    setFlash(new Set());

    config.items.forEach((item, i) => {
      const t = i * ITEM_DELAY;
      T(() => setVisible((s) => new Set([...s, i])), t);

      if (item.type === 'sensitive') {
        T(() => setFlash((s) => new Set([...s, i])), t + 180);
        T(() => setFlash((s) => { const n = new Set(s); n.delete(i); return n; }), t + 180 + FLASH_DURATION);
      }
    });

    T(() => setCycle((c) => c + 1), config.items.length * ITEM_DELAY + CYCLE_PAD);
    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, variant]);

  return (
    <div className="df-root" aria-hidden="true">
      <div className="mock-container df-mock">
        {/* Toolbar */}
        <div className="mock-toolbar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="mock-dot" /><div className="mock-dot" /><div className="mock-dot" />
          </div>
          <span className="df-title">{config.title}</span>
          <span style={{ width: 48 }} />
        </div>

        {/* Stream */}
        <div className="df-stream">
          {config.items.map((item, i) => {
            const show = visibleSet.has(i);
            const flash = flashSet.has(i);
            const sens = item.type === 'sensitive';
            return (
              <div key={i} className={`df-row${show ? ' df-vis' : ''}${flash ? ' df-flash' : ''}${sens ? ' df-sens' : ''}`}>
                <span className="df-dot" />
                <span className="df-text">{item.label}</span>
                {item.tag && <span className="df-tag">{item.tag}</span>}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="df-footer">
          <span className="df-pulse" />
          <span>No protections active</span>
        </div>
      </div>

      <style>{`
        .df-root { width: 100%; }
        .df-mock { border-radius: 12px; overflow: hidden; }
        .df-title { font-family: var(--mono); font-size: 11px; color: rgba(var(--sand-100-rgb),0.2); }

        .df-stream { padding: 10px 16px; display: flex; flex-direction: column; gap: 2px; min-height: 200px; }

        .df-row {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 10px; border-radius: 4px;
          opacity: 0; transform: translateX(-8px);
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.25s ease;
        }
        .df-row.df-vis { opacity: 1; transform: translateX(0); }
        .df-row.df-flash { background: rgba(var(--warm-gold-rgb),0.08); }

        .df-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(var(--sand-100-rgb),0.15); flex-shrink: 0; }
        .df-sens .df-dot { background: rgba(var(--warm-gold-rgb),0.4); }
        .df-flash .df-dot { background: var(--warm-gold); }

        .df-text { font-family: var(--mono); font-size: 12px; color: rgba(var(--sand-100-rgb),0.4); white-space: nowrap; }
        .df-sens .df-text { color: rgba(var(--sand-100-rgb),0.5); }
        .df-flash .df-text { color: rgba(var(--warm-gold-rgb),0.8); }

        .df-tag {
          font-family: var(--sans); font-size: 9px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          color: rgba(var(--warm-gold-rgb),0.5); background: rgba(var(--warm-gold-rgb),0.06);
          padding: 1px 6px; border-radius: 3px;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .df-flash .df-tag { opacity: 1; }

        .df-footer {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 16px; border-top: 1px solid rgba(var(--sand-100-rgb),0.06);
          font-family: var(--sans); font-size: 11px; color: rgba(var(--sand-100-rgb),0.2);
        }
        .df-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(var(--sand-100-rgb),0.15);
          animation: df-p 2s ease-in-out infinite;
        }
        @keyframes df-p { 0%,100%{opacity:.5} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
