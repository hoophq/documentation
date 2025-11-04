# Hoop.dev Documentation

This documentation is built with [Mintlify](https://mintlify.com) and uses [Decap CMS](https://decapcms.org) for content management.

## 📁 Project Structure

```
documentation/
├── docs.json              # Mintlify configuration
├── admin/                 # Decap CMS interface
├── clients/               # Client documentation (CLI, Web App)
├── concepts/              # Core concepts
├── integrations/          # Available integrations
├── quickstart/            # Quick start guides
├── setup/                 # Configuration and deployment
├── store/                 # Connection templates and data
└── scripts/               # Automation scripts
```

## 🚀 Development

### Prerequisites

- [Node.js](https://nodejs.org) (v16+)
- [Mintlify CLI](https://www.mintlify.com/docs/installation)

### Installation

```bash
# Install dependencies
npm install

# Install Mintlify CLI globally
npm i -g mint
```

### Available Scripts

```bash
# Development server
npm run dev

# Build documentation
npm run build

# Process connection templates
npm run process-connections
```

- Access the development server documentation at [http://localhost:3000/docs](http://localhost:3000/docs)

### Decap CMS (Development)

To use CMS in development:

```bash
# start development server at port 3000
npm run dev

# Initialize the Decap server
npx decap-server
```

- Login to decap admin page in the development server at [http://localhost:3000/admin](http://localhost:3000/admin)
- View the documentation page at [http://localhost:3000/docs](http://localhost:3000/docs)

## 📝 Contributing

1. **CMS Editing**: Use `/admin` interface to edit content
2. **Connection Templates**: Use `store/connections/*.yml` for connection configurations
3. **Run processing script**: After YAML changes, run `npm run process-connections`
4. Visit the documentation to see if the connection is available in the proper section
5. Test it by replacing the `store/connections.json` to a Webapp dev instance. See the [Webapp Docs](https://github.com/hoophq/hoop/tree/main/webapp#decap) for more information.
6. Create a PR and merge to the `main` branch
7. Create a new [product release](https://github.com/hoophq/hoop/blob/main/DEV.md#how-to-create-a-new-release)

The changes will be available in the next release on the Webapp

### ⚠️ Important: Quickstart Connection Guides

**Quickstart MDX files related to connections should NOT be edited directly.**

- **Edit via Decap CMS**: Use `/admin` interface to modify connection configurations

Or

- **Edit YAML templates**: Modify files in `store/connections/*.yml` directly

The connection quickstarts (like `quickstart/databases/postgres.mdx`) are generated from YAML templates and use the `ConnectionTemplate` component. Direct edits to these MDX files will be overwritten.

> The section in the sidebar is not automated. Make sure to include the navigation in the `docs.json` file for your new connection.

## 🔧 Important Configurations

- **Theme**: Configured in `docs.json`
- **Navigation**: Structured in `docs.json > navigation`
- **Redirects**: Configured in `_redirects`
- **Templates**: Connections in `store/connections/`

## 📚 Resources

- [Mintlify Documentation](https://mintlify.com/docs)
- [Decap CMS Guide](https://decapcms.org/docs/)
- [Hoop.dev Website](https://hoop.dev)

---

🐛 **Issues?** Make sure you're running in a folder with `docs.json`
