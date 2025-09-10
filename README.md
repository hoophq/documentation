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

### Decap CMS (Development)

To use CMS in development:

```bash
# Initialize Decap server
npx decap-server

# Access admin at
# http://localhost:3000/admin
```

## 📝 Contributing

1. **CMS Editing**: Use `/admin` interface to edit content
2. **Connection Templates**: Use `store/connections/*.yml` for connection configurations

### ⚠️ Important: Quickstart Connection Guides

**Quickstart MDX files related to connections should NOT be edited directly.** Instead:

- **Edit via Decap CMS**: Use `/admin` interface to modify connection configurations
- **Edit YAML templates**: Modify files in `store/connections/*.yml` directly
- **Run processing script**: After YAML changes, run `npm run process-connections`

The connection quickstarts (like `quickstart/databases/postgres.mdx`) are generated from YAML templates and use the `ConnectionTemplate` component. Direct edits to these MDX files will be overwritten.

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
