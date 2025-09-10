# Quickstart Guide: Next.js TypeScript Project with Cloudflare Pages

**Date**: 2025-09-10  
**Feature**: Next.js TypeScript Project with Cloudflare Pages CI/CD  
**Estimated Time**: 30-45 minutes

## Prerequisites Verification

Before starting, verify you have access to:
- [ ] GitHub account with repository creation permissions
- [ ] Cloudflare account (free tier sufficient)
- [ ] Domain name (optional, can use .pages.dev subdomain)
- [ ] Local development environment with Node.js 18+ and Git

## Quick Validation Steps

### 1. Project Creation Validation (5 minutes)

```bash
# Create and initialize Next.js project
npx create-next-app@latest cpaonweb-project --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project
cd cpaonweb-project

# Verify TypeScript configuration
npm run type-check
# Expected: No TypeScript errors

# Verify build process
npm run build
# Expected: Build completed successfully with .next directory created

# Test development server
npm run dev
# Expected: Server starts on http://localhost:3000
# Expected: Next.js welcome page loads correctly
```

**Success Criteria:**
- ✅ TypeScript compilation succeeds without errors
- ✅ Build process completes successfully
- ✅ Development server starts and serves content
- ✅ ESLint runs without errors: `npm run lint`

### 2. Repository Setup Validation (5 minutes)

```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial Next.js TypeScript project setup"

# Create GitHub repository (via GitHub CLI or web interface)
gh repo create cpaonweb-project --private --source=. --push

# Create and push staging branch
git checkout -b staging
git push -u origin staging

# Return to main branch
git checkout main

# Verify remote repository
git remote -v
# Expected: origin pointing to GitHub repository
```

**Success Criteria:**
- ✅ Local Git repository initialized with proper .gitignore
- ✅ GitHub repository created and connected
- ✅ Main branch pushed with initial commit
- ✅ Staging branch created and pushed

### 3. Branch Protection Setup (5 minutes)

Using GitHub web interface or CLI:

```bash
# Set up branch protection for main branch
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["build","type-check","lint"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null

# Set up branch protection for staging branch  
gh api repos/:owner/:repo/branches/staging/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["build","type-check","lint"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

**Success Criteria:**
- ✅ Main branch requires PR reviews before merge
- ✅ Staging branch requires PR reviews before merge  
- ✅ Both branches require status checks to pass
- ✅ Direct pushes to protected branches are blocked

### 4. Cloudflare Pages Integration (10 minutes)

1. **Connect Repository:**
   - Log into Cloudflare Dashboard
   - Navigate to Pages → Create a project
   - Connect to GitHub and select your repository
   - Grant necessary permissions

2. **Configure Build Settings:**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: (leave empty)
   ```

3. **Set Environment Variables:**
   ```
   NODE_ENV = production
   NEXT_TELEMETRY_DISABLED = 1
   ```

4. **Configure Deployment Branches:**
   - Production branch: `main`
   - Preview deployments: All other branches

**Success Criteria:**
- ✅ Repository successfully connected to Cloudflare Pages
- ✅ Build settings configured correctly
- ✅ Initial deployment triggered and completed successfully
- ✅ Site accessible at provided .pages.dev URL

### 5. Custom Domain Setup (10 minutes) [Optional]

1. **Add Custom Domain:**
   - In Cloudflare Pages, go to Custom domains
   - Add `cpaonweb.com` and `staging.cpaonweb.com`
   - Follow DNS configuration instructions

2. **Configure Branch Aliases:**
   - Set `staging` branch alias to `staging.cpaonweb.com`
   - Main branch automatically uses `cpaonweb.com`

**Success Criteria:**
- ✅ Custom domains added and SSL certificates issued
- ✅ DNS records configured correctly
- ✅ Sites accessible via custom domains
- ✅ Automatic HTTPS redirection working

### 6. End-to-End Workflow Validation (5 minutes)

Test the complete workflow:

```bash
# Create feature branch
git checkout -b feature/test-deployment

# Make a simple change
echo "export default function TestPage() { return <div>Test Page</div>; }" > src/app/test/page.tsx

# Commit and push
git add .
git commit -m "Add test page for deployment verification"
git push -u origin feature/test-deployment

# Create pull request
gh pr create --title "Test deployment workflow" --body "Testing the complete CI/CD pipeline"
```

**Success Criteria:**
- ✅ Feature branch triggers preview deployment
- ✅ Preview deployment accessible via unique URL
- ✅ Pull request shows deployment status
- ✅ All status checks pass (build, type-check, lint)

### 7. Production Deployment Test (5 minutes)

```bash
# Merge PR to staging first
gh pr merge --merge  # or via GitHub web interface

# Switch to staging and verify deployment
git checkout staging
git pull origin staging

# Create PR from staging to main
git checkout main
gh pr create --base main --head staging --title "Deploy to production" --body "Deploying tested changes to production"

# Merge to main (triggers production deployment)  
gh pr merge --merge
```

**Success Criteria:**
- ✅ Staging deployment updates correctly
- ✅ Production deployment triggers on main branch merge
- ✅ Production site accessible at custom domain
- ✅ No build or deployment errors

## Validation Checklist

After completing all steps, verify:

**Project Setup:**
- [ ] Next.js 14.x with TypeScript 5.x installed
- [ ] All dependencies installed correctly
- [ ] TypeScript strict mode enabled
- [ ] ESLint configuration working
- [ ] Build process completes successfully

**Repository Configuration:**
- [ ] GitHub repository created and accessible
- [ ] Main and staging branches exist
- [ ] Branch protection rules applied
- [ ] .gitignore properly configured

**CI/CD Pipeline:**
- [ ] Cloudflare Pages project connected
- [ ] Build settings configured correctly
- [ ] Environment variables set
- [ ] Automatic deployments working

**Deployment Environments:**
- [ ] Production: main branch → cpaonweb.com
- [ ] Staging: staging branch → staging.cpaonweb.com  
- [ ] Preview: feature branches → unique URLs

**Workflow Validation:**
- [ ] Feature branch creates preview deployment
- [ ] Pull requests trigger status checks
- [ ] Branch protection prevents direct pushes
- [ ] Merges trigger appropriate deployments

## Troubleshooting Quick Fixes

**Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

**TypeScript Errors:**
```bash
# Check TypeScript configuration
npm run type-check
# Fix errors in tsconfig.json or source files
```

**Deployment Issues:**
- Check Cloudflare Pages build logs
- Verify environment variables are set
- Ensure build command and output directory are correct

**Branch Protection Issues:**
- Verify GitHub permissions
- Check that required status checks exist
- Ensure PR review requirements are met

## Success Indicators

🎉 **Project setup is complete when:**
- Development server runs locally without errors
- Code pushes trigger appropriate deployments  
- Production site is accessible at custom domain
- Staging environment works for pre-production testing
- Preview deployments work for feature branches
- All team members can follow the development workflow

**Next Steps:** 
- Begin feature development following the established workflow
- Add additional team members with appropriate repository permissions
- Configure monitoring and alerting as needed
- Review and customize ESLint and TypeScript rules for team preferences