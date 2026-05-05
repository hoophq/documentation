/**
 * WireLevelInterception — Static diagram showing how a single connection
 * is intercepted, parsed, and policy-checked inside the Hoop gateway.
 *
 * Mirrors the "Wire-level interception" reference diagram: request path
 * (TLS -> Identity -> Policy Engine), response path (Decode -> Chunked
 * inspection -> PII classifier -> Redact + re-encode), an example query,
 * and bottom stats.
 */

export const WireLevelInterception = () => {
  const colors = {
    bg: '#0E0E0E',
    panel: 'rgba(255,255,255,0.03)',
    panelBorder: 'rgba(255,255,255,0.08)',
    box: 'rgba(255,255,255,0.06)',
    boxBorder: 'rgba(255,255,255,0.10)',
    text: 'rgba(255,255,255,0.92)',
    textDim: 'rgba(255,255,255,0.55)',
    textFaint: 'rgba(255,255,255,0.35)',
    accent: 'rgba(255,255,255,0.85)',
  };

  const Box = ({ title, sub, minWidth = 110 }) => (
    <div style={{
      background: colors.box,
      border: `1px solid ${colors.boxBorder}`,
      borderRadius: 8,
      padding: '10px 14px',
      minWidth,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
  );

  const Arrow = ({ dir = 'right' }) => (
    <div style={{
      color: colors.textFaint,
      fontSize: 18,
      lineHeight: 1,
      padding: '0 6px',
      userSelect: 'none',
    }}>
      {dir === 'right' ? '→' : '←'}
    </div>
  );

  const Endpoint = ({ label, lines }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 96,
      padding: '20px 12px',
      background: colors.box,
      border: `1px solid ${colors.boxBorder}`,
      borderRadius: 8,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.12em',
        color: colors.textDim,
        textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 12, color: colors.textDim, textAlign: 'center', lineHeight: 1.6 }}>
        {lines.map((l) => <div key={l} style={{ fontFamily: 'var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace)' }}>{l}</div>)}
      </div>
    </div>
  );

  const SectionLabel = ({ children }) => (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginBottom: 10,
    }}>{children}</div>
  );

  return (
    <div style={{
      background: colors.bg,
      borderRadius: 14,
      padding: '32px 28px 28px',
      color: colors.text,
      fontFamily: 'var(--sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif)',
    }}>
      {/* Header */}
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: colors.textFaint,
        marginBottom: 8,
      }}>Wire-level interception</div>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, marginBottom: 10 }}>
        What happens to a single connection inside the gateway
      </div>
      <div style={{ fontSize: 14, color: colors.textDim, maxWidth: 720, lineHeight: 1.5, marginBottom: 28 }}>
        Every box is a programmable interception point. Policy is written against parsed protocol messages,
        not raw bytes. No schema catalog required.
      </div>

      {/* Main flow */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <Endpoint label="User" lines={['psql', 'ssh']} />

        {/* Gateway panel */}
        <div style={{
          flex: 1,
          minWidth: 480,
          background: colors.panel,
          border: `1px solid ${colors.panelBorder}`,
          borderRadius: 10,
          padding: '16px 16px 18px',
        }}>
          <SectionLabel>Hoop Gateway</SectionLabel>

          {/* Request path */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textFaint, marginBottom: 10 }}>
            Request path
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginBottom: 18 }}>
            <Box title="TLS" sub="protocol decode" />
            <Arrow />
            <Box title="Identity" sub="SSO, session" />
            <Arrow />
            <div style={{
              flex: 1,
              minWidth: 280,
              background: colors.panel,
              border: `1px solid ${colors.panelBorder}`,
              borderRadius: 8,
              padding: '12px 14px',
            }}>
              <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textDim }}>
                Policy engine
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: colors.textFaint, marginTop: 2, marginBottom: 10 }}>
                parsed op, evaluated in-line
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Box title="Just-in-time" sub="approval, TTL" minWidth={0} />
                <Box title="Guardrails" sub="deterministic rules" minWidth={0} />
                <Box title="AI analysis" sub="live LLM, intent" minWidth={0} />
                <Box title="Data masking" sub="PII classifier" minWidth={0} />
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: colors.textDim, marginTop: 10 }}>
                allow / block / transform / review
              </div>
            </div>
          </div>

          {/* Response path */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textFaint, marginBottom: 10 }}>
            Response path
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <Box title="Redact + re-encode" />
            <Arrow dir="left" />
            <Box title="PII classifier" />
            <Arrow dir="left" />
            <Box title="Chunked inspection" />
            <Arrow dir="left" />
            <Box title="Decode" />
          </div>
        </div>

        <Endpoint label="Resource" lines={['Postgres', 'Linux host']} />
      </div>

      {/* Example */}
      <div style={{
        marginTop: 24,
        background: colors.panel,
        border: `1px solid ${colors.panelBorder}`,
        borderRadius: 10,
        padding: '16px 18px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textFaint, marginBottom: 12 }}>
          Example: <span style={{ fontFamily: 'var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace)', color: colors.textDim, letterSpacing: '0' }}>SELECT email, ssn FROM users LIMIT 1</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textFaint, marginBottom: 6 }}>To user</div>
            <div style={{
              background: '#000',
              border: `1px solid ${colors.panelBorder}`,
              borderRadius: 6,
              padding: '10px 12px',
              fontFamily: 'var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
              fontSize: 12,
              color: colors.text,
            }}>
              m▮▮▮@uber.com  |  ▮▮▮-▮▮-▮▮▮▮
              <div style={{ fontSize: 10, color: colors.textFaint, marginTop: 4, fontFamily: 'inherit' }}>redacted, query completes</div>
            </div>
          </div>
          <div style={{ color: colors.textFaint, fontSize: 22 }}>←</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.textFaint, marginBottom: 6 }}>From resource</div>
            <div style={{
              background: '#000',
              border: `1px solid ${colors.panelBorder}`,
              borderRadius: 6,
              padding: '10px 12px',
              fontFamily: 'var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
              fontSize: 12,
              color: colors.text,
            }}>
              meng@uber.com  |  123-45-6789
              <div style={{ fontSize: 10, color: colors.textFaint, marginTop: 4, fontFamily: 'inherit' }}>raw row from postgres</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        marginTop: 24,
        paddingTop: 18,
        borderTop: `1px solid ${colors.panelBorder}`,
        display: 'flex',
        gap: 48,
        flexWrap: 'wrap',
      }}>
        {[
          { n: '<5ms', label: 'proxy overhead' },
          { n: '~20ms', label: 'added with full inspection' },
          { n: '0', label: 'schema catalog required' },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: colors.text }}>{s.n}</div>
            <div style={{ fontSize: 12, color: colors.textDim, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
