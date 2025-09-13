# Tasks: Global Layout and Navigation Shell

**Input**: Design documents from `/specs/003-build-a-global/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Next.js 14.x App Router, TypeScript, Tailwind CSS, shadcn/ui
   → Structure: Web application using src/app/ and src/components/
2. Load design documents:
   → data-model.md: NavigationStructure, BreadcrumbPath, LayoutContainer entities
   → contracts/: layout-components.yaml with 5 component contracts
   → research.md: Technology decisions validated
3. Generate tasks by category:
   → Setup: type definitions, configuration, dependencies
   → Tests: contract tests for 5 components, integration tests
   → Core: 5 layout components implementation
   → Integration: root layout, navigation state management
   → Polish: E2E tests, accessibility validation, documentation
4. Apply task rules:
   → Type definitions and configuration [P] for parallel
   → Component tests [P] (different files)
   → Component implementations sequential (shared dependencies)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Validate: All 5 components have contracts and tests
8. Return: SUCCESS (25 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app structure**: `src/app/`, `src/components/`, `src/config/` at repository root
- Following Next.js App Router conventions from plan.md

## Phase 3.1: Setup and Configuration
- [x] T001 [P] Create navigation configuration in src/config/navigation.ts
- [x] T002 [P] Create TypeScript type definitions in src/types/layout.ts
- [x] T003 [P] Install required shadcn/ui components (navigation-menu, dialog, button, sheet)
- [x] T004 [P] Create layout utilities in src/lib/layout-utils.ts

## Phase 3.2: Contract Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T005 [P] Header component contract test in tests/contract/Header.test.tsx
- [x] T006 [P] Footer component contract test in tests/contract/Footer.test.tsx
- [x] T007 [P] MobileNavigation component contract test in tests/contract/MobileNavigation.test.tsx
- [x] T008 [P] Breadcrumbs component contract test in tests/contract/Breadcrumbs.test.tsx
- [x] T009 [P] LayoutContainer component contract test in tests/contract/LayoutContainer.test.tsx

## Phase 3.3: Integration Tests (TDD) ⚠️ MUST COMPLETE BEFORE 3.4
- [ ] T010 [P] Navigation state management integration test in tests/integration/navigation-state.test.tsx
- [ ] T011 [P] Responsive behavior integration test in tests/integration/responsive-layout.test.tsx
- [ ] T012 [P] Authentication-based visibility integration test in tests/integration/auth-navigation.test.tsx
- [ ] T013 [P] Breadcrumb generation integration test in tests/integration/breadcrumb-generation.test.tsx

## Phase 3.4: Core Component Implementation (ONLY after tests are failing)
- [ ] T014 Create LayoutContainer component in src/components/layout/LayoutContainer.tsx
- [ ] T015 Create Header component in src/components/layout/Header.tsx
- [ ] T016 Create Footer component in src/components/layout/Footer.tsx
- [ ] T017 Create Breadcrumbs component in src/components/layout/Breadcrumbs.tsx
- [ ] T018 Create MobileNavigation component in src/components/layout/MobileNavigation.tsx

## Phase 3.5: Layout Integration
- [ ] T019 Update root layout in src/app/layout.tsx to integrate all components
- [ ] T020 Implement navigation state management with React hooks
- [ ] T021 Add breadcrumb generation logic using Next.js router
- [ ] T022 Configure responsive breakpoint behavior

## Phase 3.6: End-to-End Testing
- [ ] T023 [P] Desktop navigation E2E test in tests/e2e/desktop-navigation.spec.ts
- [ ] T024 [P] Mobile navigation E2E test in tests/e2e/mobile-navigation.spec.ts
- [ ] T025 [P] Accessibility keyboard navigation E2E test in tests/e2e/accessibility.spec.ts

## Dependencies
- Setup (T001-T004) before all other phases
- Contract tests (T005-T009) before implementation (T014-T018)
- Integration tests (T010-T013) before implementation (T014-T018)
- T014 (LayoutContainer) blocks T015-T018 (requires container structure)
- T015 (Header) blocks T018 (MobileNavigation depends on Header state)
- Implementation (T014-T018) before integration (T019-T022)
- Integration (T019-T022) before E2E tests (T023-T025)

## Parallel Example
```bash
# Launch T001-T004 (Setup) together:
Task: "Create navigation configuration in src/config/navigation.ts"
Task: "Create TypeScript type definitions in src/types/layout.ts"
Task: "Install required shadcn/ui components"
Task: "Create layout utilities in src/lib/layout-utils.ts"

# Launch T005-T009 (Contract Tests) together:
Task: "Header component contract test in tests/contract/Header.test.tsx"
Task: "Footer component contract test in tests/contract/Footer.test.tsx"
Task: "MobileNavigation component contract test in tests/contract/MobileNavigation.test.tsx"
Task: "Breadcrumbs component contract test in tests/contract/Breadcrumbs.test.tsx"
Task: "LayoutContainer component contract test in tests/contract/LayoutContainer.test.tsx"

# Launch T010-T013 (Integration Tests) together:
Task: "Navigation state management integration test in tests/integration/navigation-state.test.tsx"
Task: "Responsive behavior integration test in tests/integration/responsive-layout.test.tsx"
Task: "Authentication-based visibility integration test in tests/integration/auth-navigation.test.tsx"
Task: "Breadcrumb generation integration test in tests/integration/breadcrumb-generation.test.tsx"

# Launch T023-T025 (E2E Tests) together:
Task: "Desktop navigation E2E test in tests/e2e/desktop-navigation.spec.ts"
Task: "Mobile navigation E2E test in tests/e2e/mobile-navigation.spec.ts"
Task: "Accessibility keyboard navigation E2E test in tests/e2e/accessibility.spec.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (TDD red-green-refactor)
- Run type-check and lint after each phase
- Follow accessibility requirements (WCAG AA) throughout
- Ensure progressive enhancement (works without JavaScript)

## Task Generation Rules
*Applied during analysis of design documents*

1. **From Contracts**:
   - Each component in layout-components.yaml → contract test task [P]
   - Header, Footer, MobileNavigation, Breadcrumbs, LayoutContainer → 5 tests

2. **From Data Model**:
   - NavigationStructure entity → navigation configuration task [P]
   - BreadcrumbPath entity → breadcrumb utilities task [P]
   - LayoutContainer entity → layout utilities task [P]

3. **From Quickstart Scenarios**:
   - Desktop navigation test → E2E test task [P]
   - Mobile navigation test → E2E test task [P]
   - Responsive layout test → integration test task [P]
   - Authentication integration → integration test task [P]

4. **Ordering**:
   - Setup → Contract Tests → Integration Tests → Components → Layout Integration → E2E
   - Dependencies respect component hierarchy (Container → Header → Mobile)

## Validation Checklist
*GATE: Verified before task execution*

- [x] All 5 component contracts have corresponding tests (T005-T009)
- [x] All 3 entities have setup tasks (T001-T004)
- [x] All tests come before implementation (T005-T013 before T014-T018)
- [x] Parallel tasks truly independent (verified file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD red-green-refactor cycle enforced (tests must fail first)
- [x] Performance goals addressed (responsive behavior tests)
- [x] Accessibility requirements covered (E2E accessibility test)
- [x] SEO requirements covered (breadcrumb JSON-LD generation)

## Technical Context Summary
- **Framework**: Next.js 14.x App Router with TypeScript 5.x
- **Styling**: Tailwind CSS with shadcn/ui components
- **Testing**: Jest + React Testing Library + Playwright E2E
- **Accessibility**: WCAG AA compliance with ARIA landmarks
- **Performance**: <100ms navigation, <200ms mobile menu, 60fps animations
- **SEO**: JSON-LD breadcrumb structured data
- **Progressive Enhancement**: CSS fallbacks for no-JS users