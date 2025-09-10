# Claude Code Context

## Project Overview

**Project**: Next.js TypeScript Project with Cloudflare Pages CI/CD  
**Type**: Web application with automated deployment pipeline  
**Status**: Implementation planning complete  
**Branch**: `001-create-a-new`

## Technology Stack

**Core Technologies:**
- **Next.js 14.x**: React framework with App Router
- **TypeScript 5.x**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code linting and quality checks

**Infrastructure:**
- **GitHub**: Source code management with branch protection
- **Cloudflare Pages**: Static site hosting and deployment
- **Node.js 18+**: Runtime environment
- **npm**: Package management

## Project Structure

```
cpaonweb-project/
├── src/
│   └── app/                 # Next.js App Router directory
│       ├── layout.tsx       # Root layout component
│       ├── page.tsx         # Home page component
│       └── globals.css      # Global styles
├── public/                  # Static assets
├── specs/                   # Feature specifications and planning
│   └── 001-create-a-new/   # Current feature implementation
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── .eslintrc.json         # ESLint configuration
```

## Development Workflow

### Branch Strategy
- **main**: Production deployments (cpaonweb.com)
- **staging**: Pre-production testing (staging.cpaonweb.com)  
- **feature/***: Feature development (preview deployments)

### Commands
```bash
npm run dev         # Start development server
npm run build       # Production build
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # TypeScript compilation check
```

### Deployment Pipeline
1. Push to feature branch → Preview deployment
2. PR to staging → Staging environment deployment
3. PR to main → Production deployment
4. All deployments automatic via Cloudflare Pages

## Configuration Files

### package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start", 
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### TypeScript Configuration
- Strict mode enabled
- App Router compatibility
- Path aliases configured (@/*)

### ESLint Configuration  
- Next.js recommended rules
- TypeScript integration
- Automatic formatting support

## Coding Standards

### TypeScript Guidelines
- Use strict type checking
- Prefer interfaces over type aliases for object shapes
- Use proper return types for functions
- Leverage Next.js built-in types

### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

export default function Component({ title, children }: ComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### Styling Approach
- Tailwind CSS utility classes preferred
- Component-scoped CSS modules when needed
- Responsive design mobile-first

## CI/CD Pipeline

### Build Process
1. **Install**: `npm ci`
2. **Type Check**: `npm run type-check`
3. **Lint**: `npm run lint`
4. **Build**: `npm run build`
5. **Deploy**: Cloudflare Pages deployment

### Environment Variables
- `NODE_ENV`: production/development
- `NEXT_TELEMETRY_DISABLED`: 1
- Custom variables as needed

### Status Checks
- build: Must pass for deployment
- type-check: Must pass for protected branches
- lint: Must pass for protected branches

## Current Implementation Status

### Completed (Phase 0-1):
- ✅ Project specifications and requirements analysis
- ✅ Technical research and technology stack decisions  
- ✅ Data model design and entity relationships
- ✅ API contracts and pipeline specifications
- ✅ Manual setup documentation
- ✅ Feature documentation and troubleshooting guides
- ✅ Quickstart guide for rapid deployment

### Next Steps (Phase 2-3):
- 📋 Task breakdown and implementation planning (/tasks command)
- 🚧 Repository initialization and Next.js project setup
- 🔧 GitHub branch protection configuration
- ☁️ Cloudflare Pages integration and deployment
- 🧪 End-to-end workflow testing and validation

## Key Considerations for Claude Code

### When Working on This Project:
1. **Always check TypeScript**: Run `npm run type-check` before commits
2. **Maintain code quality**: ESLint rules are enforced via CI/CD
3. **Follow branch protection**: Use PRs for main and staging branches
4. **Test deployments**: Verify preview deployments work correctly
5. **Document changes**: Update relevant documentation files

### Common Commands You May Need:
```bash
# Setup new feature branch
git checkout -b feature/[feature-name]

# Install dependencies after pulling changes
npm install

# Check for issues before pushing
npm run type-check && npm run lint && npm run build

# Create pull request (requires GitHub CLI)
gh pr create --title "Feature title" --body "Description"
```

### File Locations for Quick Reference:
- **Specifications**: `/specs/001-create-a-new/`
- **Source Code**: `/src/app/`
- **Configuration**: Root directory (package.json, tsconfig.json, etc.)
- **Documentation**: `/specs/001-create-a-new/manual-setup.md` and `feature-documentation.md`

### Dependencies to Know About:
- **Next.js**: Web application framework
- **React**: Component library
- **TypeScript**: Type system
- **Tailwind CSS**: Styling framework
- **ESLint**: Code linting

---

**Last Updated**: 2025-09-10  
**Feature Branch**: 001-create-a-new  
**Next Review**: After /tasks command execution