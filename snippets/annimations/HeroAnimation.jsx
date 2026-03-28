/**
 * HeroAnimation — Hero section animated visual
 *
 * Used in: app/page.jsx (Home hero, right column)
 *
 * Shows a live postgres session:
 *   1. Query types out character by character
 *   2. Data rows fade in staggered
 *   3. Sensitive columns flash warm-gold (var(--warm-gold))
 *   4. Masking applied — SSN + email replaced, badge slides in
 *   5. Resets and loops
 *
 * Pure CSS keyframes + React state — no external animation library.
 * All colors from Styleguide §2 — rgba transparency system (§4.5).
 */

export const HeroAnimation = () => {
  const QUERY = 'SELECT * FROM customers LIMIT 4;';

  const ROWS = [
    { id: 1001, name: 'J. Smith',     ssn: '123-45-6789', email: 'jsmith@acme.com'     },
    { id: 1002, name: 'M. Rodriguez', ssn: '234-56-7890', email: 'mrodriguez@acme.com'  },
    { id: 1003, name: 'A. Chen',      ssn: '345-67-8901', email: 'achen@acme.com'       },
    { id: 1004, name: 'S. Patel',     ssn: '456-78-9012', email: 'spatel@acme.com'      },
  ];

  const [cycle, setCycle]               = useState(0);
  const [typedLen, setTypedLen]         = useState(0);
  const [visibleRows, setVisibleRows]   = useState(0);
  // phase: 'typing' | 'flashing' | 'masked' | 'resetting'
  const [phase, setPhase]               = useState('typing');
  const timers                          = useRef([]);

  function T(fn, delay) {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setTypedLen(0);
    setVisibleRows(0);
    setPhase('typing');

    let t = 0;

    // 1. Type query
    for (let i = 1; i <= QUERY.length; i++) {
      t += 38;
      const ci = i;
      T(() => setTypedLen(ci), t);
    }

    // 2. Short pause, then reveal rows one by one
    t += 350;
    for (let r = 1; r <= ROWS.length; r++) {
      const cr = r;
      T(() => setVisibleRows(cr), t);
      t += 95;
    }

    // 3. Wait, then flash sensitive columns
    t += 900;
    T(() => setPhase('flashing'), t);

    // 4. Apply masking
    t += 480;
    T(() => setPhase('masked'), t);

    // 5. Hold, then reset
    t += 3200;
    T(() => setPhase('resetting'), t);

    t += 550;
    T(() => setCycle(c => c + 1), t);

    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  const isMasked    = phase === 'masked';
  const isFlashing  = phase === 'flashing';
  const isResetting = phase === 'resetting';
  const showRows    = phase !== 'typing' && phase !== 'resetting';

  return (
    <div className="ha-root" aria-hidden="true">
      <div className={`mock-container ha-mock${isResetting ? ' ha-fadeout' : ''}`}>

        {/* Toolbar */}
        <div className="mock-toolbar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="mock-dot" />
            <div className="mock-dot" />
            <div className="mock-dot" />
          </div>
          <span className="ha-wintitle">hoop — postgres:prod</span>
          <span style={{ width: 48 }} />
        </div>

        {/* Query bar */}
        <div className="ha-querybar">
          <span className="ha-prompt">psql&gt;&nbsp;</span>
          <span className="ha-querytext">{QUERY.slice(0, typedLen)}</span>
          {!isMasked && !isResetting && <span className="ha-cursor" />}
        </div>

        {/* Results table */}
        <div className="ha-tablewrap">
          <table className="ha-table">
            <thead>
              <tr>
                <th className="ha-th">id</th>
                <th className="ha-th">name</th>
                <th className="ha-th">ssn</th>
                <th className="ha-th">email</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.id}
                  className="ha-tr"
                  style={{
                    opacity: showRows && i < visibleRows ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <td className="ha-td ha-dim">{row.id}</td>
                  <td className="ha-td ha-bright">{row.name}</td>
                  <td className={`ha-td ha-sensitive${isFlashing ? ' ha-flash' : ''}${isMasked ? ' ha-masked' : ''}`}>
                    {isMasked ? `***-**-${row.ssn.slice(-4)}` : row.ssn}
                  </td>
                  <td className={`ha-td ha-sensitive${isFlashing ? ' ha-flash' : ''}${isMasked ? ' ha-masked' : ''}`}>
                    {isMasked ? '****@****.com' : row.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Masking notice badge */}
        <div className={`ha-notice${isMasked ? ' ha-notice-visible' : ''}`}>
          <span className="ha-notice-dot" />
          <span>2 columns masked &middot; SSN &middot; email</span>
        </div>

      </div>

      <style>{`
        .ha-root {
          position: relative;
          width: 100%;
          max-width: 540px;
        }

        .ha-mock {
          border-radius: 12px;
          overflow: hidden;
          transition: opacity 0.4s ease;
        }

        .ha-fadeout {
          opacity: 0;
        }

        .ha-wintitle {
          font-family: var(--mono);
          font-size: 11px;
          color: rgba(var(--sand-100-rgb), 0.2);
        }

        /* Query bar */
        .ha-querybar {
          display: flex;
          align-items: center;
          padding: 9px 16px;
          background: rgba(var(--sand-100-rgb), 0.03);
          border-top: 1px solid rgba(var(--sand-100-rgb), 0.06);
          border-bottom: 1px solid rgba(var(--sand-100-rgb), 0.06);
          min-height: 38px;
        }

        .ha-prompt {
          font-family: var(--mono);
          font-size: 12px;
          color: rgba(var(--warm-gold-rgb), 0.7);
          flex-shrink: 0;
        }

        .ha-querytext {
          font-family: var(--mono);
          font-size: 12px;
          color: rgba(var(--sand-100-rgb), 0.7);
        }

        .ha-cursor {
          display: inline-block;
          width: 6px;
          height: 13px;
          background: rgba(var(--sand-100-rgb), 0.5);
          margin-left: 1px;
          vertical-align: middle;
          animation: ha-blink 1s step-end infinite;
        }

        @keyframes ha-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* Table */
        .ha-tablewrap {
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .ha-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--mono);
          font-size: 12px;
        }

        .ha-th {
          text-align: left;
          padding: 7px 16px;
          color: rgba(var(--sand-100-rgb), 0.25);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid rgba(var(--sand-100-rgb), 0.04);
        }

        .ha-tr:not(:last-child) td {
          border-bottom: 1px solid rgba(var(--sand-100-rgb), 0.04);
        }

        .ha-td {
          padding: 7px 16px;
          transition: color 0.25s ease, background 0.25s ease;
        }

        .ha-dim       { color: rgba(var(--sand-100-rgb), 0.3);  }
        .ha-bright    { color: rgba(var(--sand-100-rgb), 0.6);  }
        .ha-sensitive { color: rgba(var(--sand-100-rgb), 0.5);  }

        .ha-flash {
          color: var(--warm-gold) !important;
          background: rgba(var(--warm-gold-rgb), 0.1);
        }

        .ha-masked {
          color: var(--warm-gold) !important;
          font-weight: 600;
        }

        /* Masking notice */
        .ha-notice {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-top: 1px solid rgba(var(--sand-100-rgb), 0.06);
          font-family: var(--sans);
          font-size: 11px;
          color: rgba(var(--warm-gold-rgb), 0.75);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .ha-notice-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ha-notice-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--warm-gold);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
