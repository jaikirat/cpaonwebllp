/**
 * Card Component Contract
 * Design System v1.0.0
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

/**
 * Card component state definitions
 */
export interface CardState {
  /**
   * Current interactive state
   */
  state: 'default' | 'hover' | 'focus' | 'pressed' | 'selected' | 'disabled';

  /**
   * Whether card currently has focus
   */
  focused: boolean;

  /**
   * Whether card is being pressed
   */
  pressed: boolean;

  /**
   * Whether card is in selected state
   */
  selected: boolean;
}

/**
 * Design tokens consumed by Card component
 */
export interface CardTokens {
  // Surface tokens
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;

  // Shadow tokens
  boxShadow: string;
  hoverBoxShadow: string;
  focusBoxShadow: string;

  // Spacing tokens
  padding: string;
  gap: string; // Between card sections

  // Interactive state tokens
  hoverBackgroundColor: string;
  focusRingColor: string;
  focusRingWidth: string;
  selectedBorderColor: string;
  selectedBackgroundColor: string;

  // Transition tokens
  transitionDuration: string;
  transitionTimingFunction: string;
  transitionProperty: string;
}

/**
 * Card accessibility requirements
 */
export interface CardAccessibility {
  /**
   * Keyboard interactions (for interactive cards)
   */
  keyboardSupport: {
    Tab: 'focus card';
    'Shift+Tab': 'focus previous element';
    Enter: 'activate card';
    Space: 'activate card';
  };

  /**
   * ARIA attributes
   */
  ariaAttributes: {
    role?: 'button' | 'link' | 'article' | 'region';
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-selected'?: boolean;
    'aria-pressed'?: boolean;
    tabIndex?: number;
  };

  /**
   * Focus management
   */
  focusManagement: {
    focusIndicator: 'visible with 3:1 contrast ratio';
    focusOrder: 'logical tab order';
    focusWithin: 'focus management for card content';
  };

  /**
   * Screen reader support
   */
  screenReader: {
    semantics: 'appropriate semantic markup (article, section, etc.)';
    interaction: 'interactive state announced';
    selection: 'selected state announced';
    description: 'card purpose described';
  };
}

/**
 * Card variants and their design token mappings
 */
export const CardVariantTokens: Record<CardProps['variant'], Partial<CardTokens>> = {
  default: {
    backgroundColor: 'var(--color-card-background)',
    borderColor: 'transparent',
    borderWidth: '0',
    boxShadow: 'var(--shadow-sm)',
  },
  outlined: {
    backgroundColor: 'var(--color-card-background)',
    borderColor: 'var(--color-border)',
    borderWidth: 'var(--border-width)',
    boxShadow: 'none',
  },
  elevated: {
    backgroundColor: 'var(--color-card-background)',
    borderColor: 'transparent',
    borderWidth: '0',
    boxShadow: 'var(--shadow-md)',
    hoverBoxShadow: 'var(--shadow-lg)',
  },
  filled: {
    backgroundColor: 'var(--color-muted)',
    borderColor: 'transparent',
    borderWidth: '0',
    boxShadow: 'none',
  },
};

/**
 * Card size specifications
 */
export const CardSizeTokens: Record<CardProps['size'], Partial<CardTokens>> = {
  sm: {
    padding: 'var(--spacing-3)',
    gap: 'var(--spacing-2)',
    borderRadius: 'var(--radius-sm)',
  },
  md: {
    padding: 'var(--spacing-4)',
    gap: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
  },
  lg: {
    padding: 'var(--spacing-6)',
    gap: 'var(--spacing-4)',
    borderRadius: 'var(--radius-lg)',
  },
};

/**
 * Card state interactions
 */
export interface CardStateTransitions {
  default: {
    onMouseEnter: 'hover';
    onFocus: 'focus';
    onMouseDown: 'pressed';
    onSelect: 'selected';
  };
  hover: {
    onMouseLeave: 'default' | 'selected';
    onFocus: 'focus-hover';
    onMouseDown: 'pressed';
  };
  focus: {
    onBlur: 'default' | 'selected';
    onMouseEnter: 'focus-hover';
    onMouseDown: 'pressed';
  };
  'focus-hover': {
    onBlur: 'hover';
    onMouseLeave: 'focus';
    onMouseDown: 'pressed';
  };
  pressed: {
    onMouseUp: 'hover' | 'focus-hover' | 'default';
    onClick: 'selected' | 'default';
  };
  selected: {
    onMouseEnter: 'selected-hover';
    onFocus: 'selected-focus';
    onDeselect: 'default';
  };
  'selected-hover': {
    onMouseLeave: 'selected';
    onFocus: 'selected-focus';
  };
  'selected-focus': {
    onBlur: 'selected';
    onMouseEnter: 'selected-hover';
  };
  disabled: Record<string, never>;
}

/**
 * Card composition structure
 */
export interface CardComposition {
  /**
   * Card container with all tokens applied
   */
  Card: React.ComponentType<CardProps>;

  /**
   * Optional header section
   */
  Header: React.ComponentType<CardHeaderProps>;

  /**
   * Main content section
   */
  Content: React.ComponentType<CardContentProps>;

  /**
   * Optional footer section
   */
  Footer: React.ComponentType<CardFooterProps>;
}

/**
 * Card usage patterns
 */
export interface CardUsagePatterns {
  /**
   * Simple content card
   */
  simple: {
    structure: 'Card > Content';
    use: 'Basic content display';
  };

  /**
   * Card with header and content
   */
  withHeader: {
    structure: 'Card > Header + Content';
    use: 'Titled content sections';
  };

  /**
   * Full card with all sections
   */
  full: {
    structure: 'Card > Header + Content + Footer';
    use: 'Complex content with actions';
  };

  /**
   * Interactive card
   */
  interactive: {
    structure: 'Card[interactive] > Content';
    use: 'Clickable content items';
    behavior: 'Hover effects and focus management';
  };

  /**
   * Selectable card
   */
  selectable: {
    structure: 'Card[interactive,selected] > Content';
    use: 'Multiple choice selections';
    behavior: 'Toggle selection state';
  };
}