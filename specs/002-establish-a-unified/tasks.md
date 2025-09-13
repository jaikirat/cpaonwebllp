# Tasks: Unified Design System

**Input**: Design documents from `/specs/002-establish-a-unified/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Next.js 14.x, TypeScript 5.x, Tailwind CSS, shadcn/ui, Radix UI
2. Load optional design documents:
   → data-model.md: Extract DesignToken, Component, Theme entities
   → contracts/: button-component.ts, input-component.ts, card-component.ts
   → research.md: CSS custom properties + Tailwind integration decisions
3. Generate tasks by category:
   → Setup: design tokens, utilities, Tailwind config
   → Tests: component contract tests, accessibility tests
   → Core: Button, Input, Card components
   → Integration: theme switching, sandbox page
   → Polish: visual regression tests, performance testing
4. Apply task rules:
   → Different component files = mark [P] for parallel
   → Shared files (utils.ts, tokens.css) = sequential
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup
- [x] T001 Create design token CSS variables in src/styles/tokens.css
- [x] T002 Configure Tailwind CSS to reference design tokens in tailwind.config.ts
- [x] T003 Create utility functions for theme management in src/lib/utils.ts
- [x] T004 Install and configure shadcn/ui and Radix UI dependencies

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T005 [P] Button component contract test in tests/components/button.test.tsx
- [x] T006 [P] Input component contract test in tests/components/input.test.tsx
- [x] T007 [P] Card component contract test in tests/components/card.test.tsx
- [x] T008 [P] Theme switching integration test in tests/integration/theme-switching.test.tsx
- [x] T009 [P] Accessibility compliance test in tests/integration/accessibility.test.tsx
- [x] T010 [P] Design token usage test in tests/integration/token-consistency.test.tsx

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T011 [P] Button component implementation in src/components/ui/button.tsx
- [x] T012 [P] Input component implementation in src/components/ui/input.tsx
- [x] T013 [P] Card component implementation with Header, Content, Footer in src/components/ui/card.tsx
- [x] T014 Component index exports in src/components/ui/index.ts
- [x] T015 Theme provider context implementation in src/components/theme-provider.tsx

## Phase 3.4: Integration
- [ ] T016 Design system sandbox page in src/app/sandbox/page.tsx
- [ ] T017 Component variant showcases in sandbox (all button variants, input states, card types)
- [ ] T018 Theme switching controls in sandbox page
- [ ] T019 Update root layout with theme provider in src/app/layout.tsx
- [ ] T020 Global styles integration in src/app/globals.css

## Phase 3.5: Polish
- [ ] T021 [P] Visual regression tests with Playwright in tests/visual/components.spec.ts
- [ ] T022 [P] Performance tests for component render times in tests/performance/render-performance.test.tsx
- [ ] T023 [P] Bundle size analysis setup in tests/bundle/size-analysis.test.ts
- [ ] T024 Component documentation updates in component files (JSDoc comments)
- [ ] T025 Verify all acceptance scenarios from quickstart.md work correctly

## Dependencies
- Setup (T001-T004) before tests (T005-T010)
- Tests (T005-T010) before implementation (T011-T015)
- T011-T013 before T014 (component exports depend on implementations)
- T014 before T015 (theme provider uses component types)
- Implementation (T011-T015) before integration (T016-T020)
- Integration before polish (T021-T025)

## Parallel Example
```
# Launch T005-T007 together (component contract tests):
Task: "Button component contract test in tests/components/button.test.tsx"
Task: "Input component contract test in tests/components/input.test.tsx"
Task: "Card component contract test in tests/components/card.test.tsx"

# Launch T011-T013 together (component implementations):
Task: "Button component implementation in src/components/ui/button.tsx"
Task: "Input component implementation in src/components/ui/input.tsx"
Task: "Card component implementation with Header, Content, Footer in src/components/ui/card.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing components
- Follow design token contracts exactly as specified
- Commit after each task
- Test accessibility requirements with each component
- Maintain WCAG 2.1 AA compliance throughout

## Task Generation Rules
*Applied during execution*

1. **From Contracts**:
   - button-component.ts → Button contract test [P] + Button implementation [P]
   - input-component.ts → Input contract test [P] + Input implementation [P]
   - card-component.ts → Card contract test [P] + Card implementation [P]

2. **From Data Model**:
   - DesignToken entity → CSS custom properties task
   - Theme entity → Theme provider implementation
   - Component variants → Sandbox showcase tasks

3. **From Quickstart Scenarios**:
   - Component usage examples → Integration tests [P]
   - Theme switching → Theme integration test [P]
   - Accessibility testing → Accessibility compliance test [P]

4. **Ordering**:
   - Setup → Tests → Components → Integration → Polish
   - Design tokens must exist before component implementations
   - Component tests must fail before implementations

## Validation Checklist
*GATE: Checked before execution begins*

- [x] All contracts (button, input, card) have corresponding tests
- [x] All entities (DesignToken, Theme, Component) have implementation tasks
- [x] All tests come before implementation (T005-T010 before T011-T015)
- [x] Parallel tasks truly independent (different component files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Acceptance scenarios from quickstart.md covered by integration tests