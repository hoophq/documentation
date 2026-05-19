/**
 * OpenSourceFlow — Animated visualization of the open-source gateway architecture
 *
 * Shows the protocol flow through the open-source gateway:
 *   1. Protocols arrive (Postgres, MySQL, SSH, K8s, HTTP)
 *   2. Pass through the open-source gateway (inspectable, auditable)
 *   3. Controls apply (mask, block, approve, log)
 *   4. Traffic exits to infrastructure
 *
 * Dark background, warm gold accents. Designed for README and landing page.
 */

export const OpenSourceFlow = () => {
  const PROTOCOLS = [
    { name: 'PostgreSQL', icon: 'db' },
    { name: 'MySQL', icon: 'db' },
    { name: 'SSH', icon: 'term' },
    { name: 'Kubernetes', icon: 'k8s' },
    { name: 'HTTP/gRPC', icon: 'http' },
  ];

  const CONTROLS = [
    { label: 'Mask PII', color: 'var(--warm-gold)' },
    { label: 'Block DDL', color: 'var(--error)' },
    { label: 'Approve', color: 'var(--warm-gold)' },
    { label: 'Record', color: 'rgba(var(--sand-100-rgb),0.5)' },
    { label: 'Analyze', color: 'var(--warm-gold)' },
  ];

  const CONTRIBUTORS = [
    { initials: 'JC', delay: 0 },
    { initials: 'MR', delay: 200 },
    { initials: 'AK', delay: 400 },
    { initials: 'SP', delay: 600 },
    { initials: 'LW', delay: 800 },
    { initials: '+', delay: 1000 },
  ];

  function useGitHubStats() {
    const [stats, setStats] = useState({ stars: 619, forks: 40 });

    useEffect(() => {
      const KEY = 'hoop_gh_stats';
      const TTL = 1000 * 60 * 30;
      try {
        const c = sessionStorage.getItem(KEY);
        if (c) { const d = JSON.parse(c); if (Date.now() - d.ts < TTL) { setStats({ stars: d.stars, forks: d.forks }); return; } }
      } catch {}
      fetch('https://api.github.com/repos/hoophq/hoop')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.stargazers_count) {
            const s = { stars: data.stargazers_count, forks: data.forks_count || 40 };
            setStats(s);
            try { sessionStorage.setItem(KEY, JSON.stringify({ ...s, ts: Date.now() })); } catch {}
          }
        })
        .catch(() => {});
    }, []);

    return stats;
  }

  const [activeProtocol, setActiveProtocol] = useState(0);
  const [activeControl, setActiveControl] = useState(-1);
  const [gatewayPulse, setGatewayPulse] = useState(false);
  const [showContribs, setShowContribs] = useState(false);
  const timers = useRef([]);
  const gh = useGitHubStats();

  function T(fn, ms) { const id = setTimeout(fn, ms); timers.current.push(id); }

  useEffect(() => {
    let cancelled = false;
    let cycle = 0;

    function run() {
      if (cancelled) return;
      timers.current.forEach(clearTimeout);
      timers.current = [];

      const p = cycle % PROTOCOLS.length;
      setActiveProtocol(p);
      setActiveControl(-1);
      setGatewayPulse(false);
      setShowContribs(false);

      // Protocol highlights
      T(() => { if (!cancelled) setGatewayPulse(true); }, 600);

      // Controls light up staggered
      CONTROLS.forEach((_, i) => {
        T(() => { if (!cancelled) setActiveControl(i); }, 1000 + i * 400);
      });

      // Show contributors
      T(() => { if (!cancelled) setShowContribs(true); }, 2800);

      // Reset
      T(() => {
        if (!cancelled) {
          cycle++;
          run();
        }
      }, 4500);
    }

    run();
    return () => { cancelled = true; timers.current.forEach(clearTimeout); };
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-mid) 35%, var(--gradient-dark-end) 70%, var(--bronze) 100%)',
      borderRadius: 14, padding: '32px 28px 24px', position: 'relative', overflow: 'hidden',
      height: 440,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-30%', right: '-10%', width: '60%', height: '160%',
        background: 'radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--warm-gold)' }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor"/>
          </svg>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--sand-100)' }}>
            Open Source Gateway
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="var(--warm-gold)">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
          </svg>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
            color: 'var(--warm-gold)',
          }}>{gh.stars < 1000 ? '1K' : gh.stars < 2500 ? '2.5K' : gh.stars < 5000 ? '5K' : '10K'}</span>
          <span style={{
            fontSize: 10, fontWeight: 500, color: 'rgba(var(--sand-100-rgb),0.25)',
          }}>stars goal</span>
        </div>
      </div>

      {/* 3-column flow: Protocols → Gateway → Controls */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        gap: 16, alignItems: 'center', position: 'relative', zIndex: 1, minHeight: 200,
      }}>
        {/* Left: Protocols */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500,
            color: 'rgba(var(--sand-100-rgb),0.20)', textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: 6, paddingLeft: 2,
          }}>Wire protocols</span>
          {PROTOCOLS.map((p, i) => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 6,
              background: i === activeProtocol ? 'rgba(var(--warm-gold-rgb),0.08)' : 'rgba(var(--sand-100-rgb),0.03)',
              border: `1px solid ${i === activeProtocol ? 'rgba(var(--warm-gold-rgb),0.20)' : 'rgba(var(--sand-100-rgb),0.06)'}`,
              transition: 'all 0.4s ease',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === activeProtocol ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.15)',
                transition: 'all 0.4s ease',
              }}/>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                color: i === activeProtocol ? 'var(--sand-100)' : 'rgba(var(--sand-100-rgb),0.35)',
                fontWeight: i === activeProtocol ? 500 : 400,
                transition: 'all 0.4s ease',
              }}>{p.name}</span>
            </div>
          ))}
        </div>

        {/* Center: Gateway */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          {/* Arrows in */}
          <div style={{
            width: 1, height: 24,
            background: gatewayPulse
              ? 'linear-gradient(to bottom, transparent, var(--warm-gold))'
              : 'rgba(var(--sand-100-rgb),0.08)',
            transition: 'background 0.4s ease',
          }}/>

          {/* Gateway box */}
          <div style={{
            width: 80, height: 80, borderRadius: 14,
            background: gatewayPulse ? 'rgba(var(--warm-gold-rgb),0.10)' : 'rgba(var(--sand-100-rgb),0.04)',
            border: `1.5px solid ${gatewayPulse ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.10)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            transition: 'all 0.4s ease',
            boxShadow: gatewayPulse ? '0 0 24px rgba(var(--warm-gold-rgb),0.15)' : 'none',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 5.5V10C3 14.5 6 17.5 10 19C14 17.5 17 14.5 17 10V5.5L10 2Z"
                fill={gatewayPulse ? 'rgba(var(--warm-gold-rgb),0.20)' : 'rgba(var(--sand-100-rgb),0.05)'}
                stroke={gatewayPulse ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.20)'} strokeWidth="1.2"/>
            </svg>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 600,
              color: gatewayPulse ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.25)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              transition: 'color 0.4s ease',
            }}>Gateway</span>
          </div>

          {/* Arrows out */}
          <div style={{
            width: 1, height: 24,
            background: gatewayPulse
              ? 'linear-gradient(to bottom, var(--warm-gold), transparent)'
              : 'rgba(var(--sand-100-rgb),0.08)',
            transition: 'background 0.4s ease',
          }}/>
        </div>

        {/* Right: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500,
            color: 'rgba(var(--sand-100-rgb),0.20)', textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: 6, paddingLeft: 2,
          }}>Active controls</span>
          {CONTROLS.map((c, i) => {
            const active = i <= activeControl;
            return (
              <div key={c.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 6,
                background: active ? 'rgba(var(--sand-100-rgb),0.04)' : 'transparent',
                border: `1px solid ${active ? 'rgba(var(--sand-100-rgb),0.08)' : 'transparent'}`,
                transition: 'all 0.35s ease',
                opacity: active ? 1 : 0.25,
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? 'rgba(var(--warm-gold-rgb),0.12)' : 'rgba(var(--sand-100-rgb),0.04)',
                  transition: 'all 0.35s ease',
                }}>
                  {active && (
                    <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke={c.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
                  color: active ? 'var(--sand-100)' : 'rgba(var(--sand-100-rgb),0.30)',
                  transition: 'all 0.35s ease',
                }}>{c.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Contributors + stats */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 20, paddingTop: 16,
        borderTop: '1px solid rgba(var(--sand-100-rgb),0.06)',
        position: 'relative', zIndex: 1,
        opacity: showContribs ? 1 : 0,
        transform: showContribs ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        {/* Contributors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
            color: 'rgba(var(--sand-100-rgb),0.25)', marginRight: 4,
          }}>Contributors</span>
          <div style={{ display: 'flex' }}>
            {CONTRIBUTORS.map((c, i) => (
              <div key={i} style={{
                width: 24, height: 24, borderRadius: '50%',
                background: c.initials === '+' ? 'rgba(var(--sand-100-rgb),0.06)' : 'rgba(var(--warm-gold-rgb),0.12)',
                border: '2px solid rgba(var(--espresso-rgb),0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 600,
                color: c.initials === '+' ? 'rgba(var(--sand-100-rgb),0.30)' : 'var(--warm-gold)',
                marginLeft: i === 0 ? 0 : -6,
                zIndex: CONTRIBUTORS.length - i,
              }}>{c.initials}</div>
            ))}
          </div>
        </div>

        {/* Stats with goals */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {/* Stars progress */}
          {(() => {
            const goal = gh.stars < 1000 ? 1000 : gh.stars < 2500 ? 2500 : gh.stars < 5000 ? 5000 : 10000;
            const goalLabel = goal >= 1000 ? `${goal / 1000}K` : goal;
            const pct = Math.min((gh.stars / goal) * 100, 100);
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 90 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--sand-100)' }}>{gh.stars.toLocaleString()}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: 'rgba(var(--sand-100-rgb),0.20)' }}>/ {goalLabel} goal</span>
                </div>
                <div style={{ height: 3, background: 'rgba(var(--sand-100-rgb),0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--warm-gold)', borderRadius: 2, opacity: 0.7 }}/>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: 'rgba(var(--sand-100-rgb),0.20)' }}>Stars</span>
              </div>
            );
          })()}

          {/* Forks */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--sand-100)' }}>{gh.forks}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: 'rgba(var(--sand-100-rgb),0.20)' }}>Forks</div>
          </div>

          {/* License */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--warm-gold)' }}>MIT</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: 'rgba(var(--sand-100-rgb),0.20)' }}>License</div>
          </div>
        </div>
      </div>
    </div>
  );
}
