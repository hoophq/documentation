/**
 * HeroAnimation — Hero section animated visual
 *
 * Used in: app/page.jsx (Home hero, right column)
 *
 * Shows a live postgres session:
 *   1. Query types out character by character
 *   2. Data rows fade in staggered
 *   3. Sensitive columns flash on an accent bar
 *   4. Masking applied — SSN + email replaced, badge slides in
 *   5. Resets and loops
 *
 * Pure CSS keyframes + React state — no external animation library.
 * Colors are Hoop tokens on an ink field (Design MD skill).
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
        <div className="ha-toolbar">
          <span className="ha-wintitle">hoop — postgres:prod</span>
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
        /* Hoop tokens on an ink field: bg #F7F8FB text, bg at 70% for secondary,
           ink-deep #0A0F24 panels, accent-on-ink #94A9F5 for accent text. */
        .ha-root {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
        }

        .ha-mock {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: opacity 0.4s ease;
        }

        .ha-fadeout {
          opacity: 0;
        }

        .ha-toolbar {
          padding: 0 0 12px;
        }

        .ha-wintitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: rgba(247, 248, 251, 0.7);
        }

        /* Query bar */
        .ha-querybar {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #0A0F24;
          min-height: 46px;
        }

        .ha-prompt {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: #94A9F5;
          flex-shrink: 0;
        }

        .ha-querytext {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: #F7F8FB;
        }

        .ha-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: #F7F8FB;
          margin-left: 2px;
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
          padding-top: 8px;
        }

        .ha-table {
          display: table;
          width: 100% !important;
          max-width: none;
          margin: 0;
          border-collapse: collapse;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
        }

        .ha-th {
          text-align: left;
          padding: 10px 16px;
          color: rgba(247, 248, 251, 0.7);
          font-size: 13px;
          font-weight: 500;
          border-bottom: 1px solid rgba(247, 248, 251, 0.16);
        }

        .ha-tr:not(:last-child) td {
          border-bottom: 1px solid rgba(247, 248, 251, 0.1);
        }

        .ha-td {
          padding: 10px 16px;
          transition: color 0.25s ease, background 0.25s ease;
        }

        .ha-dim       { color: rgba(247, 248, 251, 0.7); }
        .ha-bright    { color: #F7F8FB; }
        .ha-sensitive { color: #F7F8FB; }

        .ha-flash {
          color: #FFFFFF !important;
          background: #3E63DD;
        }

        .ha-masked {
          color: #94A9F5 !important;
          font-weight: 600;
        }

        /* Masking notice, pinned to the bottom of the frame */
        .ha-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
          padding: 12px 16px 0;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #94A9F5;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .ha-notice-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ha-notice-dot {
          width: 8px;
          height: 8px;
          background: #3E63DD;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
