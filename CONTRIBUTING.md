# Contributing to CPA On Web LLP

Thank you for your interest in contributing to our Next.js TypeScript project! This document provides comprehensive guidelines for contributing to the codebase.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing Requirements](#testing-requirements)
5. [Commit Message Conventions](#commit-message-conventions)
6. [Pull Request Process](#pull-request-process)
7. [Branch Protection Rules](#branch-protection-rules)
8. [Deployment Information](#deployment-information)
9. [Issue Reporting Guidelines](#issue-reporting-guidelines)
10. [Code Review Guidelines](#code-review-guidelines)

## Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control
- **TypeScript**: Familiarity with TypeScript 5.x
- **Next.js**: Understanding of Next.js 15.x and App Router

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cpaonwebllp.git
   cd cpaonwebllp
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/cpaonwebllp.git
   ```

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Verify the installation**:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```

The application should be running at `http://localhost:3000`.

## Development Workflow

### Branch Strategy

We follow a three-tier branch strategy:

- **`master`**: Production branch (deploys to cpaonweb.com)
- **`staging`**: Pre-production testing (deploys to staging.cpaonweb.com)
- **`feature/*`**: Feature development branches (creates preview deployments)

### Workflow Steps

1. **Create a feature branch** from `staging`:
   ```bash
   git checkout staging
   git pull upstream staging
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code standards

3. **Test your changes**:
   ```bash
   npm run type-check
   npm run lint
   npm run test
   npm run build
   ```

4. **Commit your changes** using our commit conventions

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** to the `staging` branch

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/add-user-authentication`
- `fix/resolve-build-errors`
- `refactor/optimize-api-calls`
- `docs/update-contributing-guide`
- `test/add-integration-tests`

## Code Standards

### TypeScript Guidelines

Our project uses **strict TypeScript configuration** with the following requirements:

#### Type Safety
- All code must pass `tsc --noEmit` without errors
- Use explicit type annotations for function parameters and return types
- Avoid `any` type - use `unknown` or proper types instead
- Prefer `interface` over `type` for object shapes
- Use consistent type imports with `type` keyword

#### Example Component Structure
```typescript
import type { ReactNode } from 'react';

interface ComponentProps {
  title: string;
  children: ReactNode;
  isVisible?: boolean;
}

export default function Component({ 
  title, 
  children, 
  isVisible = true 
}: ComponentProps): JSX.Element {
  if (!isVisible) return null;
  
  return (
    <div className="component-wrapper">
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

#### Path Aliases
Use configured path aliases for imports:
```typescript
// Correct
import { Button } from '@/components/Button';
import { formatDate } from '@/utils/date';

// Avoid
import { Button } from '../../../components/Button';
```

### ESLint Rules

Our ESLint configuration enforces strict rules:

#### Key Rules
- **TypeScript**: Consistent type definitions, proper imports, no unused variables
- **Import Organization**: Alphabetical ordering with proper grouping
- **React/Next.js**: Hooks rules, no prop-types, accessibility standards
- **Code Quality**: No console logs (except warn/error), prefer const, use strict equality
- **Style**: Single quotes, trailing commas, proper spacing

#### Import Order
```typescript
// 1. Built-in modules
import { join } from 'path';

// 2. External packages
import { NextConfig } from 'next';
import React from 'react';

// 3. Internal modules
import { Button } from '@/components/Button';
import { api } from '@/lib/api';

// 4. Parent/sibling imports
import '../styles/globals.css';
import './component.module.css';
```

### Tailwind CSS Usage

- Use utility classes for styling
- Follow mobile-first responsive design
- Use consistent spacing and color schemes
- Group related utilities logically
- Use component-scoped CSS modules for complex styles

```tsx
// Good
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <p className="text-gray-600 leading-relaxed">Content</p>
</div>
```

### File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── [dynamic]/         # Dynamic routes
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
├── hooks/                 # Custom React hooks
└── styles/                # Additional stylesheets
```

## Testing Requirements

### Required Checks

All code must pass these checks before merging:

1. **Type Check**: `npm run type-check`
2. **Linting**: `npm run lint`
3. **Build**: `npm run build`
4. **Tests**: `npm run test`

### Test Scripts

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:integration
npm run test:contract
npm run test:contract:cloudflare
```

### Testing Guidelines

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for UI components
- Maintain test coverage above 80%
- Use descriptive test names and organize tests logically

## Commit Message Conventions

We follow the **Conventional Commits** specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: New features
- **fix**: Bug fixes
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```
feat(auth): add user authentication system

Implements JWT-based authentication with login/logout functionality.
Includes password hashing and session management.

Closes #123

fix: resolve build errors in production

- Fix TypeScript errors in user component
- Update import paths for utility functions
- Add missing type definitions

docs(readme): update installation instructions

test: add integration tests for API endpoints
```

### Scope Guidelines
- Use component names: `feat(header):`, `fix(navigation):`
- Use feature areas: `feat(auth):`, `refactor(api):`
- Keep scopes concise and consistent

## Pull Request Process

### Before Creating a PR

1. **Ensure all tests pass**:
   ```bash
   npm run type-check && npm run lint && npm run test && npm run build
   ```

2. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/staging
   ```

3. **Update documentation** if needed

### PR Template

When creating a PR, use this template:

```markdown
## Summary
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally with `npm run test`
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines (`npm run lint` passes)
- [ ] TypeScript compilation successful (`npm run type-check` passes)
- [ ] Build succeeds (`npm run build` passes)
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes without justification

## Screenshots (if applicable)
Add screenshots for UI changes.

## Related Issues
Closes #[issue number]
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Peer Review**: At least one code review required
3. **Testing**: Manual testing for UI changes
4. **Documentation**: Verify documentation is updated
5. **Final Review**: Maintainer approval required

## Branch Protection Rules

### Protected Branches

Both `master` and `staging` branches are protected with the following rules:

#### Required Status Checks
- **build**: Production build must succeed
- **type-check**: TypeScript compilation must pass
- **lint**: ESLint checks must pass
- **test**: All tests must pass

#### Additional Rules
- **Require PR reviews**: At least 1 approval required
- **Dismiss stale reviews**: When new commits are pushed
- **Require review from code owners**: For critical files
- **Restrict pushes**: Direct pushes not allowed
- **Require branches to be up to date**: Before merging

### Merge Requirements

To merge to protected branches:
1. All status checks must pass
2. At least one peer review approval
3. No unresolved review comments
4. Branch must be up to date with base branch
5. No merge conflicts

## Deployment Information

### Automatic Deployment Pipeline

Our project uses **Cloudflare Pages** for automatic deployments:

#### Deployment Triggers
- **Push to `master`**: Deploys to production (cpaonweb.com)
- **Push to `staging`**: Deploys to staging environment
- **Feature branch push**: Creates preview deployment

#### Build Configuration
```bash
# Build command
npm run build

# Output directory
out/

# Environment variables
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### Build Process
1. Install dependencies: `npm ci`
2. Type checking: `npm run type-check`
3. Linting: `npm run lint`
4. Testing: `npm run test`
5. Build: `npm run build`
6. Deploy: Cloudflare Pages deployment

### Preview Deployments

Feature branches automatically get preview deployments:
- URL format: `https://[branch-name].cpaonweb.pages.dev`
- Available for testing and review
- Automatically updated on new commits

## Issue Reporting Guidelines

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for known solutions
3. **Try the latest version** to see if issue persists

### Issue Template

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Windows 11, macOS 12]
- Node.js version: [e.g., 18.17.0]
- npm version: [e.g., 9.6.7]
- Browser: [e.g., Chrome 115, Safari 16]

**Additional Context**
Screenshots, error logs, or other relevant information.
```

### Issue Labels

Use appropriate labels when creating issues:
- **bug**: Something isn't working
- **enhancement**: New feature or request
- **documentation**: Improvements or additions to docs
- **good first issue**: Good for newcomers
- **help wanted**: Extra attention is needed
- **priority-high**: Critical issues
- **priority-low**: Nice to have features

## Code Review Guidelines

### For Authors

#### Before Requesting Review
- [ ] Code is well-tested and all tests pass
- [ ] Code follows style guidelines and passes linting
- [ ] TypeScript compilation is successful
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Commit messages are clear and follow conventions

#### During Review
- Respond promptly to feedback
- Ask for clarification on unclear comments
- Make requested changes or provide justification
- Keep discussions focused on the code

### For Reviewers

#### What to Look For
1. **Correctness**: Does the code work as intended?
2. **Performance**: Are there any performance issues?
3. **Security**: Are there security vulnerabilities?
4. **Maintainability**: Is the code readable and well-structured?
5. **Testing**: Are there adequate tests?
6. **Documentation**: Is documentation updated?

#### Review Checklist
- [ ] Code logic is sound and handles edge cases
- [ ] TypeScript types are appropriate and comprehensive
- [ ] Component structure follows established patterns
- [ ] Error handling is implemented properly
- [ ] Performance considerations are addressed
- [ ] Accessibility guidelines are followed
- [ ] Tests cover the new functionality
- [ ] Code is well-documented with comments where necessary

#### Providing Feedback
- **Be constructive**: Focus on improvement, not criticism
- **Be specific**: Point out exact lines and suggest solutions
- **Explain reasoning**: Help authors understand the "why"
- **Use GitHub review features**: Comments, suggestions, approvals
- **Acknowledge good work**: Positive feedback is valuable

#### Review Response Time
- **Initial response**: Within 24 hours
- **Full review**: Within 2-3 business days
- **Follow-up**: Respond to updates within 24 hours

### Review Categories

Use these categories to focus your review:

1. **Logic & Functionality**
   - Algorithm correctness
   - Business logic implementation
   - Edge case handling

2. **Code Quality**
   - Readability and maintainability
   - DRY principle adherence
   - Proper abstraction levels

3. **Performance**
   - Efficient algorithms
   - Memory usage
   - Bundle size impact

4. **Security**
   - Input validation
   - Data sanitization
   - Authentication/authorization

5. **Testing**
   - Test coverage
   - Test quality
   - Edge case testing

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Rules](https://eslint.org/docs/rules/)

### Development Tools
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### Project Resources
- [GitHub Issues](https://github.com/OWNER/cpaonwebllp/issues)
- [Project Board](https://github.com/OWNER/cpaonwebllp/projects)
- [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)

## Questions and Support

If you have questions about contributing:

1. Check existing [GitHub Issues](https://github.com/OWNER/cpaonwebllp/issues)
2. Create a new issue with the `question` label
3. Reach out to maintainers for guidance

Thank you for contributing to CPA On Web LLP! Your efforts help improve the project for everyone.

---

**Last Updated**: 2025-09-11  
**Version**: 1.0.0