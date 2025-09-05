export const ConnectionTemplate = ({ config }) => {
  // Default configuration if none provided
  const defaultConfig = {
    name: "Connection",
    description: "Connection description",
    features: {
      tlsTerminationProxy: { native: false, oneOff: false },
      audit: { native: false, oneOff: false },
      dataMaskingGoogleDLP: { native: false, oneOff: false },
      dataMaskingMSPresidio: { native: false, oneOff: false },
      credentialsOffload: { native: false, oneOff: false },
      interactiveAccess: { native: false, oneOff: false }
    }
  };

  // Merge provided config with defaults
  const finalConfig = Object.assign({}, defaultConfig, config);

  // Helper function to render icon
  const renderIcon = (enabled) => {
    return enabled ? <Icon icon="check" /> : <Icon icon="xmark" />;
  };

  return (
    <div>
      <h2>Before you start</h2>
      <p>To get the most out of this guide, you will need to:</p>
      <ul>
        <li>Either <a href="https://use.hoop.dev">create an account in our managed instance</a> or <a href="/getting-started/installation/overview">deploy your own hoop.dev instance</a></li>
        <li>You must be your account administrator to perform the following commands</li>
      </ul>

      {finalConfig.requirements && 
        <>
          <h2>Requirements</h2>
          <p>{finalConfig.requirements.description}</p>
          {finalConfig.requirements.items && <ul>
            {finalConfig.requirements.items.map((item) => (
              <li>{item}</li>
            ))}
          </ul>}
        </>}

      <h2>Features</h2>
      <p>The table below outlines the features available for this type of connection.</p>
      
      <ul>
        <li><strong>Native</strong> - This refers to when a database client connects through a specific protocol, such as an IDE or client libraries through <code>hoop connect &lt;connection-name&gt;</code>.</li>
        <li><strong>One Off</strong> - This term refers to accessing this connection from hoop web panel.</li>
      </ul>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Native</th>
            <th>One Off</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TLS Termination Proxy</td>
            <td>{renderIcon(finalConfig.features?.tlsTerminationProxy?.native)}</td>
            <td>{renderIcon(finalConfig.features?.tlsTerminationProxy?.oneOff)}</td>
            <td>The local proxy terminates the connection with TLS, enabling the connection with the remote server to be TLS encrypted.</td>
          </tr>
          <tr>
            <td>Audit</td>
            <td>{renderIcon(finalConfig.features?.audit?.native)}</td>
            <td>{renderIcon(finalConfig.features?.audit?.oneOff)}</td>
            <td>The gateway stores and audits the queries being issued by the client.</td>
          </tr>
          <tr>
            <td>Data Masking (Google DLP)</td>
            <td>{renderIcon(finalConfig.features?.dataMaskingGoogleDLP?.native)}</td>
            <td>{renderIcon(finalConfig.features?.dataMaskingGoogleDLP?.oneOff)}</td>
            <td>A policy can be enabled to mask sensitive fields dynamically when performing queries in the database.</td>
          </tr>
          <tr>
            <td>Data Masking (MS Presidio)</td>
            <td>{renderIcon(finalConfig.features?.dataMaskingMSPresidio?.native)}</td>
            <td>{renderIcon(finalConfig.features?.dataMaskingMSPresidio?.oneOff)}</td>
            <td>A policy can be enabled to mask sensitive fields dynamically when performing queries in the database.</td>
          </tr>
          <tr>
            <td>Credentials Offload</td>
            <td>{renderIcon(finalConfig.features?.credentialsOffload?.native)}</td>
            <td>{renderIcon(finalConfig.features?.credentialsOffload?.oneOff)}</td>
            <td>The user authenticates via SSO instead of using database credentials.</td>
          </tr>
          <tr>
            <td>Interactive Access</td>
            <td>{renderIcon(finalConfig.features?.interactiveAccess?.native)}</td>
            <td>{renderIcon(finalConfig.features?.interactiveAccess?.oneOff)}</td>
            <td>Interactive access is available when using an IDE or connecting via a terminal to perform analysis exploration.</td>
          </tr>
        </tbody>
      </table>

      {finalConfig.gatewayInformation.credentials && 
      <>
      <h2>Configuration</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(finalConfig.gatewayInformation.credentials).map(([key, credential]) => {
            // Skip non-credential fields like 'config'
            if (typeof credential === 'string' || credential.hidden) return null;
            
            return (
              <tr key={key}>
                <td>{credential.name}</td>
                <td>{credential.type}</td>
                <td>{credential.required ? 'yes' : 'no'}</td>
                <td>
                  {credential.description?.split(/(\[[^\]]+\]\([^)]+\))/).map((part, index) => {
                    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (linkMatch) {
                      return <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>;
                    }
                    return part;
                  })}
                </td>
              </tr>
            );
          }).filter(Boolean)}
        </tbody>
      </table>
      </>}
    </div>
  );
};
