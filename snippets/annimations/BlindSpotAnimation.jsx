/**
 * BlindSpotAnimation — Visualizes unprotected data flowing through a wire
 *
 * Used in: app/page.jsx (The Blind Spot section)
 *
 * Shows a live data stream with sensitive values (SSNs, emails, credit cards)
 * flowing through undetected. A status bar shows "0 threats detected" while
 * sensitive data streams past — conveying the blind spot visually.
 *
 * Phases:
 *   1. Data packets stream left-to-right through a wire
 *   2. Some packets briefly flash to reveal sensitive content
 *   3. Status bar stays at "0 detected" — nothing is catching it
 *   4. Loop
 *
 * Pure CSS keyframes + React state — no external animation library.
 */

export const BlindSpotAnimation = () => {
  const STREAM_ITEMS = [
    { id: 0, type: 'safe',      label: 'SELECT name FROM users',          delay: 0 },
    { id: 1, type: 'sensitive',  label: '→ 123-45-6789',                   delay: 600 },
    { id: 2, type: 'safe',      label: 'GET /api/v1/health',              delay: 1100 },
    { id: 3, type: 'sensitive',  label: '→ alice@corp.com',                delay: 1700 },
    { id: 4, type: 'safe',      label: 'kubectl get pods -n prod',        delay: 2200 },
    { id: 5, type: 'sensitive',  label: '→ 4532-XXXX-XXXX-8821',          delay: 2900 },
    { id: 6, type: 'safe',      label: 'UPDATE sessions SET token=...',   delay: 3400 },
    { id: 7, type: 'sensitive',  label: '→ SSN: 987-65-4321',             delay: 4000 },
  ];

  const CYCLE_DURATION = 5200;

  const [cycle, setCycle]           = useState(0);
  const [visibleItems, setVisible]  = useState(new Set());
  const [flashItems, setFlash]      = useState(new Set());
  const timers                      = useRef([]);

  function T(fn, delay) {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(new Set());
    setFlash(new Set());

    STREAM_ITEMS.forEach((item) => {
      // Appear
      T(() => setVisible((prev) => new Set([...prev, item.id])), item.delay);

      // Flash sensitive items briefly
      if (item.type === 'sensitive') {
        T(() => setFlash((prev) => new Set([...prev, item.id])), item.delay + 200);
        T(() => setFlash((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        }), item.delay + 700);
      }
    });

    // Reset cycle
    T(() => setCycle((c) => c + 1), CYCLE_DURATION);

    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  return (
    <div className="bs-root" aria-hidden="true">
      <div className="mock-container bs-mock">

        {/* Toolbar */}
        <div className="mock-toolbar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="mock-dot" />
            <div className="mock-dot" />
            <div className="mock-dot" />
          </div>
          <span className="bs-title">network traffic · live</span>
          <span style={{ width: 48 }} />
        </div>

        {/* Stream */}
        <div className="bs-stream">
          {STREAM_ITEMS.map((item) => {
            const show = visibleItems.has(item.id);
            const flash = flashItems.has(item.id);
            const isSensitive = item.type === 'sensitive';

            return (
              <div
                key={item.id}
                className={`bs-packet${show ? ' bs-visible' : ''}${flash ? ' bs-flash' : ''}${isSensitive ? ' bs-sensitive' : ''}`}
              >
                <span className="bs-dot-indicator" />
                <span className="bs-packet-text">{item.label}</span>
                {isSensitive && <span className="bs-tag">PII</span>}
              </div>
            );
          })}
        </div>

        {/* Status bar — always shows 0 */}
        <div className="bs-status">
          <div className="bs-status-left">
            <span className="bs-status-dot" />
            <span>Monitoring</span>
          </div>
          <div className="bs-status-right">
            <span className="bs-counter">0 threats detected</span>
          </div>
        </div>
      </div>

      <style>{`
        .bs-root {
          position: relative;
          width: 100%;
        }

        .bs-mock {
          border-radius: 12px;
          overflow: hidden;
        }

        .bs-title {
          font-family: var(--mono);
          font-size: 11px;
          color: rgba(var(--sand-100-rgb), 0.2);
        }

        /* Stream area */
        .bs-stream {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-height: 240px;
        }

        .bs-packet {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border-radius: 4px;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.25s ease;
        }

        .bs-packet.bs-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .bs-packet.bs-flash {
          background: rgba(var(--warm-gold-rgb), 0.08);
        }

        .bs-dot-indicator {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(var(--sand-100-rgb), 0.15);
          flex-shrink: 0;
        }

        .bs-sensitive .bs-dot-indicator {
          background: rgba(var(--warm-gold-rgb), 0.4);
        }

        .bs-flash .bs-dot-indicator {
          background: var(--warm-gold);
        }

        .bs-packet-text {
          font-family: var(--mono);
          font-size: 12px;
          color: rgba(var(--sand-100-rgb), 0.4);
          white-space: nowrap;
        }

        .bs-sensitive .bs-packet-text {
          color: rgba(var(--sand-100-rgb), 0.5);
        }

        .bs-flash .bs-packet-text {
          color: rgba(var(--warm-gold-rgb), 0.8);
        }

        .bs-tag {
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(var(--warm-gold-rgb), 0.5);
          background: rgba(var(--warm-gold-rgb), 0.06);
          padding: 1px 6px;
          border-radius: 3px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .bs-flash .bs-tag {
          opacity: 1;
        }

        /* Status bar */
        .bs-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-top: 1px solid rgba(var(--sand-100-rgb), 0.06);
          font-family: var(--sans);
          font-size: 11px;
        }

        .bs-status-left {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(var(--sand-100-rgb), 0.25);
        }

        .bs-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(var(--sand-100-rgb), 0.15);
          animation: bs-pulse 2s ease-in-out infinite;
        }

        @keyframes bs-pulse {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }

        .bs-status-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .bs-counter {
          font-family: var(--mono);
          font-size: 11px;
          color: rgba(var(--sand-100-rgb), 0.2);
        }
      `}</style>
    </div>
  );
}
