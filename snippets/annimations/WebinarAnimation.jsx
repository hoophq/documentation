/**
 * WebinarAnimation — Visualizes the gap the webinar addresses.
 *
 * Split-screen terminal:
 *   Left:  "Without Hoop" — Claude Code queries prod, sees raw PII
 *   Right: "With Hoop" — same query, data masked, destructive cmd blocked
 *
 * Fixed height: 380px. Loops every ~18s.
 */

export const WebinarAnimation = () => {
  const TYPING_MS = 40;
  const CMD_DELAY = 1600;
  const HOLD_MS = 3500;

  const useTypewriter = (text, active, speed = TYPING_MS) => {
    const [displayed, setDisplayed] = useState('');
    const idx = useRef(0);

    useEffect(() => {
      if (!active) { setDisplayed(''); idx.current = 0; return; }
      if (idx.current >= text.length) return;
      const t = setTimeout(() => {
        idx.current++;
        setDisplayed(text.slice(0, idx.current));
      }, speed);
      return () => clearTimeout(t);
    }, [active, displayed, text, speed]);

    return displayed;
  };

  /* ── Sequence steps ───────────────────────────────────── */
  const LEFT_STEPS = [
    { type: 'cmd', text: 'claude "query user emails from prod"' },
    { type: 'output', lines: [
      { text: '> SELECT email, ssn, phone FROM users LIMIT 3', cls: 'sql' },
    ]},
    { type: 'delay', ms: 800 },
    { type: 'output', lines: [
      { text: 'sarah.chen@acme.io   284-19-7653   +1 415-892-3041', cls: 'raw' },
      { text: 'marcus.webb@globex.com 531-77-0294  +1 212-555-8817', cls: 'raw' },
      { text: 'elena.ruiz@initech.co  719-42-8106  +44 20-7946-0958', cls: 'raw' },
    ]},
    { type: 'delay', ms: 1400 },
    { type: 'output', lines: [
      { text: '  No masking. No audit trail. No gate.', cls: 'warn' },
    ]},
  ];

  const RIGHT_STEPS = [
    { type: 'cmd', text: 'claude "query user emails from prod"' },
    { type: 'output', lines: [
      { text: '> SELECT email, ssn, phone FROM users LIMIT 3', cls: 'sql' },
    ]},
    { type: 'delay', ms: 600 },
    { type: 'output', lines: [
      { text: '\u2B22 hoop | masking PII in transit...', cls: 'hoop' },
    ]},
    { type: 'delay', ms: 800 },
    { type: 'output', lines: [
      { text: '[EMAIL]              [SSN]         [PHONE]', cls: 'masked' },
      { text: '[EMAIL]              [SSN]         [PHONE]', cls: 'masked' },
      { text: '[EMAIL]              [SSN]         [PHONE]', cls: 'masked' },
    ]},
    { type: 'delay', ms: 1200 },
    { type: 'cmd', text: 'claude "drop the staging table"' },
    { type: 'output', lines: [
      { text: '\u2B22 hoop | \u26D4 blocked: DROP TABLE', cls: 'blocked' },
      { text: '  Routed to #infra-approvals for review', cls: 'hoop' },
    ]},
  ];

  const [phase, setPhase] = useState(0); // 0=idle, 1=left-playing, 2=right-playing, 3=hold
  const [leftLines, setLeftLines] = useState([]);
  const [rightLines, setRightLines] = useState([]);
  const [typing, setTyping] = useState({ side: null, text: '' });
  const [fading, setFading] = useState(false);
  const timer = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const sleep = useCallback((ms) => new Promise(r => { timer.current = setTimeout(r, ms); }), []);

  const typeCmd = useCallback(async (text) => {
    for (let i = 1; i <= text.length; i++) {
      if (!mounted.current) return;
      setTyping(prev => ({ ...prev, text: text.slice(0, i) }));
      await sleep(TYPING_MS);
    }
    await sleep(200);
  }, [sleep]);

  const playSteps = useCallback(async (steps, side, setLines) => {
    setTyping({ side, text: '' });
    for (const step of steps) {
      if (!mounted.current) return;
      if (step.type === 'cmd') {
        setTyping({ side, text: '' });
        await typeCmd(step.text);
        setLines(prev => [...prev, { text: `$ ${step.text}`, cls: 'cmd' }]);
        setTyping({ side: null, text: '' });
        await sleep(CMD_DELAY);
      } else if (step.type === 'output') {
        for (const line of step.lines) {
          if (!mounted.current) return;
          setLines(prev => [...prev, line]);
          await sleep(300);
        }
      } else if (step.type === 'delay') {
        await sleep(step.ms);
      }
    }
  }, [typeCmd, sleep]);

  const runSequence = useCallback(async () => {
    if (!mounted.current) return;
    setLeftLines([]);
    setRightLines([]);
    setFading(false);
    setTyping({ side: null, text: '' });

    // Play left side
    await sleep(800);
    await playSteps(LEFT_STEPS, 'left', setLeftLines);
    await sleep(1200);

    // Play right side
    await playSteps(RIGHT_STEPS, 'right', setRightLines);

    // Hold
    await sleep(HOLD_MS);

    // Fade and reset
    if (!mounted.current) return;
    setFading(true);
    await sleep(1000);
    if (mounted.current) runSequence();
  }, [playSteps, sleep]);

  useEffect(() => {
    runSequence();
    return () => { mounted.current = false; clearTimeout(timer.current); };
  }, [runSequence]);

  const termStyle = {
    flex: 1,
    minWidth: 0,
    background: 'rgba(var(--sand-100-rgb),0.03)',
    border: '1px solid rgba(var(--sand-100-rgb),0.06)',
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = (isProtected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    borderBottom: '1px solid rgba(var(--sand-100-rgb),0.06)',
    background: 'rgba(var(--sand-100-rgb),0.02)',
  });

  const bodyStyle = {
    padding: '14px 16px',
    flex: 1,
    overflow: 'hidden',
    fontFamily: 'var(--mono)',
    fontSize: 11,
    lineHeight: 1.8,
  };

  return (
    <div style={{
      height: 380,
      display: 'flex',
      gap: 12,
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.8s ease',
    }}>
      {/* Left: Without Hoop */}
      <div style={termStyle}>
        <div style={headerStyle(false)}>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(var(--sand-100-rgb),0.12)' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(var(--sand-100-rgb),0.12)' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(var(--sand-100-rgb),0.12)' }} />
          </div>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
            color: 'rgba(var(--sand-100-rgb),0.35)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Without controls
          </span>
        </div>
        <div style={bodyStyle}>
          {leftLines.map((line, i) => (
            <div key={i} className={`wa-line wa-${line.cls}`}>{line.text}</div>
          ))}
          {typing.side === 'left' && typing.text && (
            <div className="wa-line wa-cmd">
              <span style={{ color: 'var(--warm-gold)' }}>$ </span>
              {typing.text}
              <span className="wa-cursor" />
            </div>
          )}
        </div>
      </div>

      {/* Right: With Hoop */}
      <div style={{ ...termStyle, border: '1px solid rgba(var(--warm-gold-rgb),0.12)' }}>
        <div style={headerStyle(true)}>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(var(--sand-100-rgb),0.12)' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(var(--sand-100-rgb),0.12)' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(var(--sand-100-rgb),0.12)' }} />
          </div>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
            color: 'var(--warm-gold)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            With Hoop
          </span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 500,
            color: 'rgba(var(--warm-gold-rgb),0.5)',
            background: 'rgba(var(--warm-gold-rgb),0.08)',
            padding: '2px 8px', borderRadius: 99,
          }}>
            gateway active
          </span>
        </div>
        <div style={bodyStyle}>
          {rightLines.map((line, i) => (
            <div key={i} className={`wa-line wa-${line.cls}`}>{line.text}</div>
          ))}
          {typing.side === 'right' && typing.text && (
            <div className="wa-line wa-cmd">
              <span style={{ color: 'var(--warm-gold)' }}>$ </span>
              {typing.text}
              <span className="wa-cursor" />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .wa-line {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .wa-cmd { color: var(--sand-300); }
        .wa-sql { color: rgba(var(--sand-100-rgb),0.35); font-style: italic; }
        .wa-raw { color: rgba(var(--sand-100-rgb),0.7); }
        .wa-warn {
          color: rgba(var(--error-rgb),0.7);
          font-style: italic;
          margin-top: 4px;
        }
        .wa-hoop { color: var(--warm-gold); }
        .wa-masked {
          color: var(--warm-gold);
          font-weight: 600;
        }
        .wa-blocked {
          color: rgba(var(--error-rgb),0.85);
          font-weight: 600;
        }
        .wa-cursor {
          display: inline-block;
          width: 7px;
          height: 14px;
          background: var(--warm-gold);
          margin-left: 2px;
          vertical-align: middle;
          animation: wa-blink 0.8s step-end infinite;
        }
        @keyframes wa-blink {
          50% { opacity: 0; }
        }
        @media (max-width: 768px) {
          .wa-line { font-size: 9px; }
        }
      `}</style>
    </div>
  );
}
