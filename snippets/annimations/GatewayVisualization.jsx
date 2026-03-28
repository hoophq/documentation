/**
 * GatewayVisualization — About page hero animation
 *
 * Data streams flow through the gateway, one lane at a time.
 * Raw data enters left, crosses the gateway line, exits masked on the right.
 * Larger text, higher contrast, slower pace — designed to be read.
 *
 * Fixed height: 420px.
 */

export const GatewayVisualization = () => {
  const STREAMS = [
    { protocol: 'PostgreSQL', raw: 'sarah.chen@acme.io', masked: '[EMAIL]' },
    { protocol: 'kubectl', raw: 'delete deploy/prod', masked: '\u26D4 blocked', blocked: true },
    { protocol: 'MySQL', raw: 'SSN 284-19-7653', masked: '[REDACTED]' },
    { protocol: 'SSH', raw: 'cat /etc/shadow', masked: '\u2713 logged' },
    { protocol: 'gRPC', raw: 'card 4532-7891', masked: '[PCI]' },
  ];

  const PHASE_TIMING = {
    enter: 0,
    travel: 900,
    cross: 1800,
    exit: 2600,
    fade: 3400,
  };
  const CYCLE_MS = 4200;
  const STAGGER = 600;

  function Lane({ stream, index, cycle }) {
    const [phase, setPhase] = useState('idle');

    useEffect(() => {
      const base = index * STAGGER;
      setPhase('idle');

      const timers = [
        setTimeout(() => setPhase('enter'), base + PHASE_TIMING.enter),
        setTimeout(() => setPhase('travel'), base + PHASE_TIMING.travel),
        setTimeout(() => setPhase('cross'), base + PHASE_TIMING.cross),
        setTimeout(() => setPhase('exit'), base + PHASE_TIMING.exit),
        setTimeout(() => setPhase('fade'), base + PHASE_TIMING.fade),
      ];
      return () => timers.forEach(clearTimeout);
    }, [cycle, index]);

    const showRaw = phase === 'enter' || phase === 'travel';
    const showFlash = phase === 'cross';
    const showMasked = phase === 'exit' || phase === 'fade';

    // Raw packet position
    const rawLeft = phase === 'enter' ? '2%' : '32%';
    // Masked packet position
    const maskedLeft = phase === 'exit' ? '56%' : '82%';

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 52,
        position: 'relative',
      }}>
        {/* Protocol label */}
        <div style={{
          width: 88,
          flexShrink: 0,
          fontFamily: 'var(--mono)',
          fontSize: 12,
          fontWeight: 500,
          color: phase !== 'idle' ? 'rgba(var(--sand-100-rgb),0.55)' : 'rgba(var(--sand-100-rgb),0.2)',
          textAlign: 'right',
          paddingRight: 20,
          transition: 'color 0.4s',
        }}>
          {stream.protocol}
        </div>

        {/* Wire */}
        <div style={{
          flex: 1,
          height: 1,
          background: 'rgba(var(--sand-100-rgb),0.06)',
          position: 'relative',
        }}>
          {/* Active wire glow */}
          {phase !== 'idle' && phase !== 'fade' && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: 1,
              background: 'rgba(var(--warm-gold-rgb),0.15)',
              transition: 'opacity 0.4s',
            }} />
          )}

          {/* Raw packet */}
          {showRaw && (
            <div style={{
              position: 'absolute',
              top: -15,
              left: rawLeft,
              transition: 'left 0.9s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s',
              opacity: phase === 'travel' ? 1 : 0.7,
            }}>
              <span style={{
                fontFamily: 'var(--mono)',
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(var(--sand-100-rgb),0.8)',
                whiteSpace: 'nowrap',
                background: 'rgba(var(--sand-100-rgb),0.06)',
                padding: '5px 14px',
                borderRadius: 6,
                border: '1px solid rgba(var(--sand-100-rgb),0.10)',
                display: 'inline-block',
              }}>
                {stream.raw}
              </span>
            </div>
          )}

          {/* Gateway flash */}
          {showFlash && (
            <div style={{
              position: 'absolute',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: stream.blocked
                ? 'rgba(var(--error-rgb),0.2)'
                : 'rgba(var(--warm-gold-rgb),0.15)',
              animation: 'gw-pulse 0.7s ease-out forwards',
            }} />
          )}

          {/* Masked packet */}
          {showMasked && (
            <div style={{
              position: 'absolute',
              top: -15,
              left: maskedLeft,
              transition: 'left 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s',
              opacity: phase === 'fade' ? 0 : 1,
            }}>
              <span style={{
                fontFamily: 'var(--mono)',
                fontSize: 13,
                fontWeight: 700,
                color: stream.blocked ? 'rgba(var(--error-rgb),0.9)' : 'var(--warm-gold)',
                whiteSpace: 'nowrap',
                background: stream.blocked
                  ? 'rgba(var(--error-rgb),0.10)'
                  : 'rgba(var(--warm-gold-rgb),0.10)',
                padding: '5px 14px',
                borderRadius: 6,
                border: stream.blocked
                  ? '1px solid rgba(var(--error-rgb),0.20)'
                  : '1px solid rgba(var(--warm-gold-rgb),0.18)',
                display: 'inline-block',
              }}>
                {stream.masked}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const [cycle, setCycle] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const interval = setInterval(() => {
      if (mounted.current) setCycle(c => c + 1);
    }, CYCLE_MS);
    return () => { mounted.current = false; clearInterval(interval); };
  }, []);

  return (
    <div style={{ height: 420, position: 'relative', overflow: 'hidden' }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(var(--sand-100-rgb),0.05) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />

      {/* Gateway center line */}
      <div style={{
        position: 'absolute',
        top: 32, bottom: 32,
        left: '50%',
        width: 1,
        background: 'linear-gradient(180deg, transparent 0%, rgba(var(--warm-gold-rgb),0.3) 20%, rgba(var(--warm-gold-rgb),0.3) 80%, transparent 100%)',
        transform: 'translateX(-50%)',
      }} />

      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 0 0 88px',
        height: 44,
        position: 'relative',
      }}>
        {/* Left label */}
        <div style={{
          position: 'absolute', left: 108, top: 14,
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: 'rgba(var(--sand-100-rgb),0.25)',
        }}>
          Raw
        </div>

        {/* Gateway badge */}
        <div style={{
          position: 'absolute',
          left: '50%', top: 8,
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(var(--warm-gold-rgb),0.08)',
          border: '1px solid rgba(var(--warm-gold-rgb),0.15)',
          padding: '5px 14px',
          borderRadius: 99,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--warm-gold)',
            boxShadow: '0 0 10px rgba(var(--warm-gold-rgb),0.5)',
            animation: 'gw-breathe 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
            color: 'var(--warm-gold)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Gateway
          </span>
        </div>

        {/* Right label */}
        <div style={{
          position: 'absolute', right: 16, top: 14,
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: 'rgba(var(--sand-100-rgb),0.25)',
        }}>
          Protected
        </div>
      </div>

      {/* Lanes */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        paddingTop: 12,
      }}>
        {STREAMS.map((s, i) => (
          <Lane key={`${s.protocol}-${cycle}`} stream={s} index={i} cycle={cycle} />
        ))}
      </div>

      {/* Bottom stats */}
      <div style={{
        position: 'absolute',
        bottom: 16, left: 88, right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
        borderTop: '1px solid rgba(var(--sand-100-rgb),0.06)',
        paddingTop: 14,
        marginRight: 16,
      }}>
        {[
          { n: '5', label: 'protocols' },
          { n: '<5ms', label: 'added latency' },
          { n: '100%', label: 'inspected' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
            <span style={{
              fontFamily: 'var(--display)', fontSize: 18, fontWeight: 700,
              color: 'rgba(var(--sand-100-rgb),0.55)',
              letterSpacing: '-0.02em',
            }}>{s.n}</span>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 11,
              color: 'rgba(var(--sand-100-rgb),0.25)',
            }}>{s.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes gw-pulse {
          0% { transform: translateX(-50%) scale(0.5); opacity: 1; }
          100% { transform: translateX(-50%) scale(2.5); opacity: 0; }
        }
        @keyframes gw-breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
