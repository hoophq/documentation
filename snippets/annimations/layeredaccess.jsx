export const LayeredAccess = () => {
  const TOTAL = 7;
  const CX = 230, CY = 250, VB_W = 820, VB_H = 500;
  const OUTER_R = 200, INNER_R = 30, GAP = 3;

  const COLORS = [
    { s: 'var(--warm-gold)', f: 'rgba(var(--warm-gold-rgb),0.06)', g: 'rgba(var(--warm-gold-rgb),0.14)' },
    { s: '#C49558', f: 'rgba(196,149,88,0.05)',  g: 'rgba(196,149,88,0.12)' },
    { s: '#B08348', f: 'rgba(176,131,72,0.05)',  g: 'rgba(176,131,72,0.12)' },
    { s: 'var(--bronze)', f: 'rgba(var(--bronze-rgb),0.05)',   g: 'rgba(var(--bronze-rgb),0.12)' },
    { s: '#7A5030', f: 'rgba(122,80,48,0.05)',   g: 'rgba(122,80,48,0.10)' },
    { s: 'var(--bronze-dark)', f: 'rgba(var(--bronze-dark-rgb),0.06)',   g: 'rgba(var(--bronze-dark-rgb),0.12)' },
    { s: 'var(--sand-500)', f: 'rgba(var(--sand-500-rgb),0.05)', g: 'rgba(var(--sand-500-rgb),0.12)' },
  ];

  const LAYERS = [
    { title: 'Read + Masking',    desc: 'Sensitive fields hidden. No approval needed.' },
    { title: 'Read Unmasked',     desc: 'Raw data, peer approval, time-bounded.' },
    { title: 'Sensitive Read',    desc: 'Justification + full audit trail.' },
    { title: 'Standard Write',    desc: 'Leader approval, guardrails active.' },
    { title: 'Sensitive Write',   desc: 'AI risk analysis on every query.' },
    { title: 'Structural Change', desc: 'Only pre-approved CI/CD actions.' },
    { title: 'Runbook Only',      desc: 'No manual sessions. Automation only.' },
  ];

  const GATES = [
    { id: 'masking',   name: 'AI Data Masking',       tag: 'Automatic',  at: 0 },
    { id: 'jit',       name: 'Just-in-time sessions', tag: 'Time-bound', at: 1 },
    { id: 'peer',      name: 'Peer approval',         tag: 'Required',   at: 1 },
    { id: 'justify',   name: 'Written justification', tag: 'Mandatory',  at: 2 },
    { id: 'leader',    name: 'Leader / DBA approval', tag: 'Multi-step', at: 3 },
    { id: 'guardrail', name: 'Query guardrails',      tag: 'Active',     at: 3 },
    { id: 'ai',        name: 'AI session analysis',   tag: 'Scanning',   at: 4 },
    { id: 'runbook',   name: 'Runbook-only mode',     tag: 'Enforced',   at: 6 },
  ];

  const ICONS = {
    masking: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    ),
    jit: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    peer: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    justify: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    leader: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    guardrail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    ai: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    runbook: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  };

  function ringRadius(i) {
    return OUTER_R - i * ((OUTER_R - INNER_R) / TOTAL);
  }

  // Pre-compute label Y positions
  const LABEL_X = 520;
  const LABEL_DOT_X = 508;
  const labelsTop = CY - OUTER_R + 20;
  const labelsBot = CY + OUTER_R - 20;
  const labelYs = Array.from({ length: TOTAL }, (_, i) =>
    labelsTop + i * ((labelsBot - labelsTop) / (TOTAL - 1))
  );

  const [currentLayer, setCurrentLayer] = useState(0);
  const [prevLayer, setPrevLayer] = useState(-1);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setCurrentLayer((prev) => {
      setPrevLayer(prev);
      return index;
    });
  }, []);

  const resetAuto = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentLayer((prev) => {
        setPrevLayer(prev);
        return (prev + 1) % TOTAL;
      });
    }, 4000);
  }, []);

  useEffect(() => {
    resetAuto();
    return () => clearInterval(timerRef.current);
  }, [resetAuto]);

  const handlePipClick = (i) => {
    goTo(i);
    resetAuto();
  };

  const handleRingClick = (i) => {
    goTo(i);
    resetAuto();
  };

  const trans = { transition: 'all 0.45s ease' };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: 48,
          alignItems: 'center',
        }}
        className="layered-access-grid"
      >
        {/* ── LEFT: cumulative feature list ── */}
        <div style={{ maxWidth: 280, width: '100%' }}>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--warm-gold)',
              marginBottom: 20,
            }}
          >
            Active controls
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {GATES.map((gate) => {
              const on = gate.at <= currentLayer;
              return (
                <div
                  key={gate.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 0',
                    borderBottom: '1px solid rgba(var(--sand-100-rgb),0.06)',
                    ...trans,
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: 'rgba(var(--warm-gold-rgb),0.08)',
                      color: 'var(--warm-gold)',
                      opacity: on ? 1 : 0.15,
                      ...trans,
                    }}
                  >
                    <div style={{ width: 15, height: 15 }}>{ICONS[gate.id]}</div>
                  </div>
                  {/* Name */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'var(--sans)',
                      color: on ? 'var(--sand-100)' : 'var(--sand-500)',
                      opacity: on ? 1 : 0.15,
                      ...trans,
                    }}
                  >
                    {gate.name}
                  </span>
                  {/* Tag */}
                  <span
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 100,
                      whiteSpace: 'nowrap',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      background: on ? 'rgba(var(--warm-gold-rgb),0.08)' : 'rgba(var(--sand-100-rgb),0.03)',
                      color: on ? 'var(--warm-gold)' : 'var(--sand-500)',
                      opacity: on ? 1 : 0.15,
                      ...trans,
                    }}
                  >
                    {gate.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: SVG diagram + pips ── */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 820,
              margin: '0 auto',
              aspectRatio: '820 / 500',
            }}
          >
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
              {/* Glow filters */}
              <defs>
                {COLORS.map((_, i) => (
                  <filter
                    key={i}
                    id={`glow-${i}`}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>

              {/* Rings */}
              {Array.from({ length: TOTAL }, (_, i) => {
                const r = ringRadius(i);
                const ir = ringRadius(i + 1) + GAP / 2;
                const mid = (r + ir) / 2;
                const c = COLORS[i];
                const isActive = i === currentLayer;
                const isOuter = i < currentLayer;

                // Leader line
                const labelY = labelYs[i];
                const dy = labelY - CY;
                let startX, startY;
                if (Math.abs(dy) < r) {
                  startX = CX + Math.sqrt(r * r - dy * dy);
                  startY = labelY;
                } else {
                  startX = CX + r;
                  startY = CY;
                }
                const linePath =
                  Math.abs(startY - labelY) < 1
                    ? `M${startX},${startY} L${LABEL_DOT_X},${labelY}`
                    : `M${startX},${startY} C${Math.max(startX + 12, 470)},${startY} ${Math.max(startX + 12, 470)},${labelY} ${LABEL_DOT_X},${labelY}`;

                // Lock pips on ring
                const cnt = i + 1;
                const spread = Math.PI * 1.4;
                const start = Math.PI * 0.3;
                const pips = Array.from({ length: cnt }, (_, j) => {
                  const a = cnt === 1 ? Math.PI * 0.8 : start + (j / (cnt - 1)) * spread;
                  return { cx: CX + Math.cos(a) * mid, cy: CY + Math.sin(a) * mid };
                });

                return (
                  <g
                    key={i}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRingClick(i)}
                  >
                    {/* Band */}
                    <circle
                      cx={CX}
                      cy={CY}
                      r={mid}
                      fill="none"
                      stroke={isActive ? c.g : isOuter ? c.f : 'rgba(var(--sand-100-rgb),0.015)'}
                      strokeWidth={r - ir - GAP}
                      style={trans}
                    />
                    {/* Edge */}
                    <circle
                      cx={CX}
                      cy={CY}
                      r={r}
                      fill="none"
                      stroke={c.s}
                      strokeWidth={isActive ? 2 : 1}
                      opacity={isActive ? 0.5 : isOuter ? 0.15 : 0.06}
                      filter={isActive ? `url(#glow-${i})` : undefined}
                      style={trans}
                    />
                    {/* Lock pips */}
                    {pips.map((p, j) => (
                      <circle
                        key={j}
                        cx={p.cx}
                        cy={p.cy}
                        r={isActive ? 3 : 2}
                        fill={c.s}
                        opacity={isActive ? 0.4 : isOuter ? 0.1 : 0.04}
                        style={trans}
                      />
                    ))}
                    {/* Leader line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke={c.s}
                      strokeWidth={isActive ? 1.2 : 0.75}
                      opacity={isActive ? 0.5 : isOuter ? 0.12 : 0.04}
                      style={trans}
                    />
                    {/* Label dot */}
                    <circle
                      cx={LABEL_DOT_X}
                      cy={labelY}
                      r={isActive ? 4 : isOuter ? 2.5 : 2}
                      fill={c.s}
                      opacity={isActive ? 0.8 : isOuter ? 0.2 : 0.06}
                      style={trans}
                    />
                    {/* Title */}
                    <text
                      x={LABEL_X}
                      y={labelY - 2}
                      fontFamily="Sora, DM Sans, sans-serif"
                      fontSize={isActive ? 14 : 13}
                      fontWeight="600"
                      fill={isActive ? 'var(--warm-gold)' : 'var(--sand-100)'}
                      opacity={isActive ? 1 : isOuter ? 0.4 : 0.15}
                      dominantBaseline="auto"
                      style={trans}
                    >
                      {LAYERS[i].title}
                    </text>
                    {/* Description */}
                    <text
                      x={LABEL_X}
                      y={labelY + 14}
                      fontFamily="DM Sans, sans-serif"
                      fontSize="11"
                      fontWeight="400"
                      fill="rgba(var(--sand-100-rgb),0.3)"
                      opacity={isActive ? 0.7 : 0}
                      dominantBaseline="auto"
                      style={trans}
                    >
                      {LAYERS[i].desc}
                    </text>
                  </g>
                );
              })}

              {/* Core circle */}
              <circle
                cx={CX}
                cy={CY}
                r={INNER_R}
                fill={currentLayer >= 5 ? 'rgba(var(--warm-gold-rgb),0.08)' : 'rgba(var(--warm-gold-rgb),0.04)'}
                stroke={currentLayer >= 5 ? 'rgba(var(--warm-gold-rgb),0.25)' : 'rgba(var(--warm-gold-rgb),0.10)'}
                strokeWidth="1"
                style={{ transition: 'all 0.5s ease' }}
              />
              <text
                x={CX}
                y={CY - 5}
                textAnchor="middle"
                fontFamily="Sora"
                fontSize="8"
                fontWeight="700"
                letterSpacing="0.1em"
                fill="rgba(var(--warm-gold-rgb),0.35)"
              >
                CRITICAL
              </text>
              <text
                x={CX}
                y={CY + 8}
                textAnchor="middle"
                fontFamily="Sora"
                fontSize="8"
                fontWeight="700"
                letterSpacing="0.1em"
                fill="rgba(var(--warm-gold-rgb),0.35)"
              >
                DATA
              </text>
            </svg>
          </div>

          {/* Pips */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 5,
              marginTop: 12,
              maxWidth: 820,
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingRight: 360,
            }}
            className="layered-access-pips"
          >
            {Array.from({ length: TOTAL }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePipClick(i)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: i === currentLayer
                    ? '1px solid var(--warm-gold)'
                    : '1px solid rgba(var(--sand-100-rgb),0.12)',
                  background: i === currentLayer
                    ? 'var(--warm-gold)'
                    : 'rgba(var(--sand-100-rgb),0.03)',
                  color: i === currentLayer
                    ? 'var(--gradient-dark-mid)'
                    : 'rgba(var(--sand-100-rgb),0.3)',
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: i === currentLayer
                    ? '0 2px 16px rgba(var(--warm-gold-rgb),0.25)'
                    : 'none',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .layered-access-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .layered-access-grid > div:first-child {
            max-width: 100% !important;
            order: 2;
          }
          .layered-access-grid > div:last-child {
            order: 1;
          }
          .layered-access-pips {
            padding-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
