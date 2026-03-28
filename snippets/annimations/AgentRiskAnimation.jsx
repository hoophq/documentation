/**
 * AgentRiskAnimation — AI agent executing commands with escalating risk
 *
 * Shows a terminal where an AI agent runs commands sequentially.
 * Each command appears with a risk level badge. The risk escalates
 * from "low" to "critical" — but nothing stops any of them.
 * Conveys: agents execute blindly with your full credentials.
 *
 * Pure CSS + React state.
 */

export const AgentRiskAnimation = () => {
  const COMMANDS = [
    { cmd: 'SELECT * FROM users LIMIT 10;',          risk: 'low',      color: 'rgba(var(--sand-100-rgb),0.4)' },
    { cmd: 'UPDATE config SET debug=true;',           risk: 'medium',   color: 'var(--warm-gold)' },
    { cmd: 'kubectl scale deploy api --replicas=0',   risk: 'high',     color: 'var(--warm-gold)' },
    { cmd: 'DELETE FROM sessions WHERE 1=1;',         risk: 'critical', color: 'var(--error)' },
    { cmd: 'DROP TABLE customers;',                   risk: 'critical', color: 'var(--error)' },
  ];

  const CMD_DELAY = 1800;
  const TYPING_DURATION = 1000;
  const CYCLE_PAD = 3500;

  const [cycle, setCycle]       = useState(0);
  const [visible, setVisible]   = useState(0);
  const [typing, setTyping]     = useState(-1);
  const [fading, setFading]     = useState(false);
  const timers                  = useRef([]);

  function T(fn, ms) { const id = setTimeout(fn, ms); timers.current.push(id); }

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(0);
    setTyping(-1);
    setFading(false);

    COMMANDS.forEach((_, i) => {
      const t = i * CMD_DELAY;
      T(() => setTyping(i), t);
      T(() => { setVisible(i + 1); setTyping(-1); }, t + TYPING_DURATION);
    });

    const totalTime = COMMANDS.length * CMD_DELAY + CYCLE_PAD;
    // Fade out 600ms before reset
    T(() => setFading(true), totalTime - 600);
    T(() => setCycle((c) => c + 1), totalTime);
    return () => timers.current.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  return (
    <div className="ar-root" aria-hidden="true">
      <div className={`mock-container ar-mock${fading ? ' ar-fadeout' : ''}`}>
        <div className="mock-toolbar" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="mock-dot" /><div className="mock-dot" /><div className="mock-dot" />
          </div>
          <span className="ar-title">ai-agent · prod session</span>
          <span style={{ width: 48 }} />
        </div>

        <div className="ar-stream">
          {COMMANDS.map((c, i) => {
            const show = i < visible;
            const isTyping = i === typing;
            return (
              <div key={i} className={`ar-line${show ? ' ar-done' : ''}${isTyping ? ' ar-typing' : ''}`}>
                <div className="ar-cmd-row">
                  <span className="ar-prompt">agent $</span>
                  <span className="ar-cmd">{isTyping || show ? c.cmd : ''}</span>
                  {isTyping && <span className="ar-cursor" />}
                </div>
                {show && (
                  <div className="ar-result">
                    <span className="ar-risk" style={{ color: c.color, borderColor: c.color }}>
                      {c.risk}
                    </span>
                    <span className="ar-executed">executed</span>
                    <span className="ar-no-review">no review</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="ar-footer">
          <span className="ar-warn-dot" />
          <span>0 commands reviewed &middot; 0 blocked</span>
        </div>
      </div>

      <style>{`
        .ar-root { width: 100%; }
        .ar-mock { border-radius: 12px; overflow: hidden; transition: opacity 0.5s ease; }
        .ar-fadeout { opacity: 0; }
        .ar-title { font-family: var(--mono); font-size: 11px; color: rgba(var(--sand-100-rgb),0.2); }

        .ar-stream { padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; min-height: 220px; }

        .ar-line { opacity: 0; transition: opacity 0.3s ease; }
        .ar-line.ar-done, .ar-line.ar-typing { opacity: 1; }

        .ar-cmd-row { display: flex; align-items: center; gap: 8px; }
        .ar-prompt { font-family: var(--mono); font-size: 11px; color: rgba(var(--warm-gold-rgb),0.5); flex-shrink: 0; }
        .ar-cmd { font-family: var(--mono); font-size: 12px; color: rgba(var(--sand-100-rgb),0.6); }
        .ar-cursor {
          display: inline-block; width: 6px; height: 13px;
          background: rgba(var(--sand-100-rgb),0.5); margin-left: 1px;
          animation: ar-blink 1s step-end infinite;
        }
        @keyframes ar-blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .ar-result {
          display: flex; align-items: center; gap: 8px;
          padding: 2px 0 4px 52px;
          font-family: var(--sans); font-size: 10px;
        }
        .ar-risk {
          font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
          border: 1px solid; border-radius: 3px; padding: 1px 6px;
          font-size: 9px;
        }
        .ar-executed { color: rgba(var(--sand-100-rgb),0.3); }
        .ar-no-review { color: rgba(var(--sand-100-rgb),0.15); font-style: italic; }

        .ar-footer {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 16px; border-top: 1px solid rgba(var(--sand-100-rgb),0.06);
          font-family: var(--sans); font-size: 11px; color: rgba(var(--sand-100-rgb),0.2);
        }
        .ar-warn-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--error); opacity: 0.6;
          animation: ar-wp 1.5s ease-in-out infinite;
        }
        @keyframes ar-wp { 0%,100%{opacity:.4} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
