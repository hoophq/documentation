export const ApprovalCard = () => {
  const T = {
    bronze: 'var(--bronze)',
    bronzeDark: 'var(--bronze-dark)',
    espresso: 'var(--gradient-dark-mid)',
    warmGold: 'var(--warm-gold)',
    sand100: 'var(--sand-100)',
    sand200: 'var(--sand-200)',
    sand300: 'var(--sand-300)',
    sand400: 'var(--sand-400)',
    sand500: 'var(--sand-500)',
  };

  const GHOST_LINES = [
    '$ claude "payments returning 503s, diagnose"',
    '',
    '\u27E1 Connecting via Hoop read-only profile...',
    '\u2B21 hoop | profile: readonly-prod | cluster: prod-us-east',
    '\u2B21 hoop | kubectl get pods -n payments',
    '\u27E1 Found 3/5 pods in CrashLoopBackOff',
    '\u27E1 Root cause: OOMKilled, memory limit 256Mi',
    '',
    '\u27E1 Proposed fix:',
    '  kubectl set resources deploy/payments',
    '    --limits=memory=512Mi',
    '',
    '\u2B21 hoop | Write command detected. Routing...',
    '',
    '\u2B21 Revised: rollback to stable image',
    '  kubectl set image deploy/payments',
    '    payments=payments:v2.3.1',
    '',
    '\u2B21 hoop | Approved. Deploying...',
    'deployment.apps/payments updated to v2.3.1',
    '\u27E1 Rollout complete. 5/5 pods running.',
    '',
    '\u2B21 hoop | Audit: 4 cmds, 1 rejected, 1 approved',
    '\u2B21 hoop | Replay: app.hoop.dev/sessions/7f3a91c2',
  ];

  const STEPS = ['Request', 'Review', 'Reject', 'Retry', 'Approve'];

  const PHASE_REQUEST = {
    command: 'kubectl set resources deploy/payments\n--limits=memory=512Mi --requests=memory=256Mi',
    badge: 'Pending',
    badgeClass: 'pending',
    actions: 'buttons',
    context: '3/5 pods OOMKilled at 256Mi. Increasing memory limit to 512Mi to restore service.',
    feedback: null,
  };

  const PHASE_RETRY = {
    command: 'kubectl set image deploy/payments\npayments=payments:v2.3.1',
    badge: 'Pending',
    badgeClass: 'pending',
    actions: 'buttons',
    context: 'Following reviewer guidance. Rolling back to v2.3.1 before investigating the memory leak.',
    feedback: null,
  };

  const S = {
    scene: {
      position: 'relative',
      width: '100%',
      maxWidth: 680,
      height: 440,
      margin: '0 auto',
      overflow: 'hidden',
      borderRadius: 12,
      background: `linear-gradient(135deg, var(--gradient-dark-start) 0%, ${T.espresso} 35%, var(--gradient-dark-end) 70%, ${T.bronze} 100%)`,
      fontFamily: "var(--sans, 'DM Sans', system-ui, sans-serif)",
    },
    sceneGlow: {
      content: '""',
      position: 'absolute',
      top: '-20%',
      right: '-5%',
      width: '50%',
      height: '140%',
      background: `radial-gradient(ellipse at center, rgba(var(--warm-gold-rgb),0.12) 0%, transparent 70%)`,
      pointerEvents: 'none',
    },
    bgTerminal: {
      position: 'absolute',
      inset: 0,
      padding: '40px 30px',
      fontFamily: "var(--mono, 'JetBrains Mono', monospace)",
      fontSize: 11,
      lineHeight: 2.2,
      color: 'rgba(var(--sand-100-rgb),0.06)',
      overflow: 'hidden',
      pointerEvents: 'none',
      whiteSpace: 'pre',
    },
    cardStage: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    topLabel: {
      position: 'absolute',
      top: 16,
      left: 0,
      right: 0,
      textAlign: 'center',
      zIndex: 3,
      fontFamily: "var(--display, 'Sora', system-ui, sans-serif)",
      fontSize: 12,
      fontWeight: 600,
      color: 'rgba(var(--sand-100-rgb),0.2)',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    },
    phaseBar: {
      position: 'absolute',
      bottom: 16,
      left: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      zIndex: 3,
    },
    pLabel: {
      fontSize: 11,
      color: 'rgba(var(--sand-100-rgb),0.3)',
      fontWeight: 500,
      minWidth: 140,
      transition: 'opacity 0.3s',
    },
    pDots: {
      display: 'flex',
      gap: 5,
    },
    pDot: (active) => ({
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: active ? T.warmGold : 'rgba(var(--sand-100-rgb),0.15)',
      transition: 'background 0.4s, transform 0.4s',
      transform: active ? 'scale(1.4)' : 'scale(1)',
    }),
  };

  const cardBase = {
    width: 360,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 20px 60px rgba(var(--gradient-dark-start-rgb),0.6), 0 0 0 1px rgba(var(--sand-100-rgb),0.08)',
    overflow: 'hidden',
    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.5s',
  };

  const cardTransitions = {
    hidden: { transform: 'translateY(20px) scale(0.96)', opacity: 0 },
    entering: { transform: 'translateY(20px) scale(0.96)', opacity: 0 },
    visible: { transform: 'translateY(0) scale(1)', opacity: 1 },
    exiting: {
      transform: 'translateY(-20px) scale(0.96)',
      opacity: 0,
      transitionDuration: '0.4s',
    },
  };

  const badgeBase = {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: '3px 8px',
    borderRadius: 20,
  };

  const badgeVariants = {
    pending: { background: T.sand200, color: T.sand500 },
    rejected: { background: 'rgba(var(--error-rgb),0.08)', color: 'var(--error)' },
    approved: { background: 'var(--sand-200)', color: T.bronzeDark },
  };

  function CardHeader({ badge, badgeClass }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px 6px' }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: 6, background: T.bronzeDark,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.sand100, fontWeight: 800, fontSize: 13,
          }}
        >
          H
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>Hoop access request</div>
          <div style={{ fontSize: 10, color: '#999', marginTop: 1 }}>from claude-agent via #infra-approvals</div>
        </div>
        <div style={{ ...badgeBase, ...badgeVariants[badgeClass] }}>{badge}</div>
      </div>
    );
  }

  function CardBody({ command }) {
    return (
      <div style={{ padding: '8px 16px 12px' }}>
        <div style={{
          fontSize: 10, fontWeight: 600, color: '#999',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
        }}>
          Command
        </div>
        <div style={{
          background: T.sand100, borderRadius: 6, padding: '10px 12px',
          fontFamily: "var(--mono, 'JetBrains Mono', monospace)",
          fontSize: 11.5, color: T.espresso,
          borderLeft: `3px solid ${T.bronze}`, lineHeight: 1.5,
          wordBreak: 'break-all', whiteSpace: 'pre-wrap',
        }}>
          {command}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 10, color: '#999' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>prod-us-east</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>namespace: payments</span>
        </div>
      </div>
    );
  }

  function CardContext({ context }) {
    if (!context) return null;
    return (
      <div style={{
        padding: '0 16px 12px', fontSize: 11, color: '#555', lineHeight: 1.5,
        borderTop: `1px solid ${T.sand200}`, margin: '0 16px', paddingTop: 10,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 600, color: T.bronze,
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
        }}>
          Agent reasoning
        </div>
        {context}
      </div>
    );
  }

  function CardFeedback({ feedback, visible }) {
    if (!feedback) return null;
    return (
      <div style={{
        padding: '0 16px 14px', fontSize: 11.5, color: '#333', lineHeight: 1.5,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 0.4s, transform 0.4s',
      }}>
        {feedback}
      </div>
    );
  }

  function CardActions({ mode, actionsVisible }) {
    const btnBase = {
      flex: 1, padding: 10, borderRadius: 8, border: 'none',
      fontFamily: "var(--sans, 'DM Sans', system-ui, sans-serif)",
      fontSize: 13, fontWeight: 600, cursor: 'default', textAlign: 'center',
      transition: 'transform 0.2s, opacity 0.2s',
    };

    return (
      <div style={{
        display: 'flex', gap: 8, padding: '0 16px 16px',
        transition: 'opacity 0.3s',
        opacity: actionsVisible ? 1 : 0,
      }}>
        {mode === 'buttons' && (
          <>
            <div style={{ ...btnBase, background: T.bronzeDark, color: T.sand100 }}>Approve</div>
            <div style={{ ...btnBase, background: 'transparent', color: '#777', border: `1px solid ${T.sand300}` }}>Reject</div>
          </>
        )}
        {mode === 'rejected' && (
          <div style={{ ...btnBase, background: 'rgba(var(--error-rgb),0.08)', color: 'var(--error)' }}>{'\u2717'} Rejected by @sarah.chen</div>
        )}
        {mode === 'approved' && (
          <div style={{ ...btnBase, background: 'var(--sand-200)', color: T.bronzeDark }}>{'\u2713'} Approved by @sarah.chen</div>
        )}
      </div>
    );
  }

  const [cardVisibility, setCardVisibility] = useState('hidden');
  const [cardState, setCardState] = useState(PHASE_REQUEST);
  const [activeStep, setActiveStep] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [actionsMode, setActionsMode] = useState('buttons');
  const [actionsVisible, setActionsVisible] = useState(true);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState(null);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const showCard = useCallback((data) => {
    setCardState(data);
    setActionsMode('buttons');
    setActionsVisible(true);
    setFeedbackVisible(false);
    setFeedbackText(null);
    setCardVisibility('entering');
    // Double rAF to ensure the entering state is painted before transitioning
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCardVisibility('visible');
      });
    });
  }, []);

  const exitCard = useCallback(() => {
    setCardVisibility('exiting');
  }, []);

  useEffect(() => {
    let cancelled = false;

    function run() {
      if (cancelled) return;
      clearTimers();

      // Step 1: Request arrives
      setActiveStep(0);
      setStepLabel('Request received');
      showCard(PHASE_REQUEST);

      // Step 2: Rejected (at 4000ms)
      schedule(() => {
        if (cancelled) return;
        setActiveStep(2);
        setStepLabel('Rejected by @sarah.chen');
        setActionsVisible(false);

        schedule(() => {
          if (cancelled) return;
          setActionsMode('rejected');
          setActionsVisible(true);
          setCardState((prev) => ({ ...prev, badge: 'Rejected', badgeClass: 'rejected' }));

          // Show feedback at +800ms
          schedule(() => {
            if (cancelled) return;
            setFeedbackText(
              <><b style={{ fontWeight: 600 }}>@sarah.chen:</b> Don&rsquo;t bump limits blindly. Roll back to v2.3.1 first, then investigate the leak.</>
            );
            schedule(() => {
              if (cancelled) return;
              setFeedbackVisible(true);
            }, 100);
          }, 800);
        }, 300);
      }, 4000);

      // Step 3: Exit first card (at 4000 + 300 + 800 + 100 + 4000 = 9200ms)
      schedule(() => {
        if (cancelled) return;
        exitCard();
      }, 9200);

      // Step 3b: Show retry card (at 9200 + 450 + 400 = 10050ms)
      schedule(() => {
        if (cancelled) return;
        setActiveStep(3);
        setStepLabel('Agent retried with rollback');
        showCard(PHASE_RETRY);
      }, 10050);

      // Step 4: Approved (at 10050 + 3500 = 13550ms)
      schedule(() => {
        if (cancelled) return;
        setActiveStep(4);
        setStepLabel('Approved by @sarah.chen');
        setActionsVisible(false);

        schedule(() => {
          if (cancelled) return;
          setActionsMode('approved');
          setActionsVisible(true);
          setCardState((prev) => ({ ...prev, badge: 'Approved', badgeClass: 'approved' }));
        }, 300);
      }, 13550);

      // Step 5: Exit and loop (at 13550 + 300 + 4000 = 17850ms)
      schedule(() => {
        if (cancelled) return;
        exitCard();
      }, 17850);

      // Restart (at 17850 + 450 + 1000 = 19300ms)
      schedule(() => {
        if (cancelled) return;
        setCardVisibility('hidden');
        run();
      }, 19300);
    }

    run();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [clearTimers, schedule, showCard, exitCard]);

  const cardStyle = {
    ...cardBase,
    ...cardTransitions[cardVisibility],
  };

  return (
    <div style={S.scene}>
      {/* Radial glow overlay */}
      <div style={S.sceneGlow} />

      {/* Ghost terminal background */}
      <div style={S.bgTerminal}>{GHOST_LINES.join('\n')}</div>

      {/* Top label */}
      <div style={S.topLabel}>Agent approval flow</div>

      {/* Card stage */}
      <div style={S.cardStage}>
        <div style={cardStyle}>
          <CardHeader badge={cardState.badge} badgeClass={cardState.badgeClass} />
          <CardBody command={cardState.command} />
          <CardContext context={cardState.context} />
          <CardFeedback feedback={feedbackText} visible={feedbackVisible} />
          <CardActions mode={actionsMode} actionsVisible={actionsVisible} />
        </div>
      </div>

      {/* Phase dots */}
      <div style={S.phaseBar}>
        <div style={S.pLabel}>{stepLabel}</div>
        <div style={S.pDots}>
          {STEPS.map((_, i) => (
            <div key={i} style={S.pDot(i === activeStep)} />
          ))}
        </div>
      </div>
    </div>
  );
}
