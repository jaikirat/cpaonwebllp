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
- **Tailwind CSS**: Utility-first CSS framework with design tokens
- **shadcn/ui + Radix UI**: Accessible component primitives
- **ESLint**: Code linting and quality checks

**Infrastructure:**
- **GitHub**: Source code management with branch protection
- **Cloudflare Pages**: Static site hosting and deployment
- **Node.js 18+**: Runtime environment
- **npm**: Package management

**Testing:**
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing

## Project Structure

```
cpaonweb-project/
├── src/
│   ├── app/                 # Next.js App Router directory
│   │   ├── layout.tsx       # Root layout component
│   │   ├── page.tsx         # Home page component
│   │   ├── sandbox/         # Component preview page
│   │   └── globals.css      # Global styles
│   └── components/
│       └── ui/              # Design system components
├── public/                  # Static assets
├── specs/                   # Feature specifications and planning
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS with design tokens
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
npm run test        # Run Jest unit tests
npm run test:e2e    # Run Playwright E2E tests
```

### Deployment Pipeline
1. Push to feature branch → Preview deployment
2. PR to staging → Staging environment deployment
3. PR to main → Production deployment
4. All deployments automatic via Cloudflare Pages

## Configuration Files
- **TypeScript**: Strict mode, App Router compatibility, path aliases (@/*)
- **ESLint**: Next.js recommended rules with TypeScript integration
- **Tailwind**: Design tokens via CSS custom properties

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
- Tailwind CSS utility classes with design tokens via CSS custom properties
- shadcn/ui components for consistent UI patterns
- Component-scoped CSS modules when needed
- Responsive design mobile-first

## CI/CD Pipeline
**Build Process**: npm ci → type-check → lint → build → Cloudflare Pages deployment
**Status Checks**: build, type-check, lint must pass for protected branches
**Environment**: NODE_ENV, NEXT_TELEMETRY_DISABLED=1

## Current Implementation Status

### Completed (Phase 0-1):
✅ Project specifications, technical research, data models, API contracts, manual setup documentation, feature documentation, quickstart guide, design system planning

### Next Steps (Phase 2-3):
Task breakdown, repository initialization, GitHub branch protection, Cloudflare Pages integration, end-to-end workflow testing

## Key Considerations for Claude Code

### When Working on This Project:
1. Always check TypeScript: `npm run type-check` before commits
2. Maintain code quality: ESLint rules enforced via CI/CD
3. Follow branch protection: Use PRs for main and staging branches
4. Test deployments: Verify preview deployments work correctly

### Common Commands:
```bash
git checkout -b feature/[name]  # Create feature branch
npm run type-check && npm run lint && npm run build  # Pre-commit checks
gh pr create --title "Title" --body "Description"    # Create PR
```

### File Locations for Quick Reference:
- **Specifications**: `/specs/001-create-a-new/`
- **Source Code**: `/src/app/`
- **Design System**: `/src/components/ui/`
- **Component Preview**: `/src/app/sandbox/`
- **Configuration**: Root directory (package.json, tsconfig.json, etc.)

### Dependencies to Know About:
- **Next.js**: Web application framework
- **React**: Component library
- **TypeScript**: Type system
- **Tailwind CSS**: Styling framework with design tokens
- **shadcn/ui + Radix UI**: Accessible component primitives
- **Jest + React Testing Library**: Testing framework
- **ESLint**: Code linting

---

**Last Updated**: 2025-09-13
**Feature Branch**: 001-create-a-new
**Recent Changes**: Added design system implementation details
**Next Review**: After /tasks command execution