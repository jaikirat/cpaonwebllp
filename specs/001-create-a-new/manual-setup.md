# Manual Setup Guide: Next.js TypeScript Project with Cloudflare Pages

**Document Type**: Manual Setup Instructions  
**Created**: 2025-09-10  
**For**: End users setting up the project manually

## Overview

This guide provides step-by-step instructions for manually setting up a Next.js TypeScript project with Cloudflare Pages deployment and GitHub branch protection. Follow these instructions if you need to configure the system manually or customize the setup process.

## Prerequisites

### Required Accounts
- [ ] **GitHub Account**: With repository creation permissions
- [ ] **Cloudflare Account**: Free tier is sufficient
- [ ] **Domain Registration** (Optional): For custom domain setup

### Local Environment Requirements
- [ ] **Node.js**: Version 18.0 or higher
- [ ] **npm**: Version 8.0 or higher (comes with Node.js)
- [ ] **Git**: Latest version installed and configured
- [ ] **GitHub CLI** (Optional but recommended): For easier repository management

### Verification Commands
```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 8.0.0 or higher  
git --version     # Should show installed version
gh --version      # Should show GitHub CLI version (if installed)
```

## Step 1: Project Creation

### 1.1 Create Next.js TypeScript Project

```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest cpaonweb-project \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# Navigate to project directory
cd cpaonweb-project
```

### 1.2 Verify Project Structure

Your project should have this structure:
```
cpaonweb-project/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### 1.3 Test Local Development

```bash
# Install dependencies
npm install

# Run type check
npm run type-check

# Run linting
npm run lint

# Test development server
npm run dev
```

Visit `http://localhost:3000` to verify the application loads correctly.

### 1.4 Customize Configuration (Optional)

**Update package.json scripts** (if needed):
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

**Update next.config.js** (if needed):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Only if you need static export
  trailingSlash: true,  // Optional
  images: {
    unoptimized: true  // For static export compatibility
  }
}

module.exports = nextConfig
```

## Step 2: GitHub Repository Setup

### 2.1 Initialize Local Git Repository

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit  
git commit -m "Initial Next.js TypeScript project setup"
```

### 2.2 Create GitHub Repository

**Option A: Using GitHub CLI (Recommended)**
```bash
# Create private repository and push
gh repo create cpaonweb-project --private --source=. --push

# Create staging branch
git checkout -b staging
git push -u origin staging

# Return to main branch
git checkout main
```

**Option B: Using GitHub Web Interface**
1. Go to [GitHub.com](https://github.com) and click "New repository"
2. Repository name: `cpaonweb-project`
3. Set to Private (or Public based on preference)
4. Do NOT initialize with README, .gitignore, or license
5. Click "Create repository"
6. Follow the provided instructions to push existing repository

### 2.3 Create Additional Branches

```bash
# Create and push staging branch
git checkout -b staging
git push -u origin staging

# Return to main branch  
git checkout main
```

## Step 3: Branch Protection Configuration

### 3.1 Configure Main Branch Protection

**Via GitHub Web Interface:**
1. Go to repository → Settings → Branches
2. Click "Add rule" for main branch
3. Configure settings:
   - ☑️ Require a pull request before merging
   - ☑️ Require approvals: 1
   - ☑️ Dismiss stale PR approvals when new commits are pushed
   - ☑️ Require status checks to pass before merging
   - ☑️ Require branches to be up to date before merging
   - ☑️ Restrict pushes that create files larger than 100 MB
   - ☑️ Include administrators

**Required Status Checks** (add these):
- `build`
- `type-check`  
- `lint`

### 3.2 Configure Staging Branch Protection

Repeat the same process for the `staging` branch with identical settings.

### 3.3 Verify Protection Rules

```bash
# Test that direct pushes are blocked
git push origin main
# Should fail with protection rule message

# Verify via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection
```

## Step 4: Cloudflare Pages Setup

### 4.1 Create Cloudflare Pages Project

1. **Login to Cloudflare:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Log in to your account

2. **Navigate to Pages:**
   - Click "Pages" in the sidebar
   - Click "Create a project"
   - Choose "Connect to Git"

3. **Connect GitHub Repository:**
   - Click "GitHub" and authorize Cloudflare
   - Select your repository: `cpaonweb-project`
   - Click "Begin setup"

### 4.2 Configure Build Settings

**Build Configuration:**
```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: (leave empty)
Environment variables:
  NODE_ENV = production  
  NEXT_TELEMETRY_DISABLED = 1
```

**Advanced Settings:**
- Node.js version: 18 (or latest LTS)
- Build timeout: 20 minutes
- Build image: v2 (Ubuntu 22.04)

### 4.3 Configure Production Branch

1. Set **Production branch** to: `main`
2. Enable **Preview deployments** for all other branches
3. Click "Save and Deploy"

### 4.4 Wait for Initial Deployment

- Monitor the build logs
- Initial deployment typically takes 3-5 minutes
- Note the deployed URL (e.g., `https://cpaonweb-project.pages.dev`)

## Step 5: Custom Domain Configuration (Optional)

### 5.1 Add Custom Domains

1. In Cloudflare Pages → Custom domains
2. Click "Set up a custom domain"
3. Add domains:
   - Primary: `cpaonweb.com`
   - Staging: `staging.cpaonweb.com`

### 5.2 Configure DNS Records

**If domain is managed by Cloudflare:**
DNS records are automatically created.

**If domain is managed elsewhere:**
Add these CNAME records in your DNS provider:
```
cpaonweb.com → cpaonweb-project.pages.dev
www.cpaonweb.com → cpaonweb-project.pages.dev  
staging.cpaonweb.com → cpaonweb-project.pages.dev
```

### 5.3 Set Up Branch Aliases

1. Go to Cloudflare Pages → Settings → Builds & deployments
2. Under "Branch aliases":
   - Add alias: `staging.cpaonweb.com` → `staging` branch
3. Save configuration

### 5.4 SSL Certificate Verification

- Wait 5-10 minutes for SSL certificates to be issued
- Verify HTTPS access to both domains
- Check that HTTP automatically redirects to HTTPS

## Step 6: Testing and Validation

### 6.1 Test Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/test-setup
echo "Test content" > test-file.txt
git add test-file.txt
git commit -m "Add test file"
git push -u origin feature/test-setup
```

**Expected Results:**
- Cloudflare Pages creates preview deployment
- Unique preview URL is generated
- Preview deployment is accessible

### 6.2 Test Pull Request Workflow

```bash
# Create pull request
gh pr create \
  --title "Test setup workflow" \
  --body "Testing the complete setup and deployment pipeline"
```

**Expected Results:**
- Status checks appear on PR (build, type-check, lint)
- All status checks should pass
- Preview deployment link appears in PR

### 6.3 Test Production Deployment

1. Merge the test PR to `main` branch
2. Monitor Cloudflare Pages deployment
3. Verify production site updates

## Step 7: Team Access Configuration

### 7.1 Add Team Members to GitHub Repository

1. Repository → Settings → Manage access
2. Click "Invite a collaborator"
3. Set appropriate permissions:
   - **Admin**: Full access
   - **Write**: Can push to non-protected branches
   - **Read**: Can view and clone repository

### 7.2 Configure Cloudflare Pages Access

1. Cloudflare Pages → Settings → Access control
2. Add team members with appropriate permissions
3. Consider setting up Cloudflare Access for additional security

## Troubleshooting

### Common Issues and Solutions

**Build Failures:**
- Check Node.js version in build logs
- Verify all dependencies are listed in package.json
- Clear build cache in Cloudflare Pages settings

**DNS Issues:**
- Allow 24-48 hours for DNS propagation
- Use DNS checker tools to verify records
- Check that domain isn't being blocked by security settings

**Branch Protection Issues:**
- Ensure you're not trying to push directly to protected branches
- Verify status checks are properly configured
- Check that branch names match exactly

**Deployment Issues:**
- Verify build command and output directory are correct
- Check environment variables are set properly
- Review build logs for specific error messages

### Getting Help

**Resources:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)

**Support Channels:**
- GitHub: Create issue in your repository
- Cloudflare: Contact support through dashboard
- Community: Stack Overflow with relevant tags

## Maintenance Checklist

### Weekly Tasks
- [ ] Review Cloudflare Pages analytics
- [ ] Check for security advisories in dependencies
- [ ] Monitor build success rates

### Monthly Tasks
- [ ] Update dependencies: `npm audit` and `npm update`
- [ ] Review and rotate API tokens if needed
- [ ] Check SSL certificate expiration dates

### Quarterly Tasks  
- [ ] Review team access permissions
- [ ] Update documentation for any process changes
- [ ] Performance review of deployment pipeline

---

**Setup Complete!** Your Next.js TypeScript project with Cloudflare Pages CI/CD is now ready for development.