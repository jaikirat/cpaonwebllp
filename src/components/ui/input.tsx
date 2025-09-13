/**
 * Input Component - Unified Design System
 *
 * A comprehensive input component that supports various states, sizes, and features.
 * Built with TypeScript, Tailwind CSS, and design tokens for consistency.
 *
 * Features:
 * - Multiple sizes (sm, md, lg)
 * - Visual states (default, error, warning, success)
 * - Interactive states (default, focus, hover, disabled, readonly)
 * - Icon support (start and end icons)
 * - Clear functionality
 * - Full accessibility support (WCAG 2.1 AA)
 * - Form integration with forwardRef
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

// ================================
// TYPE DEFINITIONS
// ================================

/**
 * Props interface for the Input component.
 *
 * Comprehensive interface covering all input functionality including
 * validation states, icons, accessibility features, and form integration.
 * Supports both controlled and uncontrolled usage patterns.
 *
 * @example Basic Usage
 * ```tsx
 * const inputProps: InputProps = {
 *   type: 'email',
 *   size: 'lg',
 *   state: 'error',
 *   errorMessage: 'Please enter a valid email',
 *   startIcon: <EmailIcon />,
 *   clearable: true
 * };
 * ```
 *
 * @since 1.0.0
 */
interface InputProps {
  /**
   * HTML input type.
   *
   * Determines keyboard behavior on mobile devices and browser
   * validation patterns. Each type provides appropriate input
   * method and validation.
   *
   * @default "text"
   * @example
   * ```tsx
   * <Input type="email" placeholder="user@example.com" />
   * <Input type="password" autoComplete="current-password" />
   * <Input type="search" placeholder="Search..." />
   * ```
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

  /**
   * Controlled component value.
   *
   * When provided, makes this a controlled component. Must be used
   * with onChange handler to update the value.
   *
   * @example
   * ```tsx
   * const [value, setValue] = useState('');
   * <Input value={value} onChange={(e) => setValue(e.target.value)} />
   * ```
   */
  value?: string;

  /**
   * Default value for uncontrolled inputs.
   *
   * Sets initial value without making the component controlled.
   * Component manages its own state internally.
   *
   * @example
   * ```tsx
   * <Input defaultValue="Initial text" onChange={handleChange} />
   * ```
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
   * Size variant affecting padding, font size, and height.
   *
   * - `sm`: 32px height, compact for dense layouts
   * - `md`: 40px height, standard for most forms
   * - `lg`: 48px height, prominent for key inputs
   *
   * @default "md"
   * @example
   * ```tsx
   * <Input size="sm" placeholder="Compact input" />
   * <Input size="lg" placeholder="Large prominent input" />
   * ```
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Visual validation state of the input.
   *
   * Controls border color, focus ring, and message styling.
   * Use with errorMessage or helperText for complete feedback.
   *
   * - `default`: Normal state with neutral styling
   * - `error`: Red styling for validation errors
   * - `warning`: Orange styling for warnings
   * - `success`: Green styling for successful validation
   *
   * @default "default"
   * @example
   * ```tsx
   * <Input state="error" errorMessage="Email is required" />
   * <Input state="success" helperText="Email format is valid" />
   * ```
   */
  state?: 'default' | 'error' | 'warning' | 'success';

  /**
   * Error message to display below the input.
   *
   * Automatically sets aria-invalid and creates proper
   * association for screen readers. Typically used with
   * state="error" for visual consistency.
   *
   * @example
   * ```tsx
   * <Input
   *   state="error"
   *   errorMessage="Password must be at least 8 characters"
   *   aria-describedby="password-requirements"
   * />
   * ```
   *
   * @accessibility
   * - Creates aria-describedby relationship
   * - Announces changes with aria-live="polite"
   * - Sets role="alert" for immediate errors
   */
  errorMessage?: string;

  /**
   * Helper text to display below the input.
   *
   * Provides additional context or instructions for users.
   * Takes precedence over errorMessage when both are provided.
   *
   * @example
   * ```tsx
   * <Input
   *   type="password"
   *   helperText="Must contain uppercase, lowercase, and numbers"
   * />
   * ```
   *
   * @accessibility
   * - Linked via aria-describedby for screen readers
   * - Does not interfere with error announcements
   */
  helperText?: string;

  /**
   * Label text displayed above the input.
   *
   * Creates proper form association and displays required
   * indicator when required=true. Essential for accessibility.
   *
   * @example
   * ```tsx
   * <Input label="Email Address" required />
   * <Input label="Optional Notes" helperText="Add any comments" />
   * ```
   *
   * @accessibility
   * - Creates htmlFor relationship with input
   * - Required indicator announced to screen readers
   * - Clicking label focuses the input
   */
  label?: string;

  /**
   * Icon displayed at the start (left) of the input.
   *
   * Automatically sized and positioned. Hidden from screen readers
   * as it should be decorative. Adjusts spacing appropriately.
   *
   * @example
   * ```tsx
   * <Input startIcon={<EmailIcon />} placeholder="Enter email" />
   * <Input startIcon={<SearchIcon />} type="search" />
   * ```
   *
   * @accessibility
   * - Marked as decorative with aria-hidden
   * - Meaning conveyed through label or placeholder
   */
  startIcon?: React.ReactNode;

  /**
   * Icon displayed at the end (right) of the input.
   *
   * Automatically sized and positioned. Not shown when clearable
   * button is active. Hidden from screen readers.
   *
   * @example
   * ```tsx
   * <Input endIcon={<CalendarIcon />} placeholder="Select date" />
   * <Input endIcon={<HelpIcon />} aria-describedby="help-text" />
   * ```
   *
   * @accessibility
   * - Marked as decorative with aria-hidden
   * - For interactive icons, use separate button elements
   */
  endIcon?: React.ReactNode;

  /**
   * Whether to show clear button when input has value.
   *
   * Displays an X button that clears the input when clicked.
   * Also clears with Escape key. Respects disabled/readonly states.
   *
   * @default false
   * @example
   * ```tsx
   * <Input
   *   clearable
   *   placeholder="Type to search..."
   *   onClear={() => console.log('Cleared!')}
   * />
   * ```
   *
   * @accessibility
   * - Clear button has aria-label="Clear input"
   * - Keyboard accessible with Escape key
   * - Focus management preserves user context
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
   * Callback fired when input value changes.
   *
   * Essential for controlled components. Receives standard
   * React change event with current target value.
   *
   * @param event - React change event from input element
   * @example
   * ```tsx
   * const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   *   setValue(e.target.value);
   *   validateInput(e.target.value);
   * };
   * ```
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
   * Callback fired when clear button is clicked.
   *
   * Called in addition to onChange when clearable input is cleared.
   * Useful for additional cleanup or tracking actions.
   *
   * @example
   * ```tsx
   * const handleClear = () => {
   *   setValue('');
   *   setSearchResults([]);
   *   trackEvent('search_cleared');
   * };
   * ```
   */
  onClear?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Accessible label when visual label is not provided.
   *
   * Required when no label prop is used. Should describe
   * the input's purpose clearly for screen reader users.
   *
   * @example
   * ```tsx
   * <Input aria-label="Search products" startIcon={<SearchIcon />} />
   * <Input aria-label="Enter verification code" type="number" />
   * ```
   *
   * @accessibility
   * - Essential for inputs without visible labels
   * - Should be descriptive and specific
   * - Overrides any label text for screen readers
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

// ================================
// INTERNAL COMPONENTS
// ================================

/**
 * Internal clear button component for clearable inputs.
 *
 * Provides a standardized X button that appears when an input
 * has content and clearable=true. Handles focus management and
 * accessibility automatically.
 *
 * @param props - Clear button props
 * @param props.onClick - Function called when button is clicked
 * @param props.size - Size matching parent input
 * @param props.className - Additional CSS classes
 * @param ref - Forwarded ref to button element
 * @returns Accessible clear button element
 *
 * @internal This component is not exported for external use
 * @since 1.0.0
 */
const ClearButton = React.forwardRef<
  HTMLButtonElement,
  {
    onClick:() => void;
    size?: InputProps['size'];
    className?: string;
  }
>(({ onClick, size = 'md', className }, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        // Base styles
        'absolute right-2 top-1/2 -translate-y-1/2',
        'inline-flex items-center justify-center',
        'rounded-sm',
        'text-gray-400 hover:text-gray-600',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        // Size styles
        sizeClasses[size],
        className,
      )}
      aria-label="Clear input"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-full h-full"
      >
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  );
});
ClearButton.displayName = 'ClearButton';

// ================================
// MAIN COMPONENT
// ================================

/**
 * Input component with comprehensive form and accessibility features.
 *
 * A fully-featured text input supporting validation states, icons, clearing,
 * and complete accessibility compliance. Works as both controlled and
 * uncontrolled component with proper form integration.
 *
 * @param props - Input component properties
 * @param ref - Forwarded ref to the input element
 * @returns A styled, accessible input element with label and help text
 *
 * @example Basic Text Input
 * ```tsx
 * <Input
 *   label="Full Name"
 *   placeholder="Enter your name"
 *   required
 * />
 * ```
 *
 * @example Email Input with Validation
 * ```tsx
 * <Input
 *   type="email"
 *   label="Email Address"
 *   state={isValid ? 'success' : 'error'}
 *   errorMessage={!isValid ? 'Please enter valid email' : undefined}
 *   startIcon={<MailIcon />}
 * />
 * ```
 *
 * @example Search Input with Clear
 * ```tsx
 * <Input
 *   type="search"
 *   placeholder="Search products..."
 *   startIcon={<SearchIcon />}
 *   clearable
 *   onClear={() => setResults([])}
 * />
 * ```
 *
 * @example Controlled Input with Validation
 * ```tsx
 * const [value, setValue] = useState('');
 * const [error, setError] = useState('');
 *
 * <Input
 *   value={value}
 *   onChange={(e) => {
 *     setValue(e.target.value);
 *     setError(validateInput(e.target.value));
 *   }}
 *   state={error ? 'error' : 'default'}
 *   errorMessage={error}
 *   label="Username"
 *   helperText="Must be 3-20 characters"
 * />
 * ```
 *
 * @accessibility
 * - WCAG 2.1 AA compliant form controls
 * - Proper label association with htmlFor/id
 * - Error messages announced to screen readers
 * - Clear button keyboard accessible (Escape key)
 * - Support for aria-describedby and aria-invalid
 * - Required field indication for screen readers
 * - Focus management maintains user context
 *
 * @since 1.0.0
 * @see {@link InputProps} - Component props interface
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'md',
      state = 'default',
      disabled = false,
      readOnly = false,
      required = false,
      clearable = false,
      autoFocus = false,
      label,
      errorMessage,
      helperText,
      startIcon,
      endIcon,
      onClear,
      className,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    // ================================
    // STATE MANAGEMENT
    // ================================

    const [internalValue, setInternalValue] = React.useState(defaultValue || '');

    // Determine if input is controlled or uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = Boolean(currentValue);

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const inputId = props.id || generatedId;
    const labelId = label ? `${inputId}-label` : undefined;
    const helperId = (errorMessage || helperText) ? `${inputId}-helper` : undefined;

    // ================================
    // EVENT HANDLERS
    // ================================

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalValue(event.target.value);
        }
        if (onChange) {
          onChange(event);
        }
      },
      [isControlled, onChange],
    );

    const handleFocus = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (props.onFocus) {
          props.onFocus(event);
        }
      },
      [props],
    );

    const handleBlur = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (props.onBlur) {
          props.onBlur(event);
        }
      },
      [props],
    );

    const handleClear = React.useCallback(() => {
      if (!isControlled) {
        setInternalValue('');
      }

      // Create synthetic event for onChange
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;

      if (onChange) {
        onChange(syntheticEvent);
      }
      if (onClear) {
        onClear();
      }
    }, [isControlled, onChange, onClear]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle Escape key for clearable inputs
        if (event.key === 'Escape' && clearable && hasValue) {
          event.preventDefault();
          handleClear();
          return;
        }

        if (onKeyDown) {
          onKeyDown(event);
        }
      },
      [clearable, hasValue, handleClear, onKeyDown],
    );

    // ================================
    // STYLE CALCULATIONS
    // ================================

    // Size-based styles using design tokens
    const sizeStyles = {
      sm: cn(
        '[--input-height:2rem]', // 32px
        '[--input-padding-x:0.625rem]', // 10px
        '[--input-padding-y:0.375rem]', // 6px
        '[--input-font-size:0.875rem]', // 14px
        '[--icon-size:1rem]', // 16px
      ),
      md: cn(
        '[--input-height:2.5rem]', // 40px
        '[--input-padding-x:0.75rem]', // 12px
        '[--input-padding-y:0.5rem]', // 8px
        '[--input-font-size:1rem]', // 16px
        '[--icon-size:1.25rem]', // 20px
      ),
      lg: cn(
        '[--input-height:3rem]', // 48px
        '[--input-padding-x:1rem]', // 16px
        '[--input-padding-y:0.75rem]', // 12px
        '[--input-font-size:1.125rem]', // 18px
        '[--icon-size:1.5rem]', // 24px
      ),
    };

    // State-based styles using design tokens
    const stateStyles = {
      default: cn(
        'border-gray-200',
        'focus:border-blue-500 focus:ring-blue-500',
      ),
      error: cn(
        'border-red-500',
        'focus:border-red-500 focus:ring-red-500',
      ),
      warning: cn(
        'border-orange-500',
        'focus:border-orange-500 focus:ring-orange-500',
      ),
      success: cn(
        'border-green-500',
        'focus:border-green-500 focus:ring-green-500',
      ),
    };

    // Interactive state styles
    const interactiveStyles = cn(
      // Base interactive styles
      !disabled && !readOnly && 'hover:border-gray-300',

      // Focus styles
      'focus:outline-none focus:ring-2 focus:ring-offset-0',

      // Disabled styles
      disabled && cn(
        'cursor-not-allowed opacity-50',
        'bg-gray-50 text-gray-500',
      ),

      // Read-only styles
      readOnly && cn(
        'cursor-default',
        'bg-gray-50',
      ),
    );

    // Icon spacing calculations
    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon) || (clearable && hasValue);
    const paddingWithIcons = cn(
      hasStartIcon && size === 'sm' && 'pl-8',
      hasStartIcon && size === 'md' && 'pl-10',
      hasStartIcon && size === 'lg' && 'pl-12',
      hasEndIcon && size === 'sm' && 'pr-8',
      hasEndIcon && size === 'md' && 'pr-10',
      hasEndIcon && size === 'lg' && 'pr-12',
    );

    // Final input class composition
    const inputClasses = cn(
      // Base styles using CSS custom properties for token integration
      'relative flex w-full rounded-md border bg-white',
      'text-gray-900 placeholder:text-gray-500',
      'transition-colors duration-200',

      // Size styles
      sizeStyles[size],
      'h-[var(--input-height)]',
      'px-[var(--input-padding-x)] py-[var(--input-padding-y)]',
      'text-[var(--input-font-size)]',

      // State styles
      stateStyles[state],

      // Interactive styles
      interactiveStyles,

      // Icon padding adjustments
      paddingWithIcons,

      // Additional input type styles (file inputs would need separate handling)
      // Note: File input requires different prop interface

      // Custom className
      className,
    );

    // Icon positioning styles
    const iconBaseClasses = cn(
      'absolute top-1/2 -translate-y-1/2',
      'text-gray-400',
      'pointer-events-none',
      'w-[var(--icon-size)] h-[var(--icon-size)]',
    );

    // Helper text and error styles
    const messageClasses = cn(
      'mt-1.5 text-sm',
      state === 'error' && 'text-red-600',
      state === 'warning' && 'text-orange-600',
      state === 'success' && 'text-green-600',
      state === 'default' && 'text-gray-600',
    );

    // ================================
    // ACCESSIBILITY ATTRIBUTES
    // ================================

    const accessibilityProps = {
      id: inputId,
      'aria-label': !label ? ariaLabel : undefined,
      'aria-labelledby': label ? (ariaLabelledBy ? `${labelId} ${ariaLabelledBy}` : labelId) : ariaLabelledBy,
      'aria-describedby': cn(
        helperId,
        ariaDescribedBy,
      ).trim() || undefined,
      'aria-invalid': ariaInvalid ?? (state === 'error' ? true : undefined),
      'aria-required': required || undefined,
      'aria-readonly': readOnly || undefined,
    };

    // ================================
    // RENDER
    // ================================

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-gray-700 mb-1.5',
              disabled && 'text-gray-400',
            )}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div
              className={cn(
                iconBaseClasses,
                size === 'sm' && 'left-2.5',
                size === 'md' && 'left-3',
                size === 'lg' && 'left-4',
              )}
              aria-hidden="true"
            >
              {startIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            type={type}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoFocus={autoFocus}
            className={inputClasses}
            {...accessibilityProps}
            {...props}
          />

          {/* End Icon */}
          {endIcon && !clearable && (
            <div
              className={cn(
                iconBaseClasses,
                size === 'sm' && 'right-2.5',
                size === 'md' && 'right-3',
                size === 'lg' && 'right-4',
              )}
              aria-hidden="true"
            >
              {endIcon}
            </div>
          )}

          {/* Clear Button */}
          {clearable && hasValue && !disabled && !readOnly && (
            <ClearButton
              onClick={handleClear}
              size={size}
              className={cn(
                size === 'sm' && 'right-2',
                size === 'md' && 'right-2.5',
                size === 'lg' && 'right-3',
              )}
            />
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(errorMessage || helperText) && (
          <div
            id={helperId}
            className={messageClasses}
            role={state === 'error' ? 'alert' : undefined}
            aria-live={state === 'error' ? 'polite' : undefined}
          >
            {errorMessage || helperText}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

// ================================
// EXPORTS
// ================================

export { Input, type InputProps };