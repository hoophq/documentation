export const TerminalMasking = () => {
  const FONTS_URL =
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap";

  const C = {
    termBg: "var(--gradient-dark-start)",
    border: "rgba(var(--sand-100-rgb),0.06)",
    warmGold: "var(--warm-gold)",
    command: "var(--sand-300)",
    rawFlash: "rgba(var(--sand-100-rgb),0.4)",
    dimText: "rgba(var(--sand-100-rgb),0.20)",
    sand100: "var(--sand-100)",
  };

  const PROMPT = "maria@prod-app-01:~$ ";

  // Phase 1: cat customers.csv
  const PHASE1_CMD = 'cat /var/data/customers.csv';
  const PHASE1_HEADER = 'id,name,email,ssn,phone';
  const PHASE1_ROWS = [
    {
      prefix: '1,',
      fields: [
        { raw: 'Sarah Chen', masked: '[PERSON]' },
        { raw: 'sarah.chen@acme.io', masked: '[EMAIL]' },
        { raw: '284-19-7653', masked: '[SSN]' },
        { raw: '+1 415-892-3041', masked: '[PHONE]' },
      ],
    },
    {
      prefix: '2,',
      fields: [
        { raw: 'Marcus Webb', masked: '[PERSON]' },
        { raw: 'm.webb@globex.com', masked: '[EMAIL]' },
        { raw: '531-77-0294', masked: '[SSN]' },
        { raw: '+1 212-555-8817', masked: '[PHONE]' },
      ],
    },
    {
      prefix: '3,',
      fields: [
        { raw: 'Elena Ruiz', masked: '[PERSON]' },
        { raw: 'eruiz@initech.co', masked: '[EMAIL]' },
        { raw: '719-42-8106', masked: '[SSN]' },
        { raw: '+44 20-7946-0958', masked: '[PHONE]' },
      ],
    },
  ];

  // Phase 2: grep transactions
  const PHASE2_CMD = 'grep "payment" /var/log/transactions.log';
  const PHASE2_ROWS = [
    {
      prefix: '2026-03-22 14:01:22 payment_received ',
      fields: [
        { raw: 'card=4532-XXXX-XXXX-7891', masked: 'card=[PCI]' },
        { raw: ' amount=$2,450.00 ', masked: ' amount=$2,450.00 ' },
        { raw: 'user=sarah.chen@acme.io', masked: 'user=[EMAIL]' },
      ],
    },
    {
      prefix: '2026-03-22 14:01:45 payment_failed ',
      fields: [
        { raw: 'card=6011-XXXX-XXXX-4523', masked: 'card=[PCI]' },
        { raw: ' amount=$180.00 ', masked: ' amount=$180.00 ' },
        { raw: 'user=m.webb@globex.com', masked: 'user=[EMAIL]' },
      ],
    },
    {
      prefix: '2026-03-22 14:02:11 refund_processed ',
      fields: [
        { raw: 'card=3782-XXXX-XXXX-0052', masked: 'card=[PCI]' },
        { raw: ' amount=$450.00 ', masked: ' amount=$450.00 ' },
        { raw: 'user=eruiz@initech.co', masked: 'user=[EMAIL]' },
      ],
    },
  ];

  // Phase 3: env secrets
  const PHASE3_CMD = 'env | grep -i secret';
  const PHASE3_ROWS = [
    {
      prefix: 'DATABASE_URL=',
      fields: [
        { raw: 'postgres://admin:s3cretP@ss@db.internal:5432/prod', masked: '[CREDENTIAL]' },
      ],
    },
    {
      prefix: 'API_KEY=',
      fields: [
        { raw: 'sk-live-4f8b2c9a1d3e7f6b0a2c8e4d5f9b1a3c', masked: '[CREDENTIAL]' },
      ],
    },
    {
      prefix: 'AWS_SECRET_ACCESS_KEY=',
      fields: [
        { raw: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', masked: '[CREDENTIAL]' },
      ],
    },
  ];

  const TYPING_SPEED = 45;
  const RAW_FLASH_MS = 200;
  const ROW_STAGGER = 500;
  const PHASE_GAP = 1800;
  const HOLD_END = 2000;

  const [lines, setLines] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const timeoutsRef = useRef([]);
  const cursorIntervalRef = useRef(null);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Blink cursor
  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(cursorIntervalRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const addLine = (line) => {
      if (cancelled) return;
      setLines(prev => [...prev, line]);
    };

    const updateLastLine = (updater) => {
      if (cancelled) return;
      setLines(prev => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        copy[copy.length - 1] = updater(copy[copy.length - 1]);
        return copy;
      });
    };

    // Type a command character by character
    const typeCommand = (cmd, startTime) => {
      // Add prompt line with empty typed portion
      later(() => {
        addLine({ type: 'command', text: '', fullCmd: cmd, typing: true });
      }, startTime);

      // Type each character
      for (let i = 0; i < cmd.length; i++) {
        const charIdx = i;
        later(() => {
          if (cancelled) return;
          setLines(prev => {
            const copy = [...prev];
            const last = copy.length - 1;
            if (last >= 0 && copy[last].type === 'command') {
              copy[last] = { ...copy[last], text: cmd.slice(0, charIdx + 1) };
            }
            return copy;
          });
        }, startTime + (i + 1) * TYPING_SPEED);
      }

      // Mark done typing
      later(() => {
        if (cancelled) return;
        setLines(prev => {
          const copy = [...prev];
          const last = copy.length - 1;
          if (last >= 0 && copy[last].type === 'command') {
            copy[last] = { ...copy[last], typing: false };
          }
          return copy;
        });
      }, startTime + cmd.length * TYPING_SPEED + 100);

      return startTime + cmd.length * TYPING_SPEED + 200;
    };

    // Output rows with masking animation
    const outputRows = (rows, startTime, isCSV, fieldCount) => {
      let t = startTime;
      let totalMasked = fieldCount || 0;

      rows.forEach((row, rowIdx) => {
        const rowTime = t + rowIdx * ROW_STAGGER;

        // Add row in raw state
        later(() => {
          addLine({
            type: 'output',
            prefix: row.prefix,
            fields: row.fields.map(f => ({ ...f, state: 'raw' })),
            visible: true,
            fadeIn: true,
          });
        }, rowTime);

        // Mask each field
        row.fields.forEach((field, fIdx) => {
          // Only mask fields where raw !== masked (skip amount fields)
          if (field.raw === field.masked) return;

          const maskTime = rowTime + RAW_FLASH_MS + fIdx * 80;
          later(() => {
            if (cancelled) return;
            // Find this row's line and flip the field to masked
            setLines(prev => {
              const copy = [...prev];
              // Find the output line for this row
              let outputIdx = 0;
              for (let li = copy.length - 1; li >= 0; li--) {
                if (copy[li].type === 'output') {
                  if (outputIdx === rows.length - 1 - rowIdx) {
                    // This is our row — but we need to count from the end
                    break;
                  }
                  outputIdx++;
                }
              }
              // Simpler: find the correct row by counting output lines
              let count = 0;
              for (let li = 0; li < copy.length; li++) {
                if (copy[li].type === 'output' && copy[li].prefix === row.prefix) {
                  const newFields = [...copy[li].fields];
                  newFields[fIdx] = { ...newFields[fIdx], state: 'masked' };
                  copy[li] = { ...copy[li], fields: newFields, fadeIn: false };
                  break;
                }
              }
              return copy;
            });
          }, maskTime);

          totalMasked++;
        });
      });

      return {
        endTime: t + (rows.length - 1) * ROW_STAGGER + RAW_FLASH_MS + 400,
        masked: totalMasked,
      };
    };

    const countMaskableFields = (rows) => {
      let count = 0;
      rows.forEach(row => {
        row.fields.forEach(f => {
          if (f.raw !== f.masked) count++;
        });
      });
      return count;
    };

    const addStatusLine = (time, fieldsMasked) => {
      later(() => {
        addLine({
          type: 'status',
          text: `hoop gateway \u00B7 ${fieldsMasked} fields masked \u00B7 0ms added latency`,
          visible: true,
        });
      }, time);
    };

    const cycle = () => {
      if (cancelled) return;
      setLines([]);
      setOpacity(1);

      let t = 300;

      // === Phase 1: cat ===
      t = typeCommand(PHASE1_CMD, t);
      t += 200;

      // Header line (no masking)
      later(() => {
        addLine({ type: 'output-plain', text: PHASE1_HEADER, fadeIn: true });
      }, t);
      t += 300;

      const p1Fields = countMaskableFields(PHASE1_ROWS);
      const p1 = outputRows(PHASE1_ROWS, t, true, 0);
      t = p1.endTime + 400;

      // Status line
      addStatusLine(t, p1Fields);
      t += PHASE_GAP;

      // === Phase 2: grep ===
      t = typeCommand(PHASE2_CMD, t);
      t += 200;

      const p2Fields = countMaskableFields(PHASE2_ROWS);
      const p2 = outputRows(PHASE2_ROWS, t, false, 0);
      t = p2.endTime + 400;

      addStatusLine(t, p2Fields);
      t += PHASE_GAP;

      // === Phase 3: env ===
      t = typeCommand(PHASE3_CMD, t);
      t += 200;

      const p3Fields = countMaskableFields(PHASE3_ROWS);
      const p3 = outputRows(PHASE3_ROWS, t, false, 0);
      t = p3.endTime + 400;

      addStatusLine(t, p3Fields);
      t += HOLD_END;

      // Fade out and restart
      later(() => {
        if (cancelled) return;
        setOpacity(0);
      }, t);

      later(() => {
        if (cancelled) return;
        cycle();
      }, t + 800);
    };

    cycle();
    return () => {
      cancelled = true;
      clearAll();
    };
  }, [later, clearAll]);

  return (
    <>
      <link rel="stylesheet" href={FONTS_URL} />
      <style>{`
        @keyframes termFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes maskFlip {
          0% { opacity: 1; }
          40% { opacity: 0.3; transform: scaleX(0.95); }
          100% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes badgePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div style={{
        maxWidth: 580,
        margin: '0 auto',
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${C.border}`,
        background: C.termBg,
        fontFamily: "'JetBrains Mono', monospace",
        opacity,
        transition: 'opacity 0.7s ease',
        position: 'relative',
        height: 460,
      }}>
        {/* Terminal chrome / toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          background: 'rgba(var(--sand-100-rgb),0.03)',
          borderBottom: `1px solid ${C.border}`,
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <div style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 11,
            color: 'rgba(var(--sand-100-rgb),0.35)',
            letterSpacing: '0.01em',
          }}>
            Terminal &mdash; ssh prod-app-01
          </div>
          {/* Tab indicator */}
          <div style={{
            fontSize: 9,
            color: 'rgba(var(--sand-100-rgb),0.20)',
            background: 'rgba(var(--sand-100-rgb),0.04)',
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 500,
          }}>
            bash
          </div>
        </div>

        {/* Terminal body */}
        <div style={{
          padding: '14px 16px 24px',
          height: 360,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {lines.map((line, i) => {
            if (line.type === 'command') {
              return (
                <div key={i} style={{
                  animation: 'termFadeIn 0.25s ease-out both',
                  marginBottom: 2,
                  lineHeight: 1.7,
                  fontSize: 12,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}>
                  <span style={{ color: 'rgba(var(--sand-100-rgb),0.45)' }}>maria@</span>
                  <span style={{ color: C.warmGold }}>prod-app-01</span>
                  <span style={{ color: 'rgba(var(--sand-100-rgb),0.45)' }}>:~$ </span>
                  <span style={{ color: C.command }}>{line.text}</span>
                  {line.typing && (
                    <span style={{
                      display: 'inline-block',
                      width: 7,
                      height: 14,
                      background: C.command,
                      marginLeft: 1,
                      verticalAlign: 'text-bottom',
                      opacity: cursorVisible ? 1 : 0,
                    }} />
                  )}
                </div>
              );
            }

            if (line.type === 'output-plain') {
              return (
                <div key={i} style={{
                  animation: line.fadeIn ? 'termFadeIn 0.3s ease-out both' : undefined,
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: 'rgba(var(--sand-100-rgb),0.5)',
                  whiteSpace: 'pre-wrap',
                  marginBottom: 1,
                }}>
                  {line.text}
                </div>
              );
            }

            if (line.type === 'output') {
              return (
                <div key={i} style={{
                  animation: line.fadeIn ? 'termFadeIn 0.3s ease-out both' : undefined,
                  fontSize: 12,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  marginBottom: 1,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                }}>
                  <span style={{ color: 'rgba(var(--sand-100-rgb),0.5)' }}>{line.prefix}</span>
                  {line.fields.map((f, fi) => {
                    const isMasked = f.state === 'masked';
                    const isPassthrough = f.raw === f.masked;
                    if (isPassthrough) {
                      return (
                        <span key={fi} style={{ color: 'rgba(var(--sand-100-rgb),0.5)' }}>{f.raw}</span>
                      );
                    }
                    return (
                      <span key={fi} style={{ position: 'relative', display: 'inline' }}>
                        <span style={{
                          color: isMasked ? C.warmGold : C.rawFlash,
                          fontWeight: isMasked ? 600 : 400,
                          transition: 'color 0.15s ease, font-weight 0.15s ease',
                        }}>
                          {isMasked ? f.masked : f.raw}
                        </span>
                        {isMasked && fi === 0 && (
                          <span style={{
                            display: 'inline-block',
                            marginLeft: 4,
                            fontSize: 9,
                            color: C.warmGold,
                            opacity: 0.7,
                            animation: 'badgePulse 0.6s ease-out',
                            verticalAlign: 'middle',
                          }}>
                            &#x26C9;
                          </span>
                        )}
                        {fi < line.fields.length - 1 && !isPassthrough && (
                          <span style={{ color: 'rgba(var(--sand-100-rgb),0.5)' }}>,</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              );
            }

            if (line.type === 'status') {
              return (
                <div key={i} style={{
                  animation: 'termFadeIn 0.4s ease-out both',
                  fontSize: 10,
                  lineHeight: 1.7,
                  color: C.dimText,
                  marginTop: 6,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: C.warmGold,
                    opacity: 0.6,
                    flexShrink: 0,
                  }} />
                  <span>&#x26C9; {line.text}</span>
                </div>
              );
            }

            return null;
          })}

          {/* Blinking cursor on empty prompt at the end when not typing */}
          {lines.length > 0 && !lines[lines.length - 1]?.typing && lines[lines.length - 1]?.type !== 'command' && (
            <div style={{
              fontSize: 12,
              lineHeight: 1.7,
              marginTop: lines[lines.length - 1]?.type === 'status' ? 0 : 2,
            }}>
              <span style={{ color: 'rgba(var(--sand-100-rgb),0.45)' }}>maria@</span>
              <span style={{ color: C.warmGold }}>prod-app-01</span>
              <span style={{ color: 'rgba(var(--sand-100-rgb),0.45)' }}>:~$ </span>
              <span style={{
                display: 'inline-block',
                width: 7,
                height: 14,
                background: C.command,
                verticalAlign: 'text-bottom',
                opacity: cursorVisible ? 1 : 0,
              }} />
            </div>
          )}

          {/* Bottom fade gradient */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            background: `linear-gradient(to bottom, transparent, ${C.termBg})`,
            pointerEvents: 'none',
          }} />
        </div>
      </div>
    </>
  );
}
