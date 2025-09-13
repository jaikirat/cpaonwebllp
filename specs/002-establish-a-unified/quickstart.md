# Quickstart Guide - Unified Design System

## Overview
This guide provides step-by-step instructions for setting up and using the unified design system. It validates all acceptance scenarios from the feature specification.

## Prerequisites
- Node.js 18+
- Next.js 14+ project
- TypeScript 5+

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install @radix-ui/react-button @radix-ui/react-dialog @radix-ui/react-accordion
npm install tailwindcss @tailwindcss/typography class-variance-authority clsx tailwind-merge
npm install -D @types/react @types/node
```

### 2. Configure Tailwind CSS
Update `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design token references
        primary: 'hsl(var(--color-primary))',
        secondary: 'hsl(var(--color-secondary))',
        destructive: 'hsl(var(--color-destructive))',
        muted: 'hsl(var(--color-muted))',
        accent: 'hsl(var(--color-accent))',
        border: 'hsl(var(--color-border))',
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
      },
      spacing: {
        // Responsive spacing scale
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 2px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 2px)',
      },
    },
  },
  plugins: [],
}

export default config
```

### 3. Add Design Tokens
Create `src/styles/tokens.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Color tokens */
    --color-primary: 217 91% 60%;
    --color-primary-foreground: 0 0% 98%;
    --color-secondary: 215 28% 17%;
    --color-secondary-foreground: 210 40% 98%;
    --color-destructive: 0 84% 60%;
    --color-destructive-foreground: 210 40% 98%;
    --color-muted: 210 40% 96%;
    --color-muted-foreground: 215 16% 47%;
    --color-accent: 210 40% 96%;
    --color-accent-foreground: 215 16% 47%;
    --color-border: 214 32% 91%;
    --color-background: 0 0% 100%;
    --color-foreground: 222 84% 5%;

    /* Spacing tokens */
    --spacing-0: 0;
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-10: 2.5rem;
    --spacing-12: 3rem;

    /* Border radius */
    --radius: 0.5rem;

    /* Typography */
    --font-sans: ui-sans-serif, system-ui, sans-serif;
    --font-mono: ui-monospace, 'Cascadia Code', monospace;
  }

  [data-theme="dark"] {
    --color-primary: 217 91% 70%;
    --color-background: 222 84% 5%;
    --color-foreground: 210 40% 98%;
    --color-muted: 217 33% 17%;
    --color-border: 217 33% 17%;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### 4. Create Utility Functions
Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTheme(): string {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function setTheme(theme: 'light' | 'dark' | 'high-contrast'): void {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}
```

## Component Usage Examples

### Button Component
```tsx
import { Button } from '@/components/ui/button'

// Basic usage
<Button>Click me</Button>

// With variants and sizes
<Button variant="primary" size="lg">Primary Button</Button>
<Button variant="outline" size="sm">Outline Button</Button>

// With icons and states
<Button startIcon={<PlusIcon />} loading>
  Add Item
</Button>

// Accessibility features
<Button
  variant="destructive"
  aria-label="Delete selected items"
  onClick={handleDelete}
>
  Delete
</Button>
```

### Input Component
```tsx
import { Input } from '@/components/ui/input'

// Basic usage
<Input placeholder="Enter your name" />

// With validation states
<Input
  state="error"
  errorMessage="Email is required"
  type="email"
  required
/>

// With icons and helper text
<Input
  startIcon={<SearchIcon />}
  helperText="Search by name or email"
  clearable
/>
```

### Card Component
```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

// Simple card
<Card>
  <CardContent>
    Simple card content
  </CardContent>
</Card>

// Interactive card
<Card interactive onClick={handleClick}>
  <CardHeader>Card Title</CardHeader>
  <CardContent>Interactive card content</CardContent>
  <CardFooter>Card actions</CardFooter>
</Card>
```

## Testing Acceptance Scenarios

### Scenario 1: Design System Component Usage
**Given** I'm building a new page
**When** I use the design system components
**Then** The visual styling automatically matches brand guidelines

```tsx
// Test: Components inherit design tokens automatically
import { Button, Input, Card } from '@/components/ui'

export default function TestPage() {
  return (
    <div className="p-6 space-y-4">
      <Button variant="primary">Consistent Button</Button>
      <Input placeholder="Consistent Input" />
      <Card>
        <CardContent>Consistent Card</CardContent>
      </Card>
    </div>
  )
}
```

### Scenario 2: Form Component Consistency
**Given** I need to implement a form
**When** I use design system form components
**Then** All inputs have consistent focus states and accessibility

```tsx
// Test: Form components with consistent behavior
export function TestForm() {
  return (
    <form className="space-y-4">
      <Input
        label="Email"
        type="email"
        required
        aria-describedby="email-help"
      />
      <Input
        label="Password"
        type="password"
        required
      />
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  )
}
```

### Scenario 3: Sandbox Component Preview
**Given** I want to see all component variations
**When** I visit the sandbox page
**Then** I can preview all component states and variants

```tsx
// Create: src/app/sandbox/page.tsx
export default function SandboxPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Design System Sandbox</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Input placeholder="Default state" />
          <Input state="error" errorMessage="Error state" />
          <Input state="success" helperText="Success state" />
          <Input disabled placeholder="Disabled state" />
        </div>
      </section>
    </div>
  )
}
```

### Scenario 4: Theme Switching
**Given** A designer updates brand colors
**When** They modify design tokens
**Then** All components automatically reflect new styling

```tsx
// Test: Theme switching functionality
import { setTheme } from '@/lib/utils'

export function ThemeToggle() {
  const toggleTheme = () => {
    const current = getTheme()
    setTheme(current === 'light' ? 'dark' : 'light')
  }

  return (
    <Button onClick={toggleTheme} variant="outline">
      Toggle Theme
    </Button>
  )
}
```

### Scenario 5: Keyboard Navigation
**Given** A user navigates with keyboard
**When** They interact with design system components
**Then** Focus indicators are visible and navigation is logical

```tsx
// Test: Keyboard navigation
export function KeyboardTestPage() {
  return (
    <div className="p-6 space-y-4">
      <Button>First Button</Button>
      <Input placeholder="Focusable input" />
      <Card interactive>
        <CardContent>Interactive card</CardContent>
      </Card>
      <Button>Last Button</Button>
    </div>
  )
}

// Test keyboard navigation:
// 1. Tab through all interactive elements
// 2. Verify focus indicators are visible
// 3. Test Enter/Space activation
// 4. Test Escape key behaviors
```

## Verification Checklist

### ✅ Design Token Integration
- [ ] CSS custom properties defined in tokens.css
- [ ] Tailwind config references design tokens
- [ ] Components consume tokens consistently
- [ ] Theme switching works without component re-rendering

### ✅ Component Functionality
- [ ] Button variants render correctly
- [ ] Input validation states work
- [ ] Card interactions respond properly
- [ ] All components support required props

### ✅ Accessibility Compliance
- [ ] Focus indicators visible with 3:1 contrast
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader support with proper ARIA attributes
- [ ] Reduced motion preferences respected

### ✅ Performance Requirements
- [ ] Components render in <100ms
- [ ] Prop changes don't cause unnecessary re-renders
- [ ] Bundle size optimized with tree-shaking
- [ ] No runtime style calculations

### ✅ Developer Experience
- [ ] TypeScript definitions provide IntelliSense
- [ ] Component APIs are intuitive and consistent
- [ ] Error messages are helpful and actionable
- [ ] Documentation is comprehensive

## Next Steps

1. **Run Tests**: Execute all acceptance scenarios above
2. **Accessibility Audit**: Test with screen readers and keyboard-only navigation
3. **Performance Baseline**: Measure component render times and bundle sizes
4. **Visual Regression**: Set up automated visual testing
5. **Documentation**: Complete component documentation and usage guidelines

## Troubleshooting

### Common Issues

**Components not inheriting theme colors:**
- Verify CSS custom properties are defined in tokens.css
- Check Tailwind config extends theme correctly
- Ensure components use design token class names

**Focus indicators not visible:**
- Check focus ring tokens are defined
- Verify contrast ratios meet 3:1 requirement
- Test with different color themes

**Bundle size larger than expected:**
- Enable tree-shaking for component imports
- Configure Tailwind CSS purging correctly
- Analyze bundle with webpack-bundle-analyzer

For additional support, refer to the component contracts in `/contracts/` directory.