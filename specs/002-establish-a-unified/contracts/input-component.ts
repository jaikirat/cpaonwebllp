/**
 * Input Component Contract
 * Design System v1.0.0
 */

export interface InputProps {
  /**
   * Input type
   * @default "text"
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

  /**
   * Input value
   */
  value?: string;

  /**
   * Default value for uncontrolled inputs
   */
  defaultValue?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the input is read-only
   * @default false
   */
  readOnly?: boolean;

  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;

  /**
   * Input size affecting padding and font size
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Visual state of the input
   * @default "default"
   */
  state?: 'default' | 'error' | 'warning' | 'success';

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Helper text to display below input
   */
  helperText?: string;

  /**
   * Label for the input
   */
  label?: string;

  /**
   * Icon to display at start of input
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display at end of input
   */
  endIcon?: React.ReactNode;

  /**
   * Whether to show clear button when input has value
   * @default false
   */
  clearable?: boolean;

  /**
   * Maximum number of characters
   */
  maxLength?: number;

  /**
   * Minimum number of characters
   */
  minLength?: number;

  /**
   * Pattern for validation (regex)
   */
  pattern?: string;

  /**
   * Auto-complete behavior
   */
  autoComplete?: string;

  /**
   * Auto-focus on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Input name for forms
   */
  name?: string;

  /**
   * Input ID
   */
  id?: string;

  /**
   * Change handler
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Focus handler
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Blur handler
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Key press handler
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  /**
   * Clear button click handler
   */
  onClear?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Accessible label when label prop is not provided
   */
  'aria-label'?: string;

  /**
   * ID of element that describes the input
   */
  'aria-describedby'?: string;

  /**
   * ID of element that labels the input
   */
  'aria-labelledby'?: string;

  /**
   * Whether input has invalid value
   */
  'aria-invalid'?: boolean;
}

/**
 * Input component state definitions
 */
export interface InputState {
  /**
   * Current interactive state
   */
  state: 'default' | 'focus' | 'hover' | 'disabled' | 'readonly' | 'error';

  /**
   * Whether input currently has focus
   */
  focused: boolean;

  /**
   * Whether input has content
   */
  hasValue: boolean;

  /**
   * Current validation state
   */
  validationState: 'valid' | 'invalid' | 'pending';
}

/**
 * Design tokens consumed by Input component
 */
export interface InputTokens {
  // Container tokens
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;

  // Text tokens
  textColor: string;
  placeholderColor: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;

  // Spacing tokens
  paddingX: string;
  paddingY: string;
  gap: string; // For icons

  // State tokens
  focusRingColor: string;
  focusRingWidth: string;
  errorColor: string;
  warningColor: string;
  successColor: string;

  // Shadow tokens
  boxShadow: string;
  focusBoxShadow: string;

  // Transition tokens
  transitionDuration: string;
  transitionTimingFunction: string;

  // Icon tokens
  iconSize: string;
  iconColor: string;
}

/**
 * Input accessibility requirements
 */
export interface InputAccessibility {
  /**
   * Keyboard interactions
   */
  keyboardSupport: {
    Tab: 'focus input';
    'Shift+Tab': 'focus previous element';
    Escape: 'clear input if clearable';
    Enter: 'submit form if in form';
  };

  /**
   * ARIA attributes
   */
  ariaAttributes: {
    role?: 'textbox';
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
    'aria-readonly'?: boolean;
  };

  /**
   * Focus management
   */
  focusManagement: {
    focusIndicator: 'visible with 3:1 contrast ratio';
    focusOrder: 'logical tab order';
    autoFocus: 'used sparingly, announced to screen readers';
  };

  /**
   * Screen reader support
   */
  screenReader: {
    label: 'provided by label, aria-label, or aria-labelledby';
    validation: 'errors announced immediately';
    state: 'required/readonly state announced';
    help: 'helper text associated with aria-describedby';
  };
}

/**
 * Input state variants and their design token mappings
 */
export const InputStateTokens: Record<InputProps['state'], Partial<InputTokens>> = {
  default: {
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-input-background)',
    textColor: 'var(--color-text)',
  },
  error: {
    borderColor: 'var(--color-destructive)',
    focusRingColor: 'var(--color-destructive)',
    textColor: 'var(--color-text)',
  },
  warning: {
    borderColor: 'var(--color-warning)',
    focusRingColor: 'var(--color-warning)',
    textColor: 'var(--color-text)',
  },
  success: {
    borderColor: 'var(--color-success)',
    focusRingColor: 'var(--color-success)',
    textColor: 'var(--color-text)',
  },
};

/**
 * Input size specifications
 */
export const InputSizeTokens: Record<InputProps['size'], Partial<InputTokens>> = {
  sm: {
    paddingX: 'var(--spacing-2.5)',
    paddingY: 'var(--spacing-1.5)',
    fontSize: 'var(--text-sm)',
    iconSize: 'var(--spacing-4)',
  },
  md: {
    paddingX: 'var(--spacing-3)',
    paddingY: 'var(--spacing-2)',
    fontSize: 'var(--text-base)',
    iconSize: 'var(--spacing-5)',
  },
  lg: {
    paddingX: 'var(--spacing-4)',
    paddingY: 'var(--spacing-3)',
    fontSize: 'var(--text-lg)',
    iconSize: 'var(--spacing-6)',
  },
};

/**
 * Input state interactions
 */
export interface InputStateTransitions {
  default: {
    onFocus: 'focus';
    onMouseEnter: 'hover';
    onInvalid: 'error';
  };
  hover: {
    onMouseLeave: 'default';
    onFocus: 'focus';
  };
  focus: {
    onBlur: 'default';
    onInvalid: 'error';
  };
  error: {
    onFocus: 'focus-error';
    onValid: 'default';
  };
  'focus-error': {
    onBlur: 'error';
    onValid: 'focus';
  };
  disabled: {
    // No state transitions allowed
  };
  readonly: {
    onFocus: 'focus-readonly';
  };
  'focus-readonly': {
    onBlur: 'readonly';
  };
}

/**
 * Input validation contract
 */
export interface InputValidation {
  /**
   * Built-in HTML5 validation
   */
  html5: {
    required: 'validates presence';
    minLength: 'validates minimum character count';
    maxLength: 'validates maximum character count';
    pattern: 'validates against regex pattern';
    type: 'validates format based on input type';
  };

  /**
   * Custom validation
   */
  custom: {
    validator: '(value: string) => boolean | Promise<boolean>';
    message: 'custom error message';
    debounce: 'validation delay in milliseconds';
  };

  /**
   * Validation timing
   */
  timing: {
    onSubmit: 'validate on form submission';
    onBlur: 'validate when focus leaves input';
    onChange: 'validate on every character change';
    onMount: 'validate on component mount';
  };
}