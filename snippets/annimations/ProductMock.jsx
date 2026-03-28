/**
 * ProductMock — Reusable product interface mock
 *
 * Used across hero, solution pages, and use-case pages.
 *
 * Props:
 *   variant  — 'database' | 'terminal' | 'kubernetes' | 'approval'
 *   masked   — boolean (default false): show warm-gold masking on database/terminal variants
 *   className
 *
 * Styleguide §4.5 — rgba transparency system on dark sections
 * Styleguide §4.6 — code block for terminal/kubernetes variants
 */

export const ProductMock = ({ variant = 'database', masked = false, className = '' }) => {
  /* ── Toolbar ─────────────────────────────────────────────────── */

  const ProductMockToolbar = ({ variant }) => {
    const titles = {
      database:   'hoop · postgres:prod',
      terminal:   'hoop · bash:bastion',
      kubernetes: 'hoop · kubectl:cluster-prod',
      approval:   '#security-alerts',
    };

    return (
      <div className="mock-toolbar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="mock-dot" />
          <div className="mock-dot" />
          <div className="mock-dot" />
        </div>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: 'rgba(var(--sand-100-rgb),0.2)',
          }}
        >
          {titles[variant] ?? ''}
        </span>
        <span style={{ width: 48 }} />
      </div>
    );
  };

  /* ── Database variant ────────────────────────────────────────── */

  const DB_ROWS = [
    { id: 1001, name: 'J. Smith',     ssn: '123-45-6789', email: 'jsmith@acme.com'     },
    { id: 1002, name: 'M. Rodriguez', ssn: '234-56-7890', email: 'mrodriguez@acme.com'  },
    { id: 1003, name: 'A. Chen',      ssn: '345-67-8901', email: 'achen@acme.com'       },
    { id: 1004, name: 'S. Patel',     ssn: '456-78-9012', email: 'spatel@acme.com'      },
  ];

  const DatabaseBody = ({ masked }) => {
    return (
      <div style={{ padding: '4px 0 8px', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--mono)',
            fontSize: 12,
          }}
        >
          <thead>
            <tr>
              <th className="db-th">id</th>
              <th className="db-th">name</th>
              <th className="db-th">ssn</th>
              <th className="db-th">email</th>
            </tr>
          </thead>
          <tbody>
            {DB_ROWS.map((row) => (
              <tr key={row.id} className="db-tr">
                <td className="db-td" style={{ color: 'rgba(var(--sand-100-rgb),0.3)' }}>
                  {row.id}
                </td>
                <td className="db-td" style={{ color: 'rgba(var(--sand-100-rgb),0.6)' }}>
                  {row.name}
                </td>
                <td
                  className="db-td"
                  style={{
                    color:      masked ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.55)',
                    fontWeight: masked ? 600 : 400,
                  }}
                >
                  {masked ? `***-**-${row.ssn.slice(-4)}` : row.ssn}
                </td>
                <td
                  className="db-td"
                  style={{
                    color:      masked ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.55)',
                    fontWeight: masked ? 600 : 400,
                  }}
                >
                  {masked ? '****@****.com' : row.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <style>{`
          .db-th {
            text-align: left;
            padding: 6px 16px;
            color: rgba(var(--sand-100-rgb), 0.25);
            font-weight: 500;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border-bottom: 1px solid rgba(var(--sand-100-rgb), 0.04);
          }

          .db-tr:not(:last-child) td {
            border-bottom: 1px solid rgba(var(--sand-100-rgb), 0.04);
          }

          .db-td {
            padding: 7px 16px;
          }
        `}</style>
      </div>
    );
  };

  /* ── Terminal variant ────────────────────────────────────────── */

  const TerminalBody = ({ masked }) => {
    const ssnColor = masked ? 'var(--warm-gold)' : 'rgba(var(--sand-100-rgb),0.55)';
    const ssnWeight = masked ? 600 : 400;

    return (
      <div className="code-block" style={{ borderRadius: 0, margin: 0 }}>
        <div>
          <span className="prompt">$ </span>
          <span className="command">hoop connect postgres:prod</span>
        </div>
        <div>
          <span className="success">&#x2713; </span>
          <span style={{ color: 'rgba(var(--sand-100-rgb),0.6)' }}>
            Connected &middot; sess_01jkx7r2nb4f &middot; alice@corp.com
          </span>
        </div>
        <div style={{ height: 8 }} />
        <div>
          <span className="prompt">psql&gt; </span>
          <span className="command">SELECT id, name, ssn FROM customers LIMIT 3;</span>
        </div>
        <div style={{ height: 6 }} />
        <div
          style={{
            color: 'rgba(var(--sand-100-rgb),0.3)',
            fontSize: 11,
            marginBottom: 3,
          }}
        >
          id &nbsp;&nbsp; name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ssn
        </div>
        <div
          style={{
            color: 'rgba(var(--sand-100-rgb),0.15)',
            fontSize: 11,
            marginBottom: 5,
          }}
        >
          ---- -------------- ------------
        </div>
        {[
          { id: '1001', name: 'J. Smith    ', raw: '123-45-6789', masked: '***-**-6789' },
          { id: '1002', name: 'M. Rodriguez', raw: '234-56-7890', masked: '***-**-7890' },
          { id: '1003', name: 'A. Chen     ', raw: '345-67-8901', masked: '***-**-8901' },
        ].map((row) => (
          <div key={row.id} style={{ color: 'rgba(var(--sand-100-rgb),0.55)' }}>
            {row.id}&nbsp;&nbsp;{row.name}&nbsp;
            <span style={{ color: ssnColor, fontWeight: ssnWeight }}>
              {masked ? row.masked : row.raw}
            </span>
          </div>
        ))}
        <div style={{ height: 8 }} />
        {masked && (
          <div style={{ color: 'rgba(var(--warm-gold-rgb),0.6)', fontSize: 11 }}>
            3 rows &middot; 3 SSN values masked by Hoop
          </div>
        )}
      </div>
    );
  };

  /* ── Kubernetes variant ──────────────────────────────────────── */

  const PODS = [
    { name: 'api-server-7d9f8b-xk2p4',   ready: '1/1', status: 'Running', age: '3d'  },
    { name: 'worker-6c8b9d-lm3q7',        ready: '1/1', status: 'Running', age: '3d'  },
    { name: 'scheduler-5f7a2c-np8r1',     ready: '1/1', status: 'Running', age: '1d'  },
    { name: 'ingress-nginx-4b6d1e-wt9s2', ready: '1/1', status: 'Running', age: '5h'  },
  ];

  const KubernetesBody = () => {
    return (
      <div className="code-block" style={{ borderRadius: 0, margin: 0 }}>
        <div>
          <span className="prompt">$ </span>
          <span className="command">kubectl get pods -n production</span>
        </div>
        <div style={{ height: 8 }} />
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            fontFamily: 'var(--mono)',
            fontSize: 12,
          }}
        >
          <thead>
            <tr>
              {['NAME', 'READY', 'STATUS', 'AGE'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    paddingRight: 20,
                    paddingBottom: 6,
                    color: 'rgba(var(--sand-100-rgb),0.25)',
                    fontWeight: 500,
                    fontSize: 10,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PODS.map((pod) => (
              <tr key={pod.name}>
                <td style={{ paddingRight: 20, paddingTop: 3, paddingBottom: 3, color: 'rgba(var(--sand-100-rgb),0.6)', whiteSpace: 'nowrap' }}>
                  {pod.name}
                </td>
                <td style={{ paddingRight: 20, color: 'rgba(var(--sand-100-rgb),0.4)' }}>
                  {pod.ready}
                </td>
                <td style={{ paddingRight: 20, color: 'var(--warm-gold)', fontWeight: 600 }}>
                  {pod.status}
                </td>
                <td style={{ color: 'rgba(var(--sand-100-rgb),0.3)' }}>
                  {pod.age}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ height: 8 }} />
        <div style={{ color: 'rgba(var(--warm-gold-rgb),0.5)', fontSize: 11 }}>
          Session recorded &middot; 4 pods &middot; identity: alice@corp.com
        </div>
      </div>
    );
  };

  /* ── Approval variant (Slack-style card) ─────────────────────── */

  const ApprovalBody = () => {
    return (
      <div className="apv-root">

        {/* Header */}
        <div className="apv-header">
          <div className="apv-avatar">H</div>
          <div>
            <div className="apv-from">Hoop Gateway</div>
            <div className="apv-time">just now</div>
          </div>
        </div>

        {/* Message */}
        <div className="apv-message">
          <strong>Approval required</strong> for a write operation
          by <strong>alice@corp.com</strong>.
        </div>

        {/* Command block */}
        <div className="apv-cmd-block">
          <div className="apv-cmd-label">Command</div>
          <div className="apv-cmd-text">
            DELETE FROM sessions WHERE expires_at &lt; NOW();
          </div>
        </div>

        {/* Meta row */}
        <div className="apv-meta">
          <span>
            <span className="apv-meta-key">Resource </span>
            postgres:prod
          </span>
          <span>
            <span className="apv-meta-key">Risk </span>
            <span className="apv-risk">medium</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="apv-actions">
          <button className="apv-btn apv-approve">Approve</button>
          <button className="apv-btn apv-deny">Deny</button>
        </div>

        <style>{`
          .apv-root {
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .apv-header {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .apv-avatar {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            background: rgba(var(--warm-gold-rgb), 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--sans);
            font-size: 12px;
            font-weight: 600;
            color: var(--warm-gold);
            flex-shrink: 0;
          }

          .apv-from {
            font-family: var(--sans);
            font-size: 13px;
            font-weight: 600;
            color: rgba(var(--sand-100-rgb), 0.75);
          }

          .apv-time {
            font-family: var(--sans);
            font-size: 11px;
            color: rgba(var(--sand-100-rgb), 0.3);
          }

          .apv-message {
            font-family: var(--sans);
            font-size: 13px;
            color: rgba(var(--sand-100-rgb), 0.55);
            line-height: 1.55;
          }

          .apv-message strong {
            color: rgba(var(--sand-100-rgb), 0.8);
            font-weight: 600;
          }

          .apv-cmd-block {
            background: rgba(var(--sand-100-rgb), 0.04);
            border: 1px solid rgba(var(--sand-100-rgb), 0.06);
            border-radius: 6px;
            padding: 10px 14px;
          }

          .apv-cmd-label {
            font-family: var(--sans);
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: rgba(var(--sand-100-rgb), 0.3);
            margin-bottom: 5px;
          }

          .apv-cmd-text {
            font-family: var(--mono);
            font-size: 12px;
            color: rgba(var(--sand-100-rgb), 0.7);
            line-height: 1.6;
          }

          .apv-meta {
            display: flex;
            gap: 20px;
            font-family: var(--sans);
            font-size: 12px;
            color: rgba(var(--sand-100-rgb), 0.55);
          }

          .apv-meta-key {
            color: rgba(var(--sand-100-rgb), 0.3);
          }

          .apv-risk {
            color: var(--warm-gold);
            font-weight: 600;
          }

          .apv-actions {
            display: flex;
            gap: 8px;
          }

          .apv-btn {
            font-family: var(--sans);
            font-size: 12px;
            font-weight: 500;
            padding: 7px 18px;
            border-radius: 6px;
            cursor: pointer;
            transition: opacity 0.15s;
            border: none;
          }

          .apv-btn:hover { opacity: 0.8; }

          .apv-approve {
            background: rgba(var(--sand-100-rgb), 0.12);
            color: rgba(var(--sand-100-rgb), 0.85);
          }

          .apv-deny {
            background: transparent;
            color: rgba(var(--sand-100-rgb), 0.4);
            border: 1px solid rgba(var(--sand-100-rgb), 0.1) !important;
          }
        `}</style>
      </div>
    );
  };

  /* ── Body router ─────────────────────────────────────────────── */

  const ProductMockBody = ({ variant, masked }) => {
    switch (variant) {
      case 'terminal':   return <TerminalBody masked={masked} />;
      case 'kubernetes': return <KubernetesBody />;
      case 'approval':   return <ApprovalBody />;
      case 'database':
      default:           return <DatabaseBody masked={masked} />;
    }
  };

  return (
    <div className={`mock-container product-mock product-mock--${variant} ${className}`}>
      <ProductMockToolbar variant={variant} />
      <ProductMockBody variant={variant} masked={masked} />

      <style>{`
        .product-mock {
          border-radius: 10px;
          overflow: hidden;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
