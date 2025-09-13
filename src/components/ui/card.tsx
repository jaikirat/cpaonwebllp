/**
 * Card Component - Unified Design System
 *
 * A versatile card component with support for different variants, sizes, and interactive states.
 * Implements the Card component contract with proper accessibility and design token integration.
 *
 * Features:
 * - Multiple visual variants (default, outlined, elevated, filled)
 * - Size variations (sm, md, lg)
 * - Interactive states with hover and focus management
 * - Proper semantic HTML structure
 * - WCAG 2.1 AA compliant
 * - Design token integration for consistent theming
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

// ================================
// TYPE DEFINITIONS
// ================================

/**
 * Props interface for the Card component.
 *
 * Comprehensive interface supporting all card variants, sizes, and
 * interactive behaviors. Includes accessibility features and semantic
 * HTML options for proper document structure.
 *
 * @example
 * ```tsx
 * const cardProps: CardProps = {
 *   variant: 'elevated',
 *   size: 'lg',
 *   interactive: true,
 *   onClick: handleCardClick,
 *   'aria-label': 'User profile card',
 *   selected: isSelected
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface CardProps {
  /**
   * Card content including header, body, and footer sections.
   *
   * Typically composed of CardHeader, CardContent, and CardFooter
   * components, but can contain any React elements.
   *
   * @example
   * ```tsx
   * <Card>
   *   <CardHeader>
   *     <CardTitle>User Profile</CardTitle>
   *   </CardHeader>
   *   <CardContent>
   *     <p>Profile details go here</p>
   *   </CardContent>
   * </Card>
   * ```
   */
  children: React.ReactNode;

  /**
   * Visual styling variant of the card.
   *
   * - `default`: Subtle background with light shadow
   * - `outlined`: Transparent background with border
   * - `elevated`: Prominent shadow for floating appearance
   * - `filled`: Secondary background color, no shadow
   *
   * @default "default"
   * @example
   * ```tsx
   * <Card variant="elevated">Floating card</Card>
   * <Card variant="outlined">Bordered card</Card>
   * ```
   */
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';

  /**
   * Size affecting internal padding and spacing.
   *
   * - `sm`: 12px padding, compact spacing (mobile-friendly)
   * - `md`: 16px padding, standard spacing (most common)
   * - `lg`: 24px padding, generous spacing (desktop focus)
   *
   * @default "md"
   * @example
   * ```tsx
   * <Card size="sm">Compact card</Card>
   * <Card size="lg">Spacious card</Card>
   * ```
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the card is interactive and clickable.
   *
   * When true, adds hover effects, focus states, cursor pointer,
   * and keyboard navigation. Requires onClick handler to be functional.
   *
   * @default false
   * @example
   * ```tsx
   * <Card interactive onClick={handleSelect}>
   *   Clickable card content
   * </Card>
   * ```
   *
   * @accessibility
   * - Adds role="button" and proper focus management
   * - Keyboard activation with Enter/Space keys
   * - Focus indicators respect motion preferences
   */
  interactive?: boolean;

  /**
   * Whether the card is disabled and non-interactive.
   *
   * Dims appearance, prevents interaction, and removes from
   * tab order. Only affects interactive cards.
   *
   * @default false
   * @example
   * ```tsx
   * <Card interactive disabled onClick={handleClick}>
   *   Disabled card (not clickable)
   * </Card>
   * ```
   *
   * @accessibility
   * - Sets aria-disabled for screen readers
   * - Removes from keyboard navigation
   * - Prevents onClick execution
   */
  disabled?: boolean;

  /**
   * Click handler for interactive cards.
   *
   * Called when card is clicked or activated via keyboard
   * (Enter/Space). Only functions when interactive=true and
   * disabled=false.
   *
   * @param event - React mouse event (synthetic for keyboard)
   * @example
   * ```tsx
   * const handleCardClick = (event: React.MouseEvent) => {
   *   event.preventDefault();
   *   selectItem(itemId);
   *   trackEvent('card_selected');
   * };
   * ```
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * HTML element to render the card as.
   *
   * Choose based on content semantics for better document structure
   * and accessibility. Affects screen reader navigation.
   *
   * - `div`: Generic container (default)
   * - `article`: Independent, standalone content
   * - `section`: Thematic grouping with heading
   * - `aside`: Tangentially related content
   *
   * @default "div"
   * @example
   * ```tsx
   * <Card as="article">Blog post preview</Card>
   * <Card as="section">Settings group</Card>
   * ```
   *
   * @accessibility
   * - Proper semantic structure aids navigation
   * - Screen readers understand content relationships
   */
  as?: 'div' | 'article' | 'section' | 'aside';

  /**
   * Accessible label for interactive cards.
   *
   * Provides screen readers with a clear description of the
   * card's purpose when content alone isn't sufficient.
   *
   * @example
   * ```tsx
   * <Card
   *   interactive
   *   onClick={openProfile}
   *   aria-label="Open John Doe's profile"
   * >
   *   <img src={avatar} alt="" />
   *   <h3>John Doe</h3>
   * </Card>
   * ```
   *
   * @accessibility
   * - Essential for cards with minimal text content
   * - Should describe the action, not just content
   * - Overrides content-based accessible name
   */
  'aria-label'?: string;

  /**
   * ID of element that describes the card
   */
  'aria-describedby'?: string;

  /**
   * Whether the card represents a selected/active state.
   *
   * Adds visual selection indicators and appropriate ARIA
   * attributes. Commonly used in lists or selectable groups.
   *
   * @default false
   * @example
   * ```tsx
   * <Card
   *   interactive
   *   selected={selectedId === item.id}
   *   onClick={() => setSelectedId(item.id)}
   * >
   *   Selectable item
   * </Card>
   * ```
   *
   * @accessibility
   * - Sets aria-selected and aria-pressed attributes
   * - Visual indicators support high contrast mode
   * - Clear selection state for screen readers
   */
  selected?: boolean;
}

/**
 * Props interface for Card Header subcomponent.
 *
 * Used to create consistent header sections within cards,
 * typically containing titles, subtitles, and action buttons.
 *
 * @since 1.0.0
 */
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Props interface for Card Content subcomponent.
 *
 * The main content area of the card with flex-1 to fill
 * available space between header and footer.
 *
 * @since 1.0.0
 */
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Props interface for Card Footer subcomponent.
 *
 * Used for action buttons, metadata, or secondary information
 * at the bottom of the card.
 *
 * @since 1.0.0
 */
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// ================================
// VARIANT CLASSES
// ================================

/**
 * Base card styles using design tokens.
 *
 * Foundational CSS classes applied to all card variants.
 * Uses design system tokens for consistent theming.
 *
 * @internal
 */
const cardBaseClasses = [
  // Layout and structure
  'relative',
  'flex',
  'flex-col',

  // Typography
  'text-text',

  // Transitions
  'transition-all',
  'duration-normal',
  'ease-smooth',
].join(' ');

/**
 * Variant-specific styling classes
 */
const cardVariantClasses = {
  default: [
    'bg-surface',
    'shadow-sm',
    'border-0',
  ].join(' '),

  outlined: [
    'bg-surface',
    'border',
    'border-border',
    'shadow-none',
  ].join(' '),

  elevated: [
    'bg-surface',
    'shadow-md',
    'border-0',
  ].join(' '),

  filled: [
    'bg-surface-secondary',
    'border-0',
    'shadow-none',
  ].join(' '),
};

/**
 * Size-specific styling classes
 */
const cardSizeClasses = {
  sm: [
    'p-3', // var(--spacing-3) = 12px
    'gap-2', // var(--spacing-2) = 8px
    'rounded-sm', // var(--radius-sm) = 2px
  ].join(' '),

  md: [
    'p-4', // var(--spacing-4) = 16px
    'gap-3', // var(--spacing-3) = 12px
    'rounded-md', // var(--radius-md) = 6px
  ].join(' '),

  lg: [
    'p-6', // var(--spacing-6) = 24px
    'gap-4', // var(--spacing-4) = 16px
    'rounded-lg', // var(--radius-lg) = 8px
  ].join(' '),
};

/**
 * Interactive state classes
 */
const cardInteractiveClasses = [
  'cursor-pointer',
  'select-none',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-focus-ring',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-focus-ring-offset',
].join(' ');

/**
 * Hover state classes
 */
const cardHoverClasses = {
  default: 'hover:shadow-md hover:bg-surface-hover',
  outlined: 'hover:bg-surface-hover hover:border-border-secondary',
  elevated: 'hover:shadow-lg hover:bg-surface-hover',
  filled: 'hover:bg-surface-tertiary',
};

/**
 * Selected state classes
 */
const cardSelectedClasses = {
  default: 'ring-2 ring-primary bg-surface-hover',
  outlined: 'border-primary ring-1 ring-primary bg-surface-hover',
  elevated: 'ring-2 ring-primary bg-surface-hover shadow-lg',
  filled: 'ring-2 ring-primary bg-surface-active',
};

/**
 * Disabled state classes
 */
const cardDisabledClasses = [
  'opacity-50',
  'cursor-not-allowed',
  'pointer-events-none',
].join(' ');

// ================================
// KEYBOARD INTERACTION HANDLER
// ================================

/**
 * Handles keyboard interactions for interactive cards.
 *
 * Provides standard button-like keyboard behavior with Enter and Space
 * key activation. Creates synthetic mouse events for consistency.
 *
 * @param event - Keyboard event from card element
 * @param onClick - Click handler to call on activation
 * @param disabled - Whether card is disabled
 * @internal
 */
const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
  disabled?: boolean,
) => {
  if (disabled || !onClick) return;

  // Handle Enter and Space key activation
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    // Create a synthetic mouse event for consistency
    const syntheticEvent = {
      ...event,
      type: 'click',
      button: 0,
      buttons: 1,
    } as unknown as React.MouseEvent<HTMLDivElement>;
    onClick(syntheticEvent);
  }
};

// ================================
// MAIN CARD COMPONENT
// ================================

/**
 * Main Card component with comprehensive design system integration.
 *
 * A versatile card component supporting multiple visual variants,
 * interactive behaviors, and full accessibility compliance. Perfect
 * for content grouping, navigation items, and selectable interfaces.
 *
 * @param props - Card component properties
 * @param ref - Forwarded ref to the card element
 * @returns A styled, accessible card element
 *
 * @example Basic Content Card
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Article Title</CardTitle>
 *     <CardDescription>Brief summary</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Main article content goes here...</p>
 *   </CardContent>
 * </Card>
 * ```
 *
 * @example Interactive Selection Card
 * ```tsx
 * <Card
 *   interactive
 *   selected={selectedId === item.id}
 *   onClick={() => handleSelect(item.id)}
 *   variant="outlined"
 *   aria-label={`Select ${item.name}`}
 * >
 *   <CardContent>
 *     <h3>{item.name}</h3>
 *     <p>{item.description}</p>
 *   </CardContent>
 * </Card>
 * ```
 *
 * @example Semantic Article Card
 * ```tsx
 * <Card as="article" variant="elevated" size="lg">
 *   <CardHeader>
 *     <CardTitle>Blog Post Title</CardTitle>
 *     <CardDescription>Published on {date}</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <img src={image} alt="" />
 *     <p>{excerpt}</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button variant="outline">Read More</Button>
 *   </CardFooter>
 * </Card>
 * ```
 *
 * @accessibility
 * - Semantic HTML with configurable element types
 * - Interactive cards support keyboard navigation
 * - Proper ARIA attributes for selection states
 * - Focus management with visible indicators
 * - Screen reader friendly with clear labels
 * - High contrast mode support
 *
 * @since 1.0.0
 * @see {@link CardHeader} - Header subcomponent
 * @see {@link CardContent} - Content subcomponent
 * @see {@link CardFooter} - Footer subcomponent
 * @see {@link CardTitle} - Title helper component
 * @see {@link CardDescription} - Description helper component
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      interactive = false,
      disabled = false,
      onClick,
      className,
      as: Component = 'div',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      selected = false,
      ...props
    },
    ref,
  ) => {
    // Determine ARIA role based on interactivity
    const role = interactive ? 'button' : undefined;

    // Determine tabIndex for keyboard navigation
    const tabIndex = interactive && !disabled ? 0 : undefined;

    // Build class names
    const classes = cn(
      cardBaseClasses,
      cardVariantClasses[variant],
      cardSizeClasses[size],

      // Interactive states
      interactive && !disabled && cardInteractiveClasses,
      interactive && !disabled && cardHoverClasses[variant],

      // Selected state
      selected && cardSelectedClasses[variant],

      // Disabled state
      disabled && cardDisabledClasses,

      // Custom classes
      className,
    );

    return (
      <Component
        ref={ref}
        role={role}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-selected={interactive && selected ? selected : undefined}
        aria-pressed={interactive && selected ? selected : undefined}
        aria-disabled={disabled}
        className={classes}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(e) => handleKeyDown(e, onClick, disabled)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Card.displayName = 'Card';

// ================================
// CARD SUBCOMPONENTS
// ================================

/**
 * Card Header subcomponent for titles and metadata.
 *
 * Designed to contain CardTitle, CardDescription, and any header
 * actions like buttons or badges. Provides consistent spacing.
 *
 * @param props - Header component props
 * @param ref - Forwarded ref to header element
 * @returns Header section with consistent styling
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Dashboard Overview</CardTitle>
 *   <CardDescription>Last updated 5 minutes ago</CardDescription>
 * </CardHeader>
 * ```
 *
 * @since 1.0.0
 * @see {@link CardTitle} - For consistent title styling
 * @see {@link CardDescription} - For subtitle/meta text
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex',
        'flex-col',
        'gap-1.5',
        'pb-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Content subcomponent for main content area.
 *
 * The primary content section that expands to fill available
 * space between header and footer. Supports any content type.
 *
 * @param props - Content component props
 * @param ref - Forwarded ref to content element
 * @returns Main content area with flex layout
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <img src={thumbnail} alt="Product image" />
 *   <p>Product description and details...</p>
 *   <div className="flex gap-2">
 *     <Badge>New</Badge>
 *     <Badge variant="outline">Popular</Badge>
 *   </div>
 * </CardContent>
 * ```
 *
 * @since 1.0.0
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex-1',
        'flex',
        'flex-col',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

CardContent.displayName = 'CardContent';

/**
 * Card Footer subcomponent for actions and metadata.
 *
 * Typically contains buttons, links, or secondary information.
 * Positioned at the bottom with consistent spacing from content.
 *
 * @param props - Footer component props
 * @param ref - Forwarded ref to footer element
 * @returns Footer section with action-oriented layout
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="primary">Save Changes</Button>
 * </CardFooter>
 * ```
 *
 * @example With Metadata
 * ```tsx
 * <CardFooter>
 *   <span className="text-sm text-gray-500">2 hours ago</span>
 *   <div className="flex gap-2">
 *     <Button size="sm">Edit</Button>
 *     <Button size="sm" variant="outline">Share</Button>
 *   </div>
 * </CardFooter>
 * ```
 *
 * @since 1.0.0
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex',
        'items-center',
        'pt-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';

// ================================
// ADDITIONAL CARD COMPONENTS
// ================================

/**
 * Card Title helper component for consistent heading styling.
 *
 * Provides standardized typography for card titles with proper
 * semantic heading level and design system integration.
 *
 * @param props - Standard heading element props
 * @param ref - Forwarded ref to heading element
 * @returns Styled h3 heading element
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>User Settings</CardTitle>
 *   <CardDescription>Manage your account preferences</CardDescription>
 * </CardHeader>
 * ```
 *
 * @accessibility
 * - Uses semantic h3 element for proper document outline
 * - Respects heading hierarchy in screen readers
 * - Consistent font sizing across the design system
 *
 * @since 1.0.0
 * @see {@link CardDescription} - For subtitle text below title
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg',
      'font-semibold',
      'leading-tight',
      'tracking-tight',
      'text-text',
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

/**
 * Card Description helper component for subtitle and meta text.
 *
 * Provides standardized styling for secondary text below titles
 * or other descriptive content within cards.
 *
 * @param props - Standard paragraph element props
 * @param ref - Forwarded ref to paragraph element
 * @returns Styled paragraph with muted text styling
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Recent Activity</CardTitle>
 *   <CardDescription>
 *     Your recent actions and updates from the last 7 days
 *   </CardDescription>
 * </CardHeader>
 * ```
 *
 * @example As Metadata
 * ```tsx
 * <CardContent>
 *   <h4>Project Alpha</h4>
 *   <CardDescription>Last modified by John Doe</CardDescription>
 *   <p>Project details and content...</p>
 * </CardContent>
 * ```
 *
 * @since 1.0.0
 * @see {@link CardTitle} - For primary card headings
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm',
      'text-text-secondary',
      'leading-normal',
      className,
    )}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

// ================================
// EXPORTS
// ================================

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
};