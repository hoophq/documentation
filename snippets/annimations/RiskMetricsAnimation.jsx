export const RiskMetricsAnimation = () => {
  const METRICS = [
    { label: 'Queries redacted',   target: 1247, color: 'var(--warm-gold)' },
    { label: 'Operations blocked', target: 38,   color: 'var(--warm-gold)' },
    { label: 'Sessions analyzed',  target: 8934, color: 'rgba(var(--sand-100-rgb),0.6)' },
    { label: 'Approval requests',  target: 156,  color: 'rgba(var(--sand-100-rgb),0.6)' },
  ];

  const COUNT_DURATION = 2000;
  const HOLD_DURATION  = 3000;
  const CYCLE_DURATION = COUNT_DURATION + HOLD_DURATION;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  const [values, setValues] = useState(METRICS.map(() => 0));
  const [cycle, setCycle]   = useState(0);
  const raf                 = useRef(null);
  const timers              = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (raf.current) cancelAnimationFrame(raf.current);

    setValues(METRICS.map(() => 0));

    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / COUNT_DURATION, 1);
      const eased = easeOutCubic(progress);

      setValues(METRICS.map((m) => Math.round(eased * m.target)));

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    }

    raf.current = requestAnimationFrame(tick);

    const resetId = setTimeout(() => setCycle((c) => c + 1), CYCLE_DURATION);
    timers.current.push(resetId);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
    };
  }, [cycle]);

  const styles = {
    root: { position: 'relative', width: '100%' },
    mock: {
      borderRadius: 12, overflow: 'hidden',
      border: '1px solid rgba(var(--sand-100-rgb),0.08)',
      background: 'linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 60%, var(--gradient-dark-end) 100%)',
    },
    toolbar: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 16px', borderBottom: '1px solid rgba(var(--sand-100-rgb),0.06)',
    },
    dots: { display: 'flex', gap: 6 },
    dot: { width: 8, height: 8, borderRadius: '50%', background: 'rgba(var(--sand-100-rgb),0.10)' },
    title: { fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(var(--sand-100-rgb),0.2)' },
    grid: {
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 1, background: 'rgba(var(--sand-100-rgb),0.04)',
    },
    card: {
      padding: 20, display: 'flex', flexDirection: 'column',
      gap: 4, background: 'rgba(var(--sand-100-rgb),0.02)',
    },
    value: { fontFamily: 'var(--display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 },
    label: { fontFamily: 'var(--sans)', fontSize: 11, color: 'rgba(var(--sand-100-rgb),0.3)', marginBottom: 8 },
    barTrack: { height: 3, background: 'rgba(var(--sand-100-rgb),0.06)', borderRadius: 2, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 2, transition: 'width 0.1s linear', opacity: 0.6 },
    status: {
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '10px 16px', borderTop: '1px solid rgba(var(--sand-100-rgb),0.06)',
      fontFamily: 'var(--sans)', fontSize: 11, color: 'rgba(var(--sand-100-rgb),0.25)',
    },
    statusDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--warm-gold)' },
  };

  return (
    <div style={styles.root} aria-hidden="true">
      <div style={styles.mock}>
        <div style={styles.toolbar}>
          <div style={styles.dots}>
            <div style={styles.dot} />
            <div style={styles.dot} />
            <div style={styles.dot} />
          </div>
          <span style={styles.title}>hoop · risk dashboard</span>
          <span style={{ width: 48 }} />
        </div>

        <div style={styles.grid}>
          {METRICS.map((m, i) => (
            <div key={m.label} style={styles.card}>
              <span style={{ ...styles.value, color: m.color }}>
                {values[i].toLocaleString()}
              </span>
              <span style={styles.label}>{m.label}</span>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${(values[i] / m.target) * 100}%`,
                    background: m.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={styles.status}>
          <span style={styles.statusDot} />
          <span>Live · last 30 days</span>
        </div>
      </div>
    </div>
  );
}
