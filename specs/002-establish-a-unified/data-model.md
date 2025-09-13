# Phase 1: Data Model - Unified Design System

## Entity Definitions

### DesignToken
Represents a design token value that can be used across the system.

**Fields**:
- `name: string` - Token identifier (e.g., "color-primary", "spacing-md")
- `value: string | number` - Token value (e.g., "#3b82f6", "16px", 1.5)
- `category: TokenCategory` - Token type (color, spacing, typography, etc.)
- `description?: string` - Human-readable description of token usage
- `deprecated?: boolean` - Whether token is deprecated

**Validation Rules**:
- Name must follow kebab-case convention
- Value must be valid CSS value for the category
- Category must be one of predefined token categories
- Deprecated tokens must include replacement token reference

**State Transitions**:
- Active → Deprecated (with migration path)
- Deprecated → Removed (after migration period)

### Component
Represents a reusable UI component in the design system.

**Fields**:
- `name: string` - Component name (e.g., "Button", "Card")
- `variants: ComponentVariant[]` - Available component variants
- `props: ComponentProp[]` - Component API properties
- `states: ComponentState[]` - Interactive states the component supports
- `dependencies: string[]` - Other components this component depends on
- `accessibility: AccessibilityFeatures` - ARIA attributes and keyboard support

**Validation Rules**:
- Name must be PascalCase
- Must have at least one variant
- Must include default variant
- All state combinations must be valid
- Accessibility features must meet WCAG 2.1 AA standards

**Relationships**:
- Has many ComponentVariant entities
- Has many ComponentState entities
- May depend on other Component entities

### ComponentVariant
Represents different visual styles of a component.

**Fields**:
- `name: string` - Variant name (e.g., "primary", "outline", "ghost")
- `componentName: string` - Parent component name
- `tokens: DesignTokenReference[]` - Design tokens used by this variant
- `isDefault: boolean` - Whether this is the default variant
- `description?: string` - Usage guidelines for variant

**Validation Rules**:
- Name must be camelCase
- Exactly one variant per component must be marked as default
- All token references must exist in token system
- Variant combinations must not conflict

**Relationships**:
- Belongs to Component entity
- References DesignToken entities

### ComponentState
Represents interactive states that components can exhibit.

**Fields**:
- `name: string` - State name (e.g., "default", "hover", "focus", "disabled")
- `componentName: string` - Parent component name
- `tokens: DesignTokenReference[]` - Tokens specific to this state
- `behaviors: StateBehavior[]` - Expected behaviors in this state
- `transitions: StateTransition[]` - Valid transitions to other states

**Validation Rules**:
- Must include "default" state for all components
- Focus state required for interactive components
- Disabled state must prevent all interactions
- State transitions must be logically valid

**State Transition Rules**:
- default ↔ hover (on mouse interaction)
- default ↔ focus (on keyboard interaction)
- any → disabled (programmatically)
- disabled → default (when re-enabled)
- focus + hover → focused-hover (combined state)

### Theme
Represents a collection of design tokens that define a visual theme.

**Fields**:
- `name: string` - Theme name (e.g., "light", "dark", "high-contrast")
- `tokens: ThemeTokenOverride[]` - Token values specific to this theme
- `isDefault: boolean` - Whether this is the default theme
- `extends?: string` - Base theme this theme extends
- `description?: string` - Theme usage guidelines

**Validation Rules**:
- Exactly one theme must be marked as default
- Extended themes must exist
- All token overrides must reference valid tokens
- Theme hierarchy must not create circular dependencies

**Relationships**:
- Contains ThemeTokenOverride entities
- May extend another Theme entity

### AccessibilityFeatures
Represents accessibility features and requirements for components.

**Fields**:
- `ariaAttributes: AriaAttribute[]` - Required ARIA attributes
- `keyboardSupport: KeyboardBinding[]` - Supported keyboard interactions
- `focusManagement: FocusRule[]` - Focus behavior requirements
- `screenReaderSupport: ScreenReaderFeature[]` - Screen reader compatibility
- `colorContrastRequirements: ContrastRule[]` - Color contrast specifications

**Validation Rules**:
- Interactive components must support keyboard navigation
- Focus indicators must be visible with 3:1 contrast ratio
- Color-only information must have non-color alternatives
- All interactive elements must have accessible names

### ComponentProp
Represents the API surface of a component.

**Fields**:
- `name: string` - Property name
- `type: PropType` - TypeScript type definition
- `required: boolean` - Whether prop is required
- `defaultValue?: any` - Default value if not required
- `description: string` - Property usage documentation
- `validation?: ValidationRule[]` - Runtime validation rules

**Validation Rules**:
- Required props cannot have default values
- Type definitions must be valid TypeScript
- Validation rules must match TypeScript types

## Token Categories

### ColorTokens
- Primary colors: brand identity colors
- Semantic colors: success, warning, error, info
- Neutral colors: grays for text and backgrounds
- Surface colors: component backgrounds and borders

### SpacingTokens
- Scale: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64
- Responsive multipliers for different screen sizes
- Component-specific spacing (button padding, card margins)

### TypographyTokens
- Font families: primary (sans), secondary (serif), mono
- Font sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- Font weights: 100, 200, 300, 400, 500, 600, 700, 800, 900
- Line heights: tight, normal, relaxed, loose
- Letter spacing: tighter, tight, normal, wide, wider, widest

### BorderTokens
- Border widths: 0, 1, 2, 4, 8
- Border radii: none, sm, base, md, lg, xl, 2xl, 3xl, full
- Border styles: solid, dashed, dotted

### ShadowTokens
- Elevation levels: none, sm, base, md, lg, xl, 2xl, inner
- Colored shadows for focus states and brand emphasis

## Validation Rules Summary

1. **Token Consistency**: All component styles must reference design tokens
2. **Accessibility Compliance**: All components must meet WCAG 2.1 AA standards
3. **Theme Compatibility**: Components must work across all defined themes
4. **API Stability**: Component props follow semantic versioning for breaking changes
5. **Performance**: Components must not cause unnecessary re-renders
6. **Browser Support**: Components must work in modern browsers (ES2020+)

## Entity Relationships

```
Theme 1:N ThemeTokenOverride N:1 DesignToken
Component 1:N ComponentVariant N:N DesignToken
Component 1:N ComponentState N:N DesignToken
Component 1:N ComponentProp
Component 1:1 AccessibilityFeatures
ComponentVariant N:N ComponentState (valid combinations)
```

## Next Steps
This data model provides the foundation for component contracts and implementation. Proceed to contract generation phase.