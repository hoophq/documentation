/**
 * OrgImpactDashboard — Executive-level org impact metrics
 *
 * Shows what Hoop delivers at scale: PII fields masked, commands blocked,
 * sessions audited, risk reduction. Animated counters + trend bars.
 *
 * Targets VP/C-level audience. No code, no terminals — just business outcomes.
 *
 * Fixed height: 480px. Dark theme.
 */

export const OrgImpactDashboard = () => {
  const METRICS = [
    { label: 'PII Fields Masked', value: 47293, unit: '', prefix: '', color: 'var(--warm-gold)' },
    { label: 'Destructive Commands Blocked', value: 842, unit: '', prefix: '', color: 'rgba(var(--error-rgb),0.85)' },
    { label: 'Sessions Audited', value: 12847, unit: '', prefix: '', color: 'var(--sand-100)' },
    { label: 'Compliance Score', value: 94, unit: '%', prefix: '', color: 'var(--success)' },
  ];

  const RISK_CATEGORIES = [
    { label: 'PII Exposure', before: 87, after: 3 },
    { label: 'Unaudited Sessions', before: 64, after: 0 },
    { label: 'Ungoverned AI Access', before: 92, after: 8 },
    { label: 'Compliance Gaps', before: 48, after: 6 },
  ];

  const TIMELINE = [
    { month: 'Sep', value: 12 },
    { month: 'Oct', value: 28 },
    { month: 'Nov', value: 51 },
    { month: 'Dec', value: 67 },
    { month: 'Jan', value: 79 },
    { month: 'Feb', value: 88 },
    { month: 'Mar', value: 94 },
  ];

  function AnimatedCounter({ target, active, duration = 1500 }) {
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const start = useRef(0);

    useEffect(() => {
      if (!active) { setValue(0); return; }
      start.current = performance.now();

      function tick(now) {
        const elapsed = now - start.current;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) ref.current = requestAnimationFrame(tick);
      }

      ref.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(ref.current);
    }, [target, active, duration]);

    return value.toLocaleString();
  }

  const [active, setActive] = useState(false);
  const [showRisk, setShowRisk] = useState(false);
  const mounted = useRef(true);
  const timer = useRef(null);

  useEffect(() => {
    mounted.current = true;

    function cycle() {
      if (!mounted.current) return;
      setActive(false);
      setShowRisk(false);

      timer.current = setTimeout(() => {
        if (!mounted.current) return;
        setActive(true);

        timer.current = setTimeout(() => {
          if (!mounted.current) return;
          setShowRisk(true);

          timer.current = setTimeout(() => {
            if (mounted.current) cycle();
          }, 5000);
        }, 2000);
      }, 600);
    }

    cycle();
    return () => { mounted.current = false; clearTimeout(timer.current); };
  }, []);

  const maxTimeline = Math.max(...TIMELINE.map(t => t.value));

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
            <rect x="1" y="7" width="3" height="8" rx="1" fill="rgba(var(--sand-100-rgb),0.2)"/>
            <rect x="6.5" y="4" width="3" height="11" rx="1" fill="rgba(var(--sand-100-rgb),0.3)"/>
            <rect x="12" y="1" width="3" height="14" rx="1" fill="rgba(var(--sand-100-rgb),0.4)"/>
          </svg>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
            color: 'var(--sand-100)',
          }}>
            Organizational Impact
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 500,
          color: 'rgba(var(--sand-100-rgb),0.3)',
          background: 'rgba(var(--sand-100-rgb),0.04)',
          padding: '4px 10px', borderRadius: 4,
        }}>
          Last 30 days
        </span>
      </div>

      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden' }}>
        {/* Big metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {METRICS.map((m, i) => (
            <div key={m.label} style={{
              background: 'rgba(var(--sand-100-rgb),0.03)',
              border: '1px solid rgba(var(--sand-100-rgb),0.06)',
              borderRadius: 8,
              padding: '14px 14px 12px',
            }}>
              <span style={{
                fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800,
                color: m.color,
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1,
                transition: 'opacity 0.5s',
                transitionDelay: `${i * 0.15}s`,
                opacity: active ? 1 : 0.2,
              }}>
                {m.prefix}<AnimatedCounter target={m.value} active={active} duration={1500 + i * 200} />{m.unit}
              </span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 500,
                color: 'rgba(var(--sand-100-rgb),0.35)',
                display: 'block', marginTop: 6,
                lineHeight: 1.3,
              }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Two columns: Risk reduction + Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
          {/* Risk reduction bars */}
          <div style={{
            background: 'rgba(var(--sand-100-rgb),0.03)',
            border: '1px solid rgba(var(--sand-100-rgb),0.06)',
            borderRadius: 8,
            padding: '16px 16px 12px',
          }}>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
              color: 'rgba(var(--sand-100-rgb),0.4)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              display: 'block', marginBottom: 14,
            }}>
              Risk Reduction
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RISK_CATEGORIES.map((cat, i) => {
                const val = showRisk ? cat.after : cat.before;
                const isReduced = showRisk && cat.after < 10;
                return (
                  <div key={cat.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{
                        fontFamily: 'var(--sans)', fontSize: 11,
                        color: 'rgba(var(--sand-100-rgb),0.55)',
                      }}>{cat.label}</span>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
                        color: isReduced ? 'var(--success)' : 'rgba(var(--sand-100-rgb),0.6)',
                        transition: 'color 0.5s',
                        transitionDelay: `${i * 0.15}s`,
                      }}>{val}%</span>
                    </div>
                    <div style={{
                      height: 4, borderRadius: 2,
                      background: 'rgba(var(--sand-100-rgb),0.06)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: 2,
                        width: `${val}%`,
                        background: isReduced
                          ? 'var(--success)'
                          : val > 70 ? 'rgba(var(--error-rgb),0.7)' : 'var(--warm-gold)',
                        transition: 'width 1s ease-out, background 0.5s',
                        transitionDelay: `${i * 0.15}s`,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compliance timeline */}
          <div style={{
            background: 'rgba(var(--sand-100-rgb),0.03)',
            border: '1px solid rgba(var(--sand-100-rgb),0.06)',
            borderRadius: 8,
            padding: '16px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
              color: 'rgba(var(--sand-100-rgb),0.4)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              display: 'block', marginBottom: 14,
            }}>
              Compliance Trend
            </span>

            <div style={{
              flex: 1, display: 'flex',
              alignItems: 'flex-end', justifyContent: 'space-between',
              gap: 6,
              paddingBottom: 20,
              position: 'relative',
            }}>
              {/* Target line */}
              <div style={{
                position: 'absolute',
                left: 0, right: 0,
                bottom: `${(90 / maxTimeline) * 100 * 0.7 + 20}px`,
                height: 1,
                borderTop: '1px dashed rgba(var(--success-rgb),0.2)',
              }}>
                <span style={{
                  position: 'absolute', right: 0, top: -14,
                  fontFamily: 'var(--mono)', fontSize: 9,
                  color: 'rgba(var(--success-rgb),0.4)',
                }}>90% target</span>
              </div>

              {TIMELINE.map((t, i) => {
                const heightPct = (t.value / maxTimeline) * 70;
                const meetsTarget = t.value >= 90;
                return (
                  <div key={t.month} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <div style={{
                      width: '100%',
                      maxWidth: 28,
                      height: `${heightPct}%`,
                      minHeight: 8,
                      borderRadius: 4,
                      background: active
                        ? (meetsTarget ? 'var(--success)' : 'var(--warm-gold)')
                        : 'rgba(var(--sand-100-rgb),0.06)',
                      transition: 'height 1s ease-out, background 0.5s',
                      transitionDelay: `${i * 0.1}s`,
                      opacity: active ? (0.4 + (i / TIMELINE.length) * 0.6) : 0.3,
                    }} />
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 9,
                      color: 'rgba(var(--sand-100-rgb),0.25)',
                      position: 'absolute',
                      bottom: 4,
                    }}>
                      {t.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Month labels row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              paddingTop: 4,
              borderTop: '1px solid rgba(var(--sand-100-rgb),0.04)',
            }}>
              {TIMELINE.map(t => (
                <span key={t.month} style={{
                  fontFamily: 'var(--mono)', fontSize: 9, flex: 1, textAlign: 'center',
                  color: 'rgba(var(--sand-100-rgb),0.25)',
                }}>{t.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
