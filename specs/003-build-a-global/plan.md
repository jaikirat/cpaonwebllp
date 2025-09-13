# Implementation Plan: Global Layout and Navigation Shell

**Branch**: `003-build-a-global` | **Date**: 2025-09-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `C:\Users\JAIKIRAT\OneDrive\Documents\Jai_Projects\cpaonwebllp\specs\003-build-a-global\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build a global layout and navigation shell for Next.js application with responsive header, footer, container grid, mobile navigation drawer, and breadcrumb system. Technical approach uses Next.js App Router with TypeScript, Tailwind CSS, and shadcn/ui components.

## Technical Context
**Language/Version**: TypeScript 5.x with Next.js 14.x App Router
**Primary Dependencies**: Next.js, React, Tailwind CSS, shadcn/ui, Radix UI
**Storage**: Static/client-side for navigation structure and breadcrumb paths (no database required)
**Testing**: Jest with React Testing Library for unit tests, Playwright for E2E testing
**Target Platform**: Web browsers (modern browsers supporting ES2020+), Cloudflare Pages deployment
**Project Type**: web - Next.js frontend application with static export capability
**Performance Goals**: <100ms navigation response, <200ms mobile menu toggle, 60fps animations
**Constraints**: SEO-friendly (SSG compatible), keyboard accessible (WCAG AA), progressive enhancement for no-JS users
**Scale/Scope**: Single application shell supporting 10+ navigation items, 3-level breadcrumb hierarchy, responsive breakpoints (mobile/tablet/desktop)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (Next.js frontend application)
- Using framework directly? ✅ (Next.js App Router, Tailwind CSS, shadcn/ui directly)
- Single data model? ✅ (Navigation structure and breadcrumb path entities)
- Avoiding patterns? ✅ (No unnecessary abstraction layers, direct React components)

**Architecture**:
- EVERY feature as library? ❌ DEVIATION: UI layout components integrated directly into Next.js app
- Libraries listed: N/A (layout components part of main application)
- CLI per library: N/A (frontend UI feature)
- Library docs: N/A (component documentation in JSDoc format)

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? ✅ (Tests written first, must fail, then implementation)
- Git commits show tests before implementation? ✅ (Commit order will show test files first)
- Order: Contract→Integration→E2E→Unit strictly followed? ✅ (Component contracts, integration tests, E2E navigation tests, unit tests)
- Real dependencies used? ✅ (Real DOM, actual Next.js routing, browser APIs)
- Integration tests for: Component contracts, navigation behavior, responsive breakpoints
- FORBIDDEN: Implementation before test, skipping RED phase ✅

**Observability**:
- Structured logging included? ✅ (Console logging for navigation events, error boundaries)
- Frontend logs → backend? N/A (frontend-only feature)
- Error context sufficient? ✅ (Component error boundaries with context)

**Versioning**:
- Version number assigned? ✅ (Will increment BUILD on implementation)
- BUILD increments on every change? ✅ (Following semantic versioning)
- Breaking changes handled? ✅ (Layout changes will have migration plan)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Web application structure (Next.js App Router) - using existing src/app/ and src/components/ directories

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh [claude|gemini|copilot]` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each component contract → component test task [P]
- Each data entity → type definition and utility task [P]
- Each user acceptance scenario → integration test task
- Implementation tasks following TDD red-green-refactor cycle

**Ordering Strategy**:
1. **Setup Tasks**: Type definitions, configuration files, utilities
2. **Contract Tests**: Component contract tests (must fail initially)
3. **Integration Tests**: Navigation behavior, responsive design, accessibility
4. **Implementation Tasks**: Create components to make tests pass
5. **E2E Tests**: Cross-device navigation flows
6. **Documentation**: Component documentation and usage examples

**Parallel Execution Markers [P]**:
- Type definition files (can be created independently)
- Individual component tests (no interdependencies)
- Configuration files (navigation config, layout constants)

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**Task Categories**:
- **Configuration & Types**: 3-4 tasks
- **Contract Tests**: 5 tasks (one per component)
- **Integration Tests**: 4-5 tasks
- **Component Implementation**: 5 tasks
- **E2E & Documentation**: 3-4 tasks

**Key Dependencies**:
- Navigation configuration must exist before components
- Component contracts must be tested before implementation
- Layout container setup required before other components
- Mobile navigation depends on header component state

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Feature not as library | UI layout components are integral to Next.js app structure | Extracting to separate library would add unnecessary complexity for UI components that are tightly coupled to app routing and layout |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*