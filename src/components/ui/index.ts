/**
 * @fileoverview Core UI Components - Design System Integration
 *
 * This module provides a comprehensive collection of accessible, themeable
 * UI components built with TypeScript, Tailwind CSS, and design tokens.
 * Components follow WCAG 2.1 AA accessibility standards and integrate
 * seamlessly with the unified design system.
 *
 * ## Component Overview
 *
 * ### Form Controls
 * - **Button**: Multi-variant button with loading states and icons
 * - **Input**: Comprehensive text input with validation and icons
 * - **Label**: Accessible form labels with proper associations
 *
 * ### Layout Components
 * - **Card**: Versatile content container with multiple variants
 * - **CardHeader/Content/Footer**: Structural card components
 * - **CardTitle/Description**: Typography helpers for cards
 *
 * ## Design System Integration
 *
 * All components integrate with the design token system through:
 * - CSS custom properties for consistent theming
 * - Automatic light/dark/high-contrast theme support
 * - Responsive design with mobile-first approach
 * - Consistent spacing, typography, and color scales
 *
 * ## Accessibility Features
 *
 * - WCAG 2.1 AA compliant with proper contrast ratios
 * - Keyboard navigation support for all interactive elements
 * - Screen reader compatibility with semantic HTML and ARIA
 * - Focus management with visible indicators
 * - Motion preferences respect (prefers-reduced-motion)
 * - High contrast mode support for visual accessibility
 *
 * ## Usage Patterns
 *
 * ### Basic Form Example
 * ```tsx
 * import { Button, Input, Label, Card, CardContent } from '@/components/ui';
 *
 * function ContactForm() {
 *   return (
 *     <Card>
 *       <CardContent>
 *         <Label htmlFor="email">Email Address</Label>
 *         <Input
 *           id="email"
 *           type="email"
 *           placeholder="Enter your email"
 *           required
 *         />
 *         <Button type="submit" variant="primary">
 *           Submit
 *         </Button>
 *       </CardContent>
 *     </Card>
 *   );
 * }
 * ```
 *
 * ### Interactive Card Grid
 * ```tsx
 * import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
 *
 * function ProductGrid({ products }) {
 *   return (
 *     <div className="grid gap-4 md:grid-cols-3">
 *       {products.map((product) => (
 *         <Card
 *           key={product.id}
 *           interactive
 *           onClick={() => selectProduct(product.id)}
 *           variant="outlined"
 *         >
 *           <CardHeader>
 *             <CardTitle>{product.name}</CardTitle>
 *           </CardHeader>
 *           <CardContent>
 *             <p>{product.description}</p>
 *           </CardContent>
 *         </Card>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * ## Theme Integration
 *
 * Components automatically respond to theme changes through the
 * ThemeProvider context. No additional configuration needed:
 *
 * ```tsx
 * import { ThemeProvider } from '@/components/theme-provider';
 * import { Button } from '@/components/ui';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <Button>Themed Button</Button>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @author Design System Team
 * @since 1.0.0
 * @version 1.0.0
 */

// ================================
// FORM CONTROLS
// ================================

/**
 * Comprehensive button component with variants, sizes, and accessibility features.
 * Supports loading states, icons, and full keyboard navigation.
 *
 * @see {@link https://design-system.example.com/button} Button documentation
 */
export { Button, buttonVariants, type ButtonProps } from './button';

/**
 * Feature-rich input component with validation states, icons, and form integration.
 * Supports both controlled and uncontrolled usage patterns.
 *
 * @see {@link https://design-system.example.com/input} Input documentation
 */
export { Input, type InputProps } from './input';

/**
 * Accessible form label component with proper form associations.
 * Integrates seamlessly with form controls.
 *
 * @see {@link https://design-system.example.com/label} Label documentation
 */
export { Label } from './label';

// ================================
// LAYOUT COMPONENTS
// ================================

/**
 * Versatile card component suite for content organization and presentation.
 * Includes main Card component and structural subcomponents.
 *
 * @see {@link https://design-system.example.com/card} Card documentation
 */
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';