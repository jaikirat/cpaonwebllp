/**
 * Button Component Contract
 * Design System v1.0.0
 */

export interface ButtonProps {
  /**
   * Button content (text, icons, or other React nodes)
   */
  children: React.ReactNode;

  /**
   * Visual style variant of the button
   * @default "default"
   */
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

  /**
   * Size of the button affecting padding and font size
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button should take full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Loading state - shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Icon to display before button text
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display after button text
   */
  endIcon?: React.ReactNode;

  /**
   * Button type for form submission
   * @default "button"
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Accessible label when button content is not descriptive
   */
  'aria-label'?: string;

  /**
   * ID of element that describes the button
   */
  'aria-describedby'?: string;
}

/**
 * Button component state definitions
 */
export interface ButtonState {
  /**
   * Current interactive state
   */
  state: 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading';

  /**
   * Whether button currently has focus
   */
  focused: boolean;

  /**
   * Whether button is being pressed
   */
  pressed: boolean;
}

/**
 * Design tokens consumed by Button component
 */
export interface ButtonTokens {
  // Color tokens
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  focusRingColor: string;

  // Spacing tokens
  paddingX: string;
  paddingY: string;
  gap: string; // For icons

  // Typography tokens
  fontSize: string;
  fontWeight: string;
  lineHeight: string;

  // Border tokens
  borderWidth: string;
  borderRadius: string;

  // Shadow tokens
  boxShadow: string;
  focusBoxShadow: string;

  // Transition tokens
  transitionDuration: string;
  transitionTimingFunction: string;
}

/**
 * Button accessibility requirements
 */
export interface ButtonAccessibility {
  /**
   * Keyboard interactions
   */
  keyboardSupport: {
    Enter: 'activate button';
    Space: 'activate button';
    Tab: 'focus button';
    'Shift+Tab': 'focus previous element';
  };

  /**
   * ARIA attributes
   */
  ariaAttributes: {
    role: 'button';
    'aria-pressed'?: boolean; // For toggle buttons
    'aria-expanded'?: boolean; // For dropdown triggers
    'aria-haspopup'?: boolean; // For menu triggers
    'aria-controls'?: string; // For buttons that control other elements
  };

  /**
   * Focus management
   */
  focusManagement: {
    focusIndicator: 'visible with 3:1 contrast ratio';
    focusOrder: 'logical tab order';
    focusReturn: 'returns focus after modal/dropdown closes';
  };

  /**
   * Screen reader support
   */
  screenReader: {
    accessibleName: 'provided by children or aria-label';
    loadingState: 'announced when loading changes';
    disabledState: 'announced as unavailable';
  };
}

/**
 * Button variants and their design token mappings
 */
export const ButtonVariantTokens: Record<ButtonProps['variant'], Partial<ButtonTokens>> = {
  default: {
    backgroundColor: 'var(--color-surface)',
    textColor: 'var(--color-text)',
    borderColor: 'var(--color-border)',
  },
  primary: {
    backgroundColor: 'var(--color-primary)',
    textColor: 'var(--color-primary-foreground)',
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: 'var(--color-secondary)',
    textColor: 'var(--color-secondary-foreground)',
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    textColor: 'var(--color-text)',
    borderColor: 'var(--color-border)',
  },
  ghost: {
    backgroundColor: 'transparent',
    textColor: 'var(--color-text)',
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: 'var(--color-destructive)',
    textColor: 'var(--color-destructive-foreground)',
    borderColor: 'transparent',
  },
};

/**
 * Button size specifications
 */
export const ButtonSizeTokens: Record<ButtonProps['size'], Partial<ButtonTokens>> = {
  sm: {
    paddingX: 'var(--spacing-3)',
    paddingY: 'var(--spacing-1.5)',
    fontSize: 'var(--text-sm)',
    gap: 'var(--spacing-1.5)',
  },
  md: {
    paddingX: 'var(--spacing-4)',
    paddingY: 'var(--spacing-2)',
    fontSize: 'var(--text-base)',
    gap: 'var(--spacing-2)',
  },
  lg: {
    paddingX: 'var(--spacing-6)',
    paddingY: 'var(--spacing-3)',
    fontSize: 'var(--text-lg)',
    gap: 'var(--spacing-2)',
  },
  xl: {
    paddingX: 'var(--spacing-8)',
    paddingY: 'var(--spacing-4)',
    fontSize: 'var(--text-xl)',
    gap: 'var(--spacing-3)',
  },
};

/**
 * Button state interactions
 */
export interface ButtonStateTransitions {
  default: {
    onMouseEnter: 'hover';
    onFocus: 'focus';
    onMouseDown: 'active';
  };
  hover: {
    onMouseLeave: 'default';
    onFocus: 'focus-hover';
    onMouseDown: 'active';
  };
  focus: {
    onBlur: 'default';
    onMouseEnter: 'focus-hover';
    onMouseDown: 'active';
  };
  'focus-hover': {
    onBlur: 'hover';
    onMouseLeave: 'focus';
    onMouseDown: 'active';
  };
  active: {
    onMouseUp: 'hover' | 'focus-hover' | 'default';
  };
  disabled: {
    // No state transitions allowed
  };
  loading: {
    // No user interactions allowed, only programmatic state change
    onLoadingComplete: 'default';
  };
}