export const AIChatThread = () => {
  const STEP_NAMES = ['Diagnose', 'Propose', 'Review', 'Reject', 'Retry', 'Approve', 'Audit'];

  function msgEntry(avatar, avatarClass, name, time, content) {
    return { type: 'msg', avatar, avatarClass, name, time, content };
  }
  function dividerEntry(text) {
    return { type: 'divider', text };
  }
  function typingEntry(avatar, avatarClass) {
    return { type: 'typing', avatar, avatarClass };
  }

  function Message({ avatar, avatarClass, name, time, content, visible }) {
    return (
      <div
        className="aichat-msg"
        style={{
          display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        <div className={`aichat-msg-avatar ${avatarClass}`}>{avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="aichat-msg-name">
            {name} <span className="aichat-msg-time">{time}</span>
          </div>
          {content}
        </div>
      </div>
    );
  }

  function Divider({ text, visible }) {
    return (
      <div
        className="aichat-divider"
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        <div className="aichat-divider-line" />
        <div className="aichat-divider-text">{text}</div>
        <div className="aichat-divider-line" />
      </div>
    );
  }

  function TypingIndicator({ avatar, avatarClass }) {
    return (
      <div
        style={{
          display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0',
          opacity: 1, transform: 'translateY(0)',
        }}
      >
        <div className={`aichat-msg-avatar ${avatarClass}`}>{avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="aichat-typing">
            <span className="aichat-typing-dot" style={{ animationDelay: '0s' }} />
            <span className="aichat-typing-dot" style={{ animationDelay: '0.15s' }} />
            <span className="aichat-typing-dot" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </div>
    );
  }

  function MsgText({ children }) {
    return <div className="aichat-msg-text">{children}</div>;
  }
  function MsgCode({ children }) {
    return <div className="aichat-msg-code">{children}</div>;
  }
  function MsgTag({ className, children }) {
    return <span className={`aichat-msg-tag ${className}`}>{children}</span>;
  }
  function MsgActions({ children }) {
    return <div className="aichat-msg-actions">{children}</div>;
  }
  function MsgBtn({ className, children }) {
    return <span className={`aichat-msg-btn ${className}`}>{children}</span>;
  }

  const [items, setItems] = useState([]);
  const [visibleSet, setVisibleSet] = useState(new Set());
  const [step, setStep] = useState(0);
  const [statusLabel, setStatusLabel] = useState('Live');
  const [statusClass, setStatusClass] = useState('active');

  const innerRef = useRef(null);
  const threadRef = useRef(null);
  const timersRef = useRef([]);
  const idCounterRef = useRef(0);
  const cancelledRef = useRef(false);

  /* ── helpers ── */
  const clearTimers = useCallback(() => {
    cancelledRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      if (cancelledRef.current) return;
      const id = setTimeout(resolve, ms);
      timersRef.current.push(id);
    });
  }, []);

  const autoScroll = useCallback(() => {
    const inner = innerRef.current;
    const thread = threadRef.current;
    if (!inner || !thread) return;
    const totalH = inner.scrollHeight;
    const viewH = thread.clientHeight - 50;
    if (totalH > viewH) {
      inner.style.transform = `translateY(-${totalH - viewH}px)`;
    }
  }, []);

  const addItem = useCallback((item) => {
    const id = ++idCounterRef.current;
    const entry = { ...item, id };
    setItems((prev) => [...prev, entry]);
    // Show after a frame for fade-in animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisibleSet((prev) => new Set([...prev, id]));
      });
    });
    // Scroll after DOM updates
    setTimeout(autoScroll, 50);
    return id;
  }, [autoScroll]);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setTimeout(autoScroll, 50);
  }, [autoScroll]);

  /* ── animation sequence ── */
  const runSequence = useCallback(async () => {
    cancelledRef.current = false;
    idCounterRef.current = 0;
    setItems([]);
    setVisibleSet(new Set());
    setStep(0);
    setStatusLabel('Live');
    setStatusClass('active');
    if (innerRef.current) innerRef.current.style.transform = 'translateY(0)';

    const cancelled = () => cancelledRef.current;

    // Phase 0: Diagnose
    setStep(0);
    let typId = addItem(typingEntry('C', 'aichat-avatar-agent'));
    await delay(1200);
    if (cancelled()) return;
    removeItem(typId);

    addItem(msgEntry('C', 'aichat-avatar-agent', 'claude-agent', '2:41 PM', (
      <>
        <MsgText>Payments service returning 503s. Connecting to diagnose.</MsgText>
        <MsgTag className="aichat-tag-readonly">read-only profile</MsgTag>
      </>
    )));
    await delay(1800);
    if (cancelled()) return;

    typId = addItem(typingEntry('C', 'aichat-avatar-agent'));
    await delay(1000);
    if (cancelled()) return;
    removeItem(typId);

    addItem(msgEntry('C', 'aichat-avatar-agent', 'claude-agent', '2:41 PM', (
      <MsgText>Found 3/5 pods in CrashLoopBackOff. Root cause: OOMKilled at 256Mi.</MsgText>
    )));
    await delay(2000);
    if (cancelled()) return;

    // Phase 1: Propose
    setStep(1);
    typId = addItem(typingEntry('C', 'aichat-avatar-agent'));
    await delay(1200);
    if (cancelled()) return;
    removeItem(typId);

    addItem(msgEntry('C', 'aichat-avatar-agent', 'claude-agent', '2:42 PM', (
      <>
        <MsgText>Proposed fix: increase memory limit.</MsgText>
        <MsgCode>
          kubectl set resources deploy/payments<br />--limits=memory=512Mi
        </MsgCode>
      </>
    )));
    await delay(1200);
    if (cancelled()) return;

    // Phase 2: Review
    setStep(2);
    addItem(msgEntry('H', 'aichat-avatar-hoop', 'Hoop', '2:42 PM', (
      <>
        <MsgText>Write command detected on <b>prod-us-east</b>. Approval required.</MsgText>
        <MsgTag className="aichat-tag-write">escalation: write</MsgTag>
      </>
    )));
    await delay(1000);
    if (cancelled()) return;

    addItem(msgEntry('H', 'aichat-avatar-hoop', 'Hoop', '2:42 PM', (
      <>
        <MsgText>Waiting for approval...</MsgText>
        <MsgActions>
          <MsgBtn className="aichat-btn-approve">Approve</MsgBtn>
          <MsgBtn className="aichat-btn-reject">Reject</MsgBtn>
        </MsgActions>
      </>
    )));
    await delay(3000);
    if (cancelled()) return;

    // Phase 3: Rejected
    setStep(3);
    addItem(msgEntry('S', 'aichat-avatar-human', 'sarah.chen', '2:42 PM', (
      <>
        <MsgText>Don&apos;t bump limits blindly. Roll back to v2.3.1 first, then investigate the leak.</MsgText>
        <MsgTag className="aichat-tag-rejected">Rejected</MsgTag>
      </>
    )));
    await delay(2500);
    if (cancelled()) return;

    // Phase 4: Retry
    setStep(4);
    addItem(dividerEntry('Agent adjusting approach'));
    await delay(800);
    if (cancelled()) return;

    typId = addItem(typingEntry('C', 'aichat-avatar-agent'));
    await delay(1400);
    if (cancelled()) return;
    removeItem(typId);

    addItem(msgEntry('C', 'aichat-avatar-agent', 'claude-agent', '2:43 PM', (
      <>
        <MsgText>Understood. Rolling back to last stable version instead.</MsgText>
        <MsgCode>
          kubectl set image deploy/payments<br />payments=payments:v2.3.1
        </MsgCode>
      </>
    )));
    await delay(1200);
    if (cancelled()) return;

    addItem(msgEntry('H', 'aichat-avatar-hoop', 'Hoop', '2:43 PM', (
      <>
        <MsgText>Write command detected. Approval required.</MsgText>
        <MsgActions>
          <MsgBtn className="aichat-btn-approve">Approve</MsgBtn>
          <MsgBtn className="aichat-btn-reject">Reject</MsgBtn>
        </MsgActions>
      </>
    )));
    await delay(2500);
    if (cancelled()) return;

    // Phase 5: Approved
    setStep(5);
    addItem(msgEntry('S', 'aichat-avatar-human', 'sarah.chen', '2:43 PM', (
      <>
        <MsgText>Approved. Good call.</MsgText>
        <MsgTag className="aichat-tag-approved">Approved</MsgTag>
      </>
    )));
    await delay(1500);
    if (cancelled()) return;

    addItem(msgEntry('H', 'aichat-avatar-hoop', 'Hoop', '2:43 PM', (
      <MsgText>Deployed. All 5/5 pods running. 503s resolved.</MsgText>
    )));
    await delay(2500);
    if (cancelled()) return;

    // Phase 6: Audit
    setStep(6);
    addItem(dividerEntry('Session complete'));
    await delay(600);
    if (cancelled()) return;

    setStatusLabel('Resolved');
    setStatusClass('done');

    addItem(msgEntry('H', 'aichat-avatar-hoop', 'Hoop', '2:44 PM', (
      <MsgText>
        4 commands, 1 rejected, 1 approved, 47s total.<br />
        Replay: app.hoop.dev/sessions/7f3a91c2
      </MsgText>
    )));
    await delay(5000);
    if (cancelled()) return;

    // Loop
    runSequence();
  }, [addItem, removeItem, delay]);

  useEffect(() => {
    runSequence();
    return clearTimers;
  }, [runSequence, clearTimers]);

  /* ── render ── */
  return (
    <div className="aichat-scene">
      <style>{`
        .aichat-scene {
          position: relative; width: 100%; max-width: 520px; height: 520px;
          margin: 0 auto; overflow: hidden; border-radius: 14px;
          background: #fff; font-family: var(--sans);
          border: 1px solid var(--sand-200);
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .aichat-header {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px; border-bottom: 1px solid var(--sand-200);
          background: #fff;
        }
        .aichat-h-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, var(--espresso), var(--bronze));
          display: flex; align-items: center; justify-content: center;
          color: var(--sand-100); font-weight: 800; font-size: 14px;
        }
        .aichat-h-info { flex: 1; }
        .aichat-h-title { font-size: 14px; font-weight: 700; color: #111; }
        .aichat-h-sub { font-size: 11px; color: #999; margin-top: 1px; }
        .aichat-h-status {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; padding: 3px 10px; border-radius: 20px;
          transition: all 0.4s;
        }
        .aichat-h-status-active { background: var(--sand-200); color: var(--bronze); }
        .aichat-h-status-done { background: var(--sand-200); color: var(--bronze-dark); }

        .aichat-thread {
          height: 420px; overflow: hidden; position: relative;
          padding: 14px 18px 50px;
        }
        .aichat-thread-inner {
          display: flex; flex-direction: column; gap: 4px;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .aichat-thread::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 50px;
          background: linear-gradient(transparent, #fff);
          pointer-events: none;
        }

        .aichat-msg-avatar {
          width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; margin-top: 2px;
        }
        .aichat-avatar-agent { background: #1A1A2E; color: #A8A8C8; }
        .aichat-avatar-hoop { background: var(--bronze-dark); color: var(--sand-100); }
        .aichat-avatar-human { background: var(--sand-300); color: var(--bronze); }

        .aichat-msg-name {
          font-size: 11px; font-weight: 600; color: #111; margin-bottom: 2px;
          display: flex; align-items: center; gap: 6px;
        }
        .aichat-msg-time { font-size: 9px; color: #bbb; font-weight: 400; }
        .aichat-msg-text { font-size: 12.5px; color: #555; line-height: 1.55; }

        .aichat-msg-code {
          margin-top: 5px; padding: 7px 10px; background: var(--sand-100);
          border-radius: 6px; font-family: var(--mono); font-size: 10.5px;
          color: var(--espresso); border-left: 3px solid var(--bronze);
          line-height: 1.5; word-break: break-all;
        }

        .aichat-msg-tag {
          display: inline-block; font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          padding: 2px 7px; border-radius: 4px; margin-top: 4px;
        }
        .aichat-tag-rejected { background: rgba(var(--error-rgb),0.08); color: var(--error); }
        .aichat-tag-approved { background: var(--sand-200); color: var(--bronze-dark); }
        .aichat-tag-readonly { background: var(--sand-200); color: var(--sand-500); }
        .aichat-tag-write { background: var(--sand-200); color: var(--bronze); }

        .aichat-msg-actions {
          display: flex; gap: 6px; margin-top: 6px;
        }
        .aichat-msg-btn {
          padding: 5px 14px; border-radius: 6px; font-size: 11px;
          font-weight: 600; font-family: var(--sans); border: none; cursor: default;
          display: inline-block;
        }
        .aichat-btn-approve { background: var(--bronze-dark); color: var(--sand-100); }
        .aichat-btn-reject { background: transparent; color: #777; border: 1px solid var(--sand-300); }

        .aichat-divider-line { flex: 1; height: 1px; background: var(--sand-200); }
        .aichat-divider-text {
          font-size: 9px; font-weight: 600; color: #bbb;
          text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;
        }

        .aichat-typing {
          display: flex; gap: 3px; padding: 4px 0;
        }
        .aichat-typing-dot {
          width: 5px; height: 5px; border-radius: 50%; background: var(--sand-400);
          animation: aichatTypingBounce 1.2s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes aichatTypingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        .aichat-footer-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 44px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          z-index: 3; background: #fff; border-top: 1px solid var(--sand-200);
        }
        .aichat-f-dots { display: flex; gap: 5px; }
        .aichat-f-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--sand-300);
          transition: background 0.4s, transform 0.4s;
        }
        .aichat-f-dot-active { background: var(--bronze); transform: scale(1.4); }
        .aichat-f-label {
          font-size: 10px; color: #bbb; font-weight: 500;
          min-width: 120px; text-align: right; margin-right: 8px;
        }
      `}</style>

      {/* Header */}
      <div className="aichat-header">
        <div className="aichat-h-icon">H</div>
        <div className="aichat-h-info">
          <div className="aichat-h-title">#infra-approvals</div>
          <div className="aichat-h-sub">claude-agent, hoop, sarah.chen</div>
        </div>
        <div className={`aichat-h-status aichat-h-status-${statusClass}`}>
          {statusLabel}
        </div>
      </div>

      {/* Thread */}
      <div className="aichat-thread" ref={threadRef}>
        <div className="aichat-thread-inner" ref={innerRef}>
          {items.map((item) => {
            if (item.type === 'typing') {
              return (
                <TypingIndicator
                  key={item.id}
                  avatar={item.avatar}
                  avatarClass={item.avatarClass}
                />
              );
            }
            if (item.type === 'divider') {
              return (
                <Divider
                  key={item.id}
                  text={item.text}
                  visible={visibleSet.has(item.id)}
                />
              );
            }
            return (
              <Message
                key={item.id}
                avatar={item.avatar}
                avatarClass={item.avatarClass}
                name={item.name}
                time={item.time}
                content={item.content}
                visible={visibleSet.has(item.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="aichat-footer-bar">
        <div className="aichat-f-label">{STEP_NAMES[step]}</div>
        <div className="aichat-f-dots">
          {STEP_NAMES.map((_, i) => (
            <div
              key={i}
              className={`aichat-f-dot${i === step ? ' aichat-f-dot-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
