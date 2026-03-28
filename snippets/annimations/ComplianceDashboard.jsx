/**
 * ComplianceDashboard — Enterprise compliance posture animation
 *
 * Before/after visualization: compliance gaps → resolved by Hoop.
 * Targets C-level / VP audience who think in frameworks, not code.
 *
 * Phase 1 (before): Low score, gaps in controls, action items
 * Phase 2 (after):  Score rises, controls flip to passing, gaps close
 *
 * Fixed height: 480px. Dark theme (lives in mood-dark or dark wrapper).
 */

export const ComplianceDashboard = () => {
  const FRAMEWORKS = ['SOC 2', 'GDPR', 'PCI DSS', 'HIPAA'];

  const CONTROLS = [
    { id: 'CC6.1', label: 'Logical Access Security', category: 'Access Control', before: true, after: true },
    { id: 'CC6.3', label: 'Data-in-Transit Encryption', category: 'Data Protection', before: true, after: true },
    { id: 'CC6.6', label: 'Session-Level Access Controls', category: 'Access Control', before: false, after: true },
    { id: 'CC6.7', label: 'Data Masking & Redaction', category: 'Data Protection', before: false, after: true },
    { id: 'CC7.2', label: 'Anomaly Detection & Monitoring', category: 'Monitoring', before: false, after: true },
    { id: 'CC8.1', label: 'Audit Trail & Evidence', category: 'Audit Trail', before: false, after: true },
  ];

  const CATEGORIES = [
    { label: 'Identity', before: '3/4', after: '4/4', beforePct: 75, afterPct: 100 },
    { label: 'Audit Trail', before: '3/6', after: '6/6', beforePct: 50, afterPct: 100 },
    { label: 'Access Control', before: '2/6', after: '5/6', beforePct: 33, afterPct: 83 },
    { label: 'Data Protection', before: '2/6', after: '6/6', beforePct: 33, afterPct: 100 },
    { label: 'Monitoring', before: '3/5', after: '5/5', beforePct: 60, afterPct: 100 },
  ];

  const BEFORE_SCORE = 52;
  const AFTER_SCORE = 94;

  function AnimatedScore({ target, active }) {
    const [value, setValue] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
      if (!active) { setValue(0); return; }
      let current = 0;
      const step = target / 40;
      ref.current = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(ref.current);
        }
        setValue(Math.round(current));
      }, 30);
      return () => clearInterval(ref.current);
    }, [target, active]);

    return value;
  }

  const [isAfter, setIsAfter] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timer = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    function cycle() {
      if (!mounted.current) return;
      // Show "before" for 4s, then flip to "after" for 5s, then reset
      setIsAfter(false);
      setAnimating(true);

      timer.current = setTimeout(() => {
        if (!mounted.current) return;
        setIsAfter(true);

        timer.current = setTimeout(() => {
          if (!mounted.current) return;
          cycle();
        }, 5500);
      }, 3500);
    }

    cycle();
    return () => { mounted.current = false; clearTimeout(timer.current); };
  }, []);

  const score = isAfter ? AFTER_SCORE : BEFORE_SCORE;
  const scoreColor = isAfter ? 'var(--success)' : 'var(--warm-gold)';
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div style={{
      height: 480,
      background: 'rgba(var(--sand-100-rgb),0.03)',
      border: '1px solid rgba(var(--sand-100-rgb),0.06)',
      borderRadius: 14,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '1px solid rgba(var(--sand-100-rgb),0.06)',
        background: 'rgba(var(--sand-100-rgb),0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="14" height="14" rx="3" stroke="rgba(var(--sand-100-rgb),0.3)" strokeWidth="1.2"/>
            <path d="M4.5 8.5L7 11L11.5 5.5" stroke={scoreColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
            color: 'var(--sand-100)',
          }}>
            Compliance Report
          </span>
        </div>

        {/* Before/After toggle */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(var(--sand-100-rgb),0.04)',
          borderRadius: 6, overflow: 'hidden',
          border: '1px solid rgba(var(--sand-100-rgb),0.06)',
        }}>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
            padding: '5px 12px',
            color: !isAfter ? 'var(--sand-100)' : 'rgba(var(--sand-100-rgb),0.3)',
            background: !isAfter ? 'rgba(var(--sand-100-rgb),0.08)' : 'transparent',
            transition: 'all 0.3s',
          }}>
            Before
          </span>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
            padding: '5px 12px',
            color: isAfter ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.3)',
            background: isAfter ? 'rgba(var(--warm-gold-rgb),0.08)' : 'transparent',
            transition: 'all 0.3s',
          }}>
            With Hoop
          </span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden' }}>
        {/* Top row: Score ring + category cards */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Score ring */}
          <div style={{ flexShrink: 0, textAlign: 'center', width: 120 }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(var(--sand-100-rgb),0.06)" strokeWidth="6"/>
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1.2s ease-out, stroke 0.5s' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--display)', fontSize: 28, fontWeight: 800,
                  color: 'var(--sand-100)', letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}>
                  <AnimatedScore target={score} active={animating} />
                </span>
                <span style={{
                  fontFamily: 'var(--sans)', fontSize: 9,
                  color: 'rgba(var(--sand-100-rgb),0.3)',
                }}>/ 100</span>
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 10,
              color: isAfter ? 'rgba(var(--success-rgb),0.7)' : 'rgba(var(--warm-gold-rgb),0.7)',
              fontWeight: 600,
              display: 'block', marginTop: 8,
              transition: 'color 0.5s',
            }}>
              {isAfter ? 'HIGH COMPLIANT' : 'GAPS DETECTED'}
            </span>
          </div>

          {/* Category cards grid */}
          <div style={{
            flex: 1, display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}>
            {CATEGORIES.map((cat) => {
              const val = isAfter ? cat.after : cat.before;
              const pct = isAfter ? cat.afterPct : cat.beforePct;
              const isFull = pct === 100;
              return (
                <div key={cat.label} style={{
                  background: 'rgba(var(--sand-100-rgb),0.03)',
                  border: '1px solid rgba(var(--sand-100-rgb),0.06)',
                  borderRadius: 8,
                  padding: '10px 12px',
                }}>
                  <span style={{
                    fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 500,
                    color: 'rgba(var(--sand-100-rgb),0.4)',
                    display: 'block', marginBottom: 6,
                  }}>{cat.label}</span>
                  <span style={{
                    fontFamily: 'var(--display)', fontSize: 18, fontWeight: 700,
                    color: isFull && isAfter ? 'rgba(var(--success-rgb),0.9)' : 'var(--sand-100)',
                    transition: 'color 0.5s',
                  }}>{val}</span>
                  {/* Mini bar */}
                  <div style={{
                    height: 2, borderRadius: 1, marginTop: 8,
                    background: 'rgba(var(--sand-100-rgb),0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 1,
                      width: `${pct}%`,
                      background: isFull && isAfter ? 'var(--success)' : 'var(--warm-gold)',
                      transition: 'width 1s ease-out, background 0.5s',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Framework tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(var(--sand-100-rgb),0.06)' }}>
          {FRAMEWORKS.map((fw, i) => (
            <span key={fw} style={{
              fontFamily: 'var(--sans)', fontSize: 11, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? 'var(--sand-100)' : 'rgba(var(--sand-100-rgb),0.3)',
              padding: '8px 16px',
              borderBottom: i === 0 ? '2px solid var(--warm-gold)' : '2px solid transparent',
            }}>
              {fw}
            </span>
          ))}
        </div>

        {/* Controls list */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {CONTROLS.map((ctrl, i) => {
            const passing = isAfter ? ctrl.after : ctrl.before;
            const wasGap = !ctrl.before && ctrl.after;
            return (
              <div key={ctrl.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 0',
                borderBottom: i < CONTROLS.length - 1 ? '1px solid rgba(var(--sand-100-rgb),0.04)' : 'none',
              }}>
                {/* Status icon */}
                <div style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: passing
                    ? 'rgba(var(--success-rgb),0.12)'
                    : 'rgba(var(--error-rgb),0.10)',
                  transition: 'background 0.5s',
                  transitionDelay: `${i * 0.1}s`,
                }}>
                  {passing ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5L5 9L9.5 3.5" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="rgba(var(--error-rgb),0.7)" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>

                {/* Control ID badge */}
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
                  color: 'rgba(var(--sand-100-rgb),0.35)',
                  background: 'rgba(var(--sand-100-rgb),0.04)',
                  padding: '2px 8px', borderRadius: 4,
                  flexShrink: 0,
                }}>{ctrl.id}</span>

                {/* Label */}
                <span style={{
                  fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 400,
                  color: passing ? 'rgba(var(--sand-100-rgb),0.7)' : 'rgba(var(--sand-100-rgb),0.4)',
                  transition: 'color 0.5s',
                  transitionDelay: `${i * 0.1}s`,
                  flex: 1,
                }}>{ctrl.label}</span>

                {/* Category tag */}
                <span style={{
                  fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 600,
                  color: wasGap && isAfter ? 'rgba(var(--success-rgb),0.7)' : 'rgba(var(--sand-100-rgb),0.25)',
                  background: wasGap && isAfter ? 'rgba(var(--success-rgb),0.08)' : 'rgba(var(--sand-100-rgb),0.04)',
                  padding: '2px 8px', borderRadius: 99,
                  transition: 'all 0.5s',
                  transitionDelay: `${i * 0.1}s`,
                  flexShrink: 0,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {wasGap && isAfter ? 'Resolved' : ctrl.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
