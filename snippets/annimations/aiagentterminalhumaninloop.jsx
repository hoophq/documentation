export const ClaudeCodeTerminal = () => {
  /* ── Phase labels ──────────────────────────────────────────── */
  const PHASES = [
    'Read-only diagnosis',
    'Agent proposes fix',
    'Routed for approval',
    'Human rejects',
    'Agent retries',
    'Human approves',
    'Audit trail',
  ];

  /* ── Hoop badge HTML (safe: static markup) ─────────────────── */
  const HOOP = '<span class="hp">\u2B22 hoop</span>';

  /* ── Sequence definition ───────────────────────────────────── */
  function buildSequence() {
    return [
      // Phase 0: Diagnosis
      { type: 'phase', phase: 0 },
      { type: 'line', html: '<span class="pr">$</span> <span class="cm">claude</span> <span class="fl">"payments returning 503s, diagnose"</span>' },
      { type: 'delay', ms: 1200 },
      { type: 'line', html: '<span class="dm">\u27E1</span> <span class="cm">Connecting via Hoop read-only profile...</span>' },
      { type: 'delay', ms: 1000 },
      { type: 'line', html: `${HOOP} <span class="dm">|</span> profile: <span class="fl">readonly-prod</span> <span class="dm">|</span> cluster: <span class="ar">prod-us-east</span>` },
      { type: 'delay', ms: 1400 },
      { type: 'line', html: '<span class="dm">\u27E1</span> <span class="cm">3/5 pods CrashLoopBackOff, OOMKilled at 256Mi</span><span class="cursor"></span>', cursor: true },
      { type: 'delay', ms: 2000 },

      // Phase 1: Propose
      { type: 'phase', phase: 1 },
      { type: 'line', html: '', cls: 'br' },
      { type: 'line', html: '<span class="dm">\u27E1</span> <span class="cm">Proposed fix:</span>' },
      { type: 'delay', ms: 600 },
      { type: 'line', html: '  <span class="ar">kubectl set resources deploy/payments</span> <span class="fl">--limits=memory=512Mi</span>' },
      { type: 'delay', ms: 1200 },
      { type: 'line', html: `${HOOP} <span class="dm">|</span> <span class="cm">Write command detected. Routing for approval...</span>` },
      { type: 'delay', ms: 1500 },

      // Phase 2: Slack notification
      { type: 'phase', phase: 2 },
      {
        type: 'toast-show',
        head: { channel: '#infra-approvals', time: 'now' },
        msg: '<b>Hoop</b> &middot; request from <b>claude-agent</b>',
        code: 'kubectl set resources deploy/payments --limits=memory=512Mi',
        meta: 'prod-us-east \u00B7 payments',
        actions: 'buttons',
      },
      { type: 'delay', ms: 3500 },

      // Phase 3: Rejected
      { type: 'phase', phase: 3 },
      { type: 'toast-result', result: 'reject', text: '\u2717 Rejected by @sarah.chen' },
      { type: 'delay', ms: 800 },
      { type: 'toast-feedback', html: '<b>@sarah.chen:</b> Roll back to v2.3.1 first, then investigate the leak.' },
      { type: 'delay', ms: 1000 },
      { type: 'line', html: `${HOOP} <span class="dm">|</span> <span class="er">\u2717 Rejected</span> <span class="dm">"Roll back to v2.3.1 first"</span>` },
      { type: 'delay', ms: 2500 },

      // Phase 4: Retry
      { type: 'phase', phase: 4 },
      { type: 'toast-hide' },
      { type: 'delay', ms: 600 },
      { type: 'line', html: '', cls: 'br' },
      { type: 'line', html: '<span class="dm">\u27E1</span> <span class="cm">Revised: rollback to last stable image</span>' },
      { type: 'delay', ms: 800 },
      { type: 'line', html: '  <span class="ar">kubectl set image deploy/payments</span> <span class="fl">payments:v2.3.1</span>' },
      { type: 'delay', ms: 1200 },
      { type: 'line', html: `${HOOP} <span class="dm">|</span> <span class="cm">Write command detected. Routing for approval...</span>` },
      { type: 'delay', ms: 1500 },

      // Phase 5: Approved
      { type: 'phase', phase: 5 },
      {
        type: 'toast-show',
        head: { channel: '#infra-approvals', time: 'now' },
        msg: '<b>Hoop</b> &middot; request from <b>claude-agent</b>',
        code: 'kubectl set image deploy/payments payments:v2.3.1',
        meta: 'prod-us-east \u00B7 payments',
        actions: 'approved',
        resultText: '\u2713 Approved by @sarah.chen',
      },
      { type: 'delay', ms: 1200 },
      { type: 'line', html: `${HOOP} <span class="dm">|</span> <span class="ok">\u2713 Approved by @sarah.chen</span>` },
      { type: 'delay', ms: 1000 },
      { type: 'line', html: '<span class="ok">Rollout complete. 5/5 pods running. 503s resolved.</span>' },
      { type: 'delay', ms: 3000 },

      // Phase 6: Audit
      { type: 'phase', phase: 6 },
      { type: 'toast-hide' },
      { type: 'delay', ms: 600 },
      { type: 'line', html: '', cls: 'br' },
      { type: 'line', html: `${HOOP} <span class="dm">|</span> <span class="dm">Audit: 4 cmds, 1 rejected, 1 approved, 47s</span>` },
      { type: 'delay', ms: 1000 },
      { type: 'line', html: `${HOOP} <span class="dm">|</span> <span class="dm">Replay:</span> <span class="fl">app.hoop.dev/sessions/7f3a91c2</span>` },
      { type: 'delay', ms: 4000 },

      // Restart marker
      { type: 'restart' },
    ];
  }

  const [lines, setLines] = useState([]);
  const [activePhase, setActivePhase] = useState(0);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);
  const [toastData, setToastData] = useState(null);
  const [toastResult, setToastResult] = useState(null); // { type: 'ok'|'no', text }
  const [toastFeedback, setToastFeedback] = useState(null);

  // Line visibility: track which lines have been "turned on"
  const [visibleIds, setVisibleIds] = useState(new Set());

  const scrollRef = useRef(null);
  const terminalRef = useRef(null);
  const timersRef = useRef([]);
  const lineIdRef = useRef(0);
  const runIdRef = useRef(0);

  // Auto-scroll
  const [scrollOffset, setScrollOffset] = useState(0);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scheduleTimeout = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const resetState = useCallback(() => {
    setLines([]);
    setActivePhase(0);
    setToastVisible(false);
    setToastExiting(false);
    setToastData(null);
    setToastResult(null);
    setToastFeedback(null);
    setVisibleIds(new Set());
    setScrollOffset(0);
    lineIdRef.current = 0;
  }, []);

  const runSequence = useCallback(() => {
    clearTimers();
    resetState();

    const currentRun = ++runIdRef.current;
    const seq = buildSequence();
    let cumulative = 0;

    let pendingLines = [];

    seq.forEach((step) => {
      if (step.type === 'delay') {
        cumulative += step.ms;
        return;
      }

      const atTime = cumulative;

      if (step.type === 'phase') {
        const p = step.phase;
        scheduleTimeout(() => {
          if (runIdRef.current !== currentRun) return;
          setActivePhase(p);
        }, atTime);
      }

      if (step.type === 'line') {
        const id = lineIdRef.current++;
        const lineObj = { id, html: step.html, cls: step.cls || '', cursor: step.cursor || false };
        pendingLines.push({ lineObj, atTime });

        scheduleTimeout(() => {
          if (runIdRef.current !== currentRun) return;
          setLines((prev) => [...prev, lineObj]);
          // Trigger visibility after a small delay (simulating double rAF)
          scheduleTimeout(() => {
            if (runIdRef.current !== currentRun) return;
            setVisibleIds((prev) => new Set([...prev, id]));
          }, 32);
        }, atTime);
      }

      if (step.type === 'toast-show') {
        scheduleTimeout(() => {
          if (runIdRef.current !== currentRun) return;
          setToastResult(null);
          setToastFeedback(null);
          setToastExiting(false);
          setToastData(step);
          // Show after a frame
          scheduleTimeout(() => {
            if (runIdRef.current !== currentRun) return;
            setToastVisible(true);
          }, 32);
        }, atTime);
      }

      if (step.type === 'toast-hide') {
        scheduleTimeout(() => {
          if (runIdRef.current !== currentRun) return;
          setToastExiting(true);
          setToastVisible(false);
        }, atTime);
      }

      if (step.type === 'toast-result') {
        scheduleTimeout(() => {
          if (runIdRef.current !== currentRun) return;
          setToastResult({ type: step.result === 'reject' ? 'no' : 'ok', text: step.text });
        }, atTime);
      }

      if (step.type === 'toast-feedback') {
        scheduleTimeout(() => {
          if (runIdRef.current !== currentRun) return;
          setToastFeedback(step.html);
        }, atTime);
      }

      if (step.type === 'restart') {
        scheduleTimeout(() => {
          if (runIdRef.current !== currentRun) return;
          runSequence();
        }, atTime);
      }
    });
  }, [clearTimers, resetState, scheduleTimeout]);

  // Auto-scroll effect
  useEffect(() => {
    if (!scrollRef.current || !terminalRef.current) return;
    const totalH = scrollRef.current.scrollHeight;
    const viewH = terminalRef.current.clientHeight - 70;
    if (totalH > viewH) {
      setScrollOffset(totalH - viewH);
    }
  }, [lines]);

  // Start on mount
  useEffect(() => {
    runSequence();
    return () => clearTimers();
  }, [runSequence, clearTimers]);

  /* ── Toast styles (inline to avoid styled-jsx scoping issues) ── */
  const isShowing = toastVisible && !toastExiting;
  const toastCardStyle = {
    background: '#FFFFFF',
    borderRadius: 12,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.06)',
    fontFamily: 'var(--sans)',
    overflow: 'hidden',
    transform: isShowing ? 'translateX(0) scale(1)' : toastExiting ? 'translateX(340px) scale(0.96)' : 'translateX(340px) scale(0.96)',
    opacity: isShowing ? 1 : 0,
    transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s',
    pointerEvents: 'auto',
  };

  const btnBase = {
    flex: 1, padding: '8px 14px', borderRadius: 8, border: 'none',
    fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
    textAlign: 'center', cursor: 'default',
  };

  const renderToast = () => {
    if (!toastData) return null;

    return (
      <div style={toastCardStyle}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 14px 6px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--bronze-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#fff', fontWeight: 800, flexShrink: 0,
          }}>H</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>Hoop access request</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>
              from claude-agent · {toastData.head.channel}
            </div>
          </div>
        </div>

        {/* Command block */}
        <div style={{ padding: '6px 14px 10px' }}>
          <div style={{
            fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#999', marginBottom: 5,
          }}>Command</div>
          <div style={{
            background: '#F5F3F0', borderRadius: 6, padding: '8px 10px',
            fontFamily: 'var(--mono)', fontSize: 10.5, color: '#222',
            borderLeft: '3px solid var(--bronze)', lineHeight: 1.5,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{toastData.code}</div>
          <div style={{ fontSize: 10, color: '#999', marginTop: 6 }}>{toastData.meta}</div>
        </div>

        {/* Actions / result */}
        <div style={{ display: 'flex', gap: 8, padding: '0 14px 14px', alignItems: 'center' }}>
          {toastResult ? (
            <div style={{
              ...btnBase,
              background: toastResult.type === 'ok' ? '#EBEBEB' : 'rgba(196,80,80,0.08)',
              color: toastResult.type === 'ok' ? '#333' : '#C45050',
            }}>
              {toastResult.text}
            </div>
          ) : toastData.actions === 'buttons' ? (
            <>
              <div style={{ ...btnBase, background: 'var(--bronze-dark)', color: '#fff' }}>Approve</div>
              <div style={{ ...btnBase, background: 'transparent', color: '#888', border: '1px solid #DDD' }}>Reject</div>
            </>
          ) : toastData.actions === 'approved' ? (
            <div style={{ ...btnBase, background: '#EBEBEB', color: '#333' }}>{toastData.resultText}</div>
          ) : null}
        </div>

        {/* Reviewer feedback */}
        {toastFeedback && (
          <div style={{
            padding: '10px 14px 14px', fontSize: 11, color: '#333',
            lineHeight: 1.45, fontFamily: 'var(--sans)',
            borderTop: '1px solid #EEE', margin: '0 14px',
          }} dangerouslySetInnerHTML={{ __html: toastFeedback }} />
        )}
      </div>
    );
  };

  return (
    <div className="scene">
      {/* Chrome bar */}
      <div className="chrome">
        <div className="d dr" />
        <div className="d dy" />
        <div className="d dg" />
        <div className="ct">claude code</div>
      </div>

      {/* Terminal body */}
      <div className="terminal" ref={terminalRef}>
        <div
          className="scroll-inner"
          ref={scrollRef}
          style={{ transform: `translateY(-${scrollOffset}px)` }}
        >
          {lines.map((line) => {
            const isVisible = visibleIds.has(line.id);
            const cls = ['ln', line.cls, isVisible ? 'on' : ''].filter(Boolean).join(' ');
            return (
              <div
                key={line.id}
                className={cls}
                dangerouslySetInnerHTML={{ __html: line.html }}
              />
            );
          })}
        </div>
      </div>

      {/* Slack toast */}
      <div className="slack-wrap">
        {renderToast()}
      </div>

      {/* Footer phase dots */}
      <div className="footer">
        <div className="phase-lbl">{PHASES[activePhase]}</div>
        <div className="dots">
          {PHASES.map((_, i) => (
            <button
              key={i}
              className={`dot${i === activePhase ? ' active' : ''}`}
              style={{ cursor: 'default' }}
              aria-label={PHASES[i]}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scene {
          position: relative;
          width: 100%;
          max-width: 680px;
          height: 460px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 12px;
          background: var(--gradient-dark-start);
          font-family: 'JetBrains Mono', monospace;
        }
        .scene::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -10%;
          width: 60%;
          height: 160%;
          background: radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .chrome {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: var(--gradient-dark-start);
          border-bottom: 1px solid rgba(var(--sand-100-rgb),0.08);
          position: relative;
          z-index: 1;
        }
        .d {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dr { background: var(--error); opacity: 0.6; }
        .dy { background: #E8B44C; opacity: 0.6; }
        .dg { background: var(--warm-gold); opacity: 0.6; }
        .ct {
          flex: 1;
          text-align: center;
          font-size: 11px;
          color: rgba(var(--sand-100-rgb),0.25);
          font-family: 'DM Sans', system-ui, sans-serif;
          letter-spacing: 0.3px;
          font-weight: 500;
        }

        .terminal {
          position: relative;
          z-index: 1;
          height: 380px;
          overflow: hidden;
          padding: 16px 18px 60px;
        }
        .terminal::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: linear-gradient(transparent, var(--gradient-dark-start));
          pointer-events: none;
          z-index: 2;
        }

        .scroll-inner {
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ln {
          font-size: 13px;
          line-height: 1.8;
          color: var(--sand-500);
          white-space: nowrap;
          min-height: 23px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .ln.on {
          opacity: 1;
          transform: translateY(0);
        }
        .ln.br {
          min-height: 10px;
        }

        .ln .pr { color: var(--warm-gold); font-weight: 600; }
        .ln .cm { color: var(--sand-300); }
        .ln .fl { color: var(--warm-gold); }
        .ln .ar { color: #E8B44C; }
        .ln .ok { color: var(--warm-gold); }
        .ln .er { color: var(--error); }
        .ln .dm { color: rgba(var(--sand-100-rgb),0.25); }
        .ln .hp { color: var(--bronze); font-weight: 500; }
        .ln .cursor {
          display: inline-block;
          width: 7px;
          height: 14px;
          background: var(--sand-100);
          vertical-align: middle;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Toast wrapper — positioning only, styles are inline */
        .slack-wrap {
          position: absolute;
          top: 50px;
          right: 14px;
          width: 300px;
          z-index: 10;
          pointer-events: none;
        }

        /* Footer phase indicator */
        .footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          z-index: 3;
          background: var(--gradient-dark-start);
        }
        .dots { display: flex; gap: 4px; }
        .dot {
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dot span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(var(--sand-100-rgb),0.25);
          transition: background 0.4s, transform 0.4s;
          pointer-events: none;
        }
        .dot:hover span {
          background: var(--sand-500);
          transform: scale(1.3);
        }
        .dot.active span {
          background: var(--bronze);
          transform: scale(1.4);
        }
        .phase-lbl {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 11px;
          color: rgba(var(--sand-100-rgb),0.25);
          font-weight: 500;
          letter-spacing: 0.2px;
          margin-right: 8px;
          min-width: 200px;
          text-align: right;
          transition: opacity 0.3s;
        }
      `}</style>
    </div>
  );
}
