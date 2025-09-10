# CPA On Web LLP

A modern, high-performance website for CPA On Web LLP built with Next.js, TypeScript, and Tailwind CSS, featuring automated CI/CD deployment through Cloudflare Pages.

## 🚀 Technology Stack

- **Framework**: [Next.js 15.5.2](https://nextjs.org) with App Router
- **Runtime**: React 19.1.0
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org) with strict type checking
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com) with PostCSS
- **Code Quality**: [ESLint 9.x](https://eslint.org) with Next.js and TypeScript rules
- **Testing**: [Jest 29.x](https://jestjs.io) with TypeScript support
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com) with automatic CI/CD
- **Version Control**: Git with GitHub integration

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control

Check your versions:
```bash
node --version
npm --version
git --version
```

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cpaonwebllp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (if needed):
   ```bash
   cp .env.test.example .env.local
   # Edit .env.local with your configuration
   ```

## 🏃 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `http://localhost:3000` |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint code analysis |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

### Development Workflow

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Before committing, run quality checks**:
   ```bash
   npm run type-check && npm run lint && npm run build
   ```

## 📁 Project Structure

```
cpaonwebllp/
├── src/
│   └── app/                    # Next.js App Router
│       ├── layout.tsx          # Root layout component
│       ├── page.tsx            # Home page
│       ├── globals.css         # Global styles
│       └── favicon.ico         # Site favicon
├── public/                     # Static assets
├── tests/                      # Test files
│   ├── integration/            # Integration tests
│   └── contract/               # Contract tests
├── specs/                      # Feature specifications
├── scripts/                    # Build and utility scripts
├── .next/                      # Next.js build output
├── out/                        # Static export output
├── node_modules/               # Dependencies
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── eslint.config.js            # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
├── jest.config.cjs             # Jest test configuration
└── .gitignore                  # Git ignore rules
```

### Key Configuration Files

- **`tsconfig.json`**: TypeScript configuration with strict type checking and path aliases
- **`next.config.js`**: Next.js configuration optimized for Cloudflare Pages static export
- **`eslint.config.js`**: Comprehensive ESLint rules for code quality and consistency
- **`package.json`**: Project metadata, dependencies, and npm scripts

## 🚀 Deployment

This project uses **Cloudflare Pages** for hosting with automatic CI/CD deployment:

### Automatic Deployment

- **Production**: Pushes to `master` branch deploy to `https://cpaonweb.com`
- **Staging**: Pushes to `staging` branch deploy to `https://staging.cpaonweb.com`  
- **Preview**: Feature branches create preview deployments

### Build Configuration

The project is configured for static export (`output: 'export'`) to work optimally with Cloudflare Pages:

- **Build Command**: `npm run build`
- **Output Directory**: `out/`
- **Node.js Version**: 18.x
- **Build Environment**: Production optimizations enabled

### Manual Deployment

```bash
# Create production build
npm run build

# The 'out' directory contains the static site ready for deployment
```

## 🌍 Environment Variables

Environment variables are managed through `.env` files:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | No |
| `PRODUCTION_URL` | Production site URL | No |
| `STAGING_URL` | Staging site URL | No |

Copy `.env.test.example` to `.env.local` and configure as needed.

## 🌿 Branch Strategy

This project follows a structured branching model:

- **`master`**: Production-ready code (protected branch)
  - Deploys to: `https://cpaonweb.com`
  - Requires: Pull request with passing checks

- **`staging`**: Pre-production testing (protected branch)  
  - Deploys to: `https://staging.cpaonweb.com`
  - Requires: Pull request with passing checks

- **`feature/*`**: Feature development branches
  - Deploys to: Preview URLs
  - Merged into: `staging` for testing

### Workflow Example

```bash
# Create feature branch
git checkout -b feature/new-contact-form

# Make changes and commit
git add .
git commit -m "Add contact form component"

# Push and create pull request
git push origin feature/new-contact-form
gh pr create --title "Add contact form" --body "Adds new contact form component"
```

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Component and utility testing with Jest
- **Integration Tests**: Full workflow testing
- **Contract Tests**: API and service contract validation
- **Type Checking**: TypeScript compilation verification

Run all tests:
```bash
npm run test
```

Run specific test suites:
```bash
npm run test:integration
npm run test:contract
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Run quality checks**: `npm run type-check && npm run lint && npm run test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: All linting rules must pass
- **Testing**: Maintain test coverage
- **Commit Messages**: Use conventional commit format

## 📄 License

This project is proprietary software owned by CPA On Web LLP. All rights reserved.

## 📞 Support

For support and inquiries:

- **Website**: [https://cpaonweb.com](https://cpaonweb.com)
- **Technical Issues**: Create an issue in the repository
- **Documentation**: See `/specs` directory for detailed specifications

---

**Built with ❤️ using Next.js, TypeScript, and Cloudflare Pages**