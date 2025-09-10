# Data Model: Next.js TypeScript Project Setup

**Date**: 2025-09-10  
**Feature**: Next.js TypeScript Project with Cloudflare Pages CI/CD  
**Status**: Phase 1 - Data Model Design

## Core Entities

### 1. Project Configuration Entity

**Purpose**: Represents the Next.js TypeScript project configuration
**State**: File-based configuration stored in repository

**Fields**:
- `name`: Project identifier (string, required)
- `version`: Semantic version number (string, required, format: MAJOR.MINOR.PATCH)
- `dependencies`: NPM package dependencies (object, required)
- `scripts`: Build and development commands (object, required)
- `typescript`: TypeScript compiler configuration (object, required)
- `nextConfig`: Next.js framework configuration (object, required)
- `eslintConfig`: Code linting rules (object, required)

**Validation Rules**:
- Name must be valid NPM package name
- Version must follow semantic versioning
- Required scripts: dev, build, start, lint, type-check
- TypeScript strict mode must be enabled
- Next.js experimental features must be explicitly configured

**File Manifestations**:
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `next.config.js`: Next.js settings
- `.eslintrc.json`: ESLint rules

### 2. Repository Entity

**Purpose**: Git repository with branch structure for deployment pipeline
**State**: Version-controlled with remote origin on GitHub

**Fields**:
- `branches`: Array of branch objects (required)
  - `main`: Production branch (protected)
  - `staging`: Pre-production branch (protected)
  - `feature/*`: Feature development branches
- `protectionRules`: Branch protection configuration (object, required)
- `remoteUrl`: GitHub repository URL (string, required)
- `deploymentKeys`: Cloudflare integration keys (object, optional)

**Validation Rules**:
- Main and staging branches must exist
- Protection rules must require PR reviews
- Protection rules must require status checks
- Remote origin must be GitHub repository
- .gitignore must exclude node_modules, .next, .env*

**State Transitions**:
1. Initialize → Local repository created
2. Connect → Remote GitHub repository linked
3. Protect → Branch protection rules applied
4. Deploy-Ready → Cloudflare integration complete

### 3. Build Pipeline Entity

**Purpose**: Automated build and deployment process
**State**: Triggered by Git push events

**Fields**:
- `trigger`: Event that starts build (git push, PR creation)
- `commands`: Array of build steps (required)
- `environment`: Build environment variables (object)
- `status`: Current build status (pending|success|failure)
- `artifacts`: Generated build outputs (array)
- `logs`: Build execution logs (array)

**Validation Rules**:
- TypeScript compilation must succeed
- ESLint checks must pass
- Build output must be generated successfully
- No build errors or warnings for production builds

**State Transitions**:
1. Triggered → Build process initiated
2. Running → Commands executing
3. Success → Build completed, artifacts ready
4. Failure → Build failed, logs available
5. Deployed → Artifacts deployed to Cloudflare

### 4. Deployment Environment Entity

**Purpose**: Cloudflare Pages hosting environment
**State**: Live deployment accessible via URL

**Fields**:
- `environment`: Deployment target (production|staging|preview)
- `url`: Accessible deployment URL (string, required)
- `branch`: Source Git branch (string, required)
- `buildId`: Unique build identifier (string, required)
- `status`: Deployment status (active|failed|rolled-back)
- `deployedAt`: Deployment timestamp (datetime, required)
- `previousDeployment`: Previous deployment reference (optional)

**Validation Rules**:
- Production deployments only from main branch
- Staging deployments only from staging branch
- Preview deployments from feature branches
- Each deployment must have unique build ID
- URLs must be accessible and return 200 status

**State Transitions**:
1. Building → Deployment in progress
2. Active → Deployment live and accessible
3. Failed → Deployment unsuccessful
4. Rolled-back → Previous deployment restored

## Entity Relationships

```
Project Configuration → Repository (1:1)
Repository → Build Pipeline (1:many)
Build Pipeline → Deployment Environment (1:1)
Deployment Environment → Previous Deployment (0:1)
```

## Data Validation Requirements

### Project Setup Phase:
1. Valid Next.js project structure created
2. TypeScript configuration passes strict checking
3. All required dependencies installed
4. Build scripts execute successfully

### Repository Integration Phase:
1. Git repository initialized with proper .gitignore
2. GitHub remote repository connected
3. Branch protection rules applied
4. Initial commit pushed to main branch

### Deployment Pipeline Phase:
1. Cloudflare Pages project created and connected
2. Build commands configured correctly
3. Environment variables set appropriately
4. Custom domain configured (if applicable)

### Operational Phase:
1. Automated deployments triggered by Git pushes
2. Build failures reported with detailed logs
3. Successful deployments accessible at configured URLs
4. Rollback capability verified

## Configuration Files Schema

### package.json Requirements:
```json
{
  "name": "required-string",
  "version": "semver-string",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

### tsconfig.json Requirements:
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

This data model ensures type safety, proper configuration management, and reliable deployment pipeline operation.