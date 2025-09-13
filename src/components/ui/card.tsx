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
 * Card component props following the contract specification
 */
export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Visual variant of the card
   * @default "default"
   */
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';

  /**
   * Size of the card affecting padding and spacing
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the card is interactive (clickable)
   * @default false
   */
  interactive?: boolean;

  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler for interactive cards
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Semantic element to render as
   * @default "div"
   */
  as?: 'div' | 'article' | 'section' | 'aside';

  /**
   * Accessible label for interactive cards
   */
  'aria-label'?: string;

  /**
   * ID of element that describes the card
   */
  'aria-describedby'?: string;

  /**
   * Whether the card represents a selected state
   */
  selected?: boolean;
}

/**
 * Card Header subcomponent props
 */
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Content subcomponent props
 */
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Footer subcomponent props
 */
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// ================================
// VARIANT CLASSES
// ================================

/**
 * Base card styles using design tokens
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
 * Handles keyboard interactions for interactive cards
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
 * Main Card component with full feature support
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
 * Card Header subcomponent
 * Contains title, subtitle, and optional header actions
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
 * Card Content subcomponent
 * Contains the main card content
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
 * Card Footer subcomponent
 * Contains actions, metadata, or additional information
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
 * Card Title component for consistent heading styling
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
 * Card Description component for subtitle/description text
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