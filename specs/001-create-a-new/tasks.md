# Tasks: Next.js TypeScript Project with Cloudflare Pages CI/CD

**Input**: Design documents from `/specs/001-create-a-new/`
**Prerequisites**: research.md (✅), data-model.md (✅), contracts/ (✅), quickstart.md (✅)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Next.js 14.x, TypeScript 5.x, Tailwind CSS, ESLint
   → Structure: Next.js App Router with src/ directory
2. Load design documents:
   → data-model.md: 4 entities → model/config tasks
   → contracts/: 3 files → contract test tasks
   → research.md: Technology decisions → setup tasks
   → quickstart.md: 7 validation scenarios → integration tests
3. Generate tasks by category:
   → Setup: Next.js init, GitHub repo, Cloudflare config
   → Tests: contract tests, integration tests
   → Core: project files, configuration, deployment
   → Integration: CI/CD pipeline, branch protection
   → Polish: documentation, validation tests
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests? ✅
   → All entities have configurations? ✅
   → All deployment environments implemented? ✅
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js App Router**: `src/app/` for pages and layouts
- **Configuration files**: Root directory (package.json, tsconfig.json, etc.)
- **Static assets**: `public/` directory
- **Specifications**: `specs/001-create-a-new/` for documentation

## Phase 3.1: Setup
- [x] T001 Initialize Next.js TypeScript project with App Router in root directory
- [x] T002 [P] Configure package.json with required scripts and dependencies
- [x] T003 [P] Configure tsconfig.json with strict TypeScript settings
- [x] T004 [P] Configure next.config.js for production optimization
- [x] T005 [P] Configure .eslintrc.json with Next.js and TypeScript rules
- [x] T006 [P] Configure tailwind.config.ts for Tailwind CSS setup
- [x] T007 Create .gitignore with Next.js specific exclusions

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T008 [P] Contract test build pipeline validation in tests/contract/test_build_pipeline.spec.js
- [x] T009 [P] Contract test GitHub repository structure in tests/contract/test_github_repository.spec.js
- [x] T010 [P] Contract test Cloudflare Pages deployment in tests/contract/test_cloudflare_pages.spec.js
- [x] T011 [P] Integration test project creation validation per quickstart.md step 1
- [x] T012 [P] Integration test repository setup validation per quickstart.md step 2
- [x] T013 [P] Integration test branch protection validation per quickstart.md step 3
- [x] T014 [P] Integration test Cloudflare Pages integration per quickstart.md step 4
- [x] T015 [P] Integration test custom domain setup per quickstart.md step 5
- [x] T016 [P] Integration test end-to-end workflow per quickstart.md step 6
- [x] T017 [P] Integration test production deployment per quickstart.md step 7

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T018 [P] Create src/app/layout.tsx root layout component
- [x] T019 [P] Create src/app/page.tsx home page component
- [x] T020 [P] Create src/app/globals.css with Tailwind directives
- [x] T021 Create public/favicon.ico and basic static assets
- [x] T022 Initialize Git repository with proper .gitignore configuration
- [x] T023 Create GitHub repository and connect remote origin
- [ ] T024 Create and push staging branch to remote repository
- [ ] T025 Configure GitHub branch protection rules for main branch
- [ ] T026 Configure GitHub branch protection rules for staging branch

## Phase 3.4: Integration
- [ ] T027 Connect GitHub repository to Cloudflare Pages
- [ ] T028 Configure Cloudflare Pages build settings (npm run build, .next output)
- [ ] T029 Set environment variables in Cloudflare Pages (NODE_ENV, NEXT_TELEMETRY_DISABLED)
- [ ] T030 Configure production deployment from main branch
- [ ] T031 Configure staging deployment from staging branch
- [ ] T032 Configure preview deployments for feature branches
- [ ] T033 Set up custom domain configuration (cpaonweb.com)
- [ ] T034 Set up staging subdomain (staging.cpaonweb.com)
- [ ] T035 Configure DNS records for custom domains

## Phase 3.5: Polish
- [x] T036 [P] Create comprehensive README.md with project description, setup, development, and deployment instructions
- [x] T037 [P] Create .github/pull_request_template.md with required sections
- [x] T038 [P] Create .github/ISSUE_TEMPLATE/bug_report.md issue template
- [x] T039 [P] Create .github/ISSUE_TEMPLATE/feature_request.md issue template
- [x] T040 [P] Create CONTRIBUTING.md with development setup and PR process
- [x] T041 Run complete validation checklist from quickstart.md
- [x] T042 Verify TypeScript compilation with `npm run type-check`
- [x] T043 Verify ESLint passes with `npm run lint`
- [x] T044 Verify production build succeeds with `npm run build`
- [x] T045 Create feature branch and test complete deployment workflow

## Dependencies
- Setup (T001-T007) before tests (T008-T017)
- Tests (T008-T017) before implementation (T018-T035)
- Core implementation (T018-T026) before integration (T027-T035)
- Integration (T027-T035) before polish (T036-T045)
- T022 (Git init) blocks T023 (GitHub repo)
- T023 (GitHub repo) blocks T024-T026 (branch setup)
- T025-T026 (branch protection) blocks T027 (Cloudflare connection)
- T027-T032 (Cloudflare setup) blocks T033-T035 (custom domains)

## Parallel Example
```bash
# Launch T008-T010 together (contract tests):
Task: "Contract test build pipeline validation in tests/contract/test_build_pipeline.spec.js"
Task: "Contract test GitHub repository structure in tests/contract/test_github_repository.spec.js"  
Task: "Contract test Cloudflare Pages deployment in tests/contract/test_cloudflare_pages.spec.js"

# Launch T011-T017 together (integration tests):
Task: "Integration test project creation validation per quickstart.md step 1"
Task: "Integration test repository setup validation per quickstart.md step 2"
Task: "Integration test branch protection validation per quickstart.md step 3"
Task: "Integration test Cloudflare Pages integration per quickstart.md step 4"
Task: "Integration test custom domain setup per quickstart.md step 5"
Task: "Integration test end-to-end workflow per quickstart.md step 6"
Task: "Integration test production deployment per quickstart.md step 7"

# Launch T018-T020 together (core files):
Task: "Create src/app/layout.tsx root layout component"
Task: "Create src/app/page.tsx home page component"
Task: "Create src/app/globals.css with Tailwind directives"

# Launch T036-T040 together (documentation):
Task: "Create comprehensive README.md with project description, setup, development, and deployment instructions"
Task: "Create .github/pull_request_template.md with required sections"
Task: "Create .github/ISSUE_TEMPLATE/bug_report.md issue template"
Task: "Create .github/ISSUE_TEMPLATE/feature_request.md issue template"
Task: "Create CONTRIBUTING.md with development setup and PR process"
```

## Notes
- [P] tasks = different files, no dependencies between them
- Contract tests validate build pipeline, repository structure, and deployment configuration
- Integration tests validate each step of the quickstart guide
- Verify all tests fail before implementing (TDD approach)
- Commit after each task completion
- Use feature branches for testing deployment workflow
- Custom domains require DNS configuration outside of the code

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - build-pipeline-contract.yml → T008 build pipeline contract test [P]
   - github-repository-contract.yml → T009 repository structure test [P]
   - cloudflare-pages-contract.yml → T010 deployment contract test [P]

2. **From Data Model**:
   - Project Configuration Entity → T002-T006 config files [P]
   - Repository Entity → T022-T026 Git and GitHub setup
   - Build Pipeline Entity → T027-T032 Cloudflare configuration
   - Deployment Environment Entity → T033-T035 domain setup

3. **From Quickstart Scenarios**:
   - Step 1 (Project Creation) → T011 integration test [P]
   - Step 2 (Repository Setup) → T012 integration test [P]
   - Step 3 (Branch Protection) → T013 integration test [P]
   - Step 4 (Cloudflare Pages) → T014 integration test [P]
   - Step 5 (Custom Domain) → T015 integration test [P]
   - Step 6 (End-to-End) → T016 integration test [P]
   - Step 7 (Production) → T017 integration test [P]

4. **Ordering**:
   - Setup → Tests → Core → Integration → Polish
   - Dependencies prevent parallel execution where needed

## Validation Checklist
*GATE: Checked by main() before returning*

- [✅] All contracts have corresponding tests (T008-T010)
- [✅] All entities have configuration tasks (T001-T007, T022-T035)
- [✅] All tests come before implementation (T008-T017 before T018-T045)
- [✅] Parallel tasks truly independent (different files, no shared dependencies)
- [✅] Each task specifies exact file path or clear action
- [✅] No task modifies same file as another [P] task
- [✅] All quickstart scenarios covered (T011-T017)
- [✅] Complete deployment pipeline implemented (T027-T035)
- [✅] Documentation and polish tasks included (T036-T045)