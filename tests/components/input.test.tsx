/**
 * T006: Input Component Contract Tests
 * TDD Implementation - Tests MUST fail initially since Input component doesn't exist yet
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  InputProps,
  InputStateTokens,
  InputSizeTokens,
  InputAccessibility
} from '../../specs/002-establish-a-unified/contracts/input-component';

// Import the Input component that doesn't exist yet - this will cause test failures (TDD approach)
import { Input } from '@/components/ui/input';

// Mock for testing icon components
const MockStartIcon = () => <span data-testid="start-icon">📧</span>;
const MockEndIcon = () => <span data-testid="end-icon">🔍</span>;

describe('Input Component Contract', () => {
  // Helper function to create wrapper with form for integration testing
  const FormWrapper = ({ children }: { children: React.ReactNode }) => (
    <form data-testid="test-form">
      {children}
    </form>
  );

  describe('InputProps Interface Requirements', () => {
    test('accepts all required InputProps interface properties', () => {
      const props: InputProps = {
        type: 'email',
        value: 'test@example.com',
        defaultValue: 'default@example.com',
        placeholder: 'Enter email',
        disabled: false,
        readOnly: false,
        required: true,
        size: 'md',
        state: 'default',
        errorMessage: 'Invalid email',
        helperText: 'We will never share your email',
        label: 'Email Address',
        startIcon: <MockStartIcon />,
        endIcon: <MockEndIcon />,
        clearable: true,
        maxLength: 100,
        minLength: 5,
        pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
        autoComplete: 'email',
        autoFocus: false,
        name: 'email',
        id: 'email-input',
        onChange: jest.fn(),
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onKeyDown: jest.fn(),
        onClear: jest.fn(),
        className: 'custom-input',
        'aria-label': 'Email input field',
        'aria-describedby': 'email-helper',
        'aria-labelledby': 'email-label',
        'aria-invalid': false,
      };

      expect(() => {
        render(<Input {...props} />);
      }).not.toThrow();
    });

    test('has correct default props', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('type', 'text');
      expect(input).not.toHaveAttribute('disabled');
      expect(input).not.toHaveAttribute('readonly');
      expect(input).not.toHaveAttribute('required');
    });
  });

  describe('Input Types Support', () => {
    const inputTypes: InputProps['type'][] = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'];

    inputTypes.forEach(type => {
      test(`renders with type="${type}"`, () => {
        render(<Input type={type} data-testid="input" />);
        const input = screen.getByTestId('input');
        expect(input).toHaveAttribute('type', type);
      });
    });
  });

  describe('Input Sizes', () => {
    const sizes: InputProps['size'][] = ['sm', 'md', 'lg'];

    sizes.forEach(size => {
      test(`applies correct styling for size="${size}"`, () => {
        render(<Input size={size} data-testid="input" />);
        const input = screen.getByTestId('input');

        // Verify size-specific design tokens are applied
        const expectedTokens = InputSizeTokens[size!];
        if (expectedTokens) {
          // These tests will verify CSS custom properties are applied correctly
          expect(input).toHaveStyle({
            fontSize: expectedTokens.fontSize,
            paddingLeft: expectedTokens.paddingX,
            paddingRight: expectedTokens.paddingX,
            paddingTop: expectedTokens.paddingY,
            paddingBottom: expectedTokens.paddingY,
          });
        }
      });
    });

    test('defaults to medium size', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');

      const mediumTokens = InputSizeTokens.md;
      expect(input).toHaveStyle({
        fontSize: mediumTokens.fontSize,
      });
    });
  });

  describe('Input States', () => {
    const states: InputProps['state'][] = ['default', 'error', 'warning', 'success'];

    states.forEach(state => {
      test(`applies correct styling for state="${state}"`, () => {
        render(<Input state={state} data-testid="input" />);
        const input = screen.getByTestId('input');

        // Verify state-specific design tokens are applied
        const expectedTokens = InputStateTokens[state!];
        if (expectedTokens) {
          expect(input).toHaveStyle({
            borderColor: expectedTokens.borderColor,
            color: expectedTokens.textColor,
          });
        }
      });

      test(`applies correct ARIA attributes for state="${state}"`, () => {
        render(<Input state={state} data-testid="input" />);
        const input = screen.getByTestId('input');

        if (state === 'error') {
          expect(input).toHaveAttribute('aria-invalid', 'true');
        } else {
          expect(input).not.toHaveAttribute('aria-invalid');
        }
      });
    });
  });

  describe('Controlled and Uncontrolled Behavior', () => {
    test('works as controlled input', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input value="controlled" onChange={handleChange} data-testid="input" />);
      const input = screen.getByTestId('input') as HTMLInputElement;

      expect(input.value).toBe('controlled');

      await user.type(input, 'new text');
      expect(handleChange).toHaveBeenCalled();
    });

    test('works as uncontrolled input', async () => {
      const user = userEvent.setup();

      render(<Input defaultValue="uncontrolled" data-testid="input" />);
      const input = screen.getByTestId('input') as HTMLInputElement;

      expect(input.value).toBe('uncontrolled');

      await user.clear(input);
      await user.type(input, 'new value');
      expect(input.value).toBe('new value');
    });

    test('controlled input value cannot be changed by user when onChange is not provided', async () => {
      const user = userEvent.setup();

      render(<Input value="fixed value" data-testid="input" />);
      const input = screen.getByTestId('input') as HTMLInputElement;

      await user.type(input, 'attempted change');
      expect(input.value).toBe('fixed value');
    });
  });

  describe('Validation', () => {
    test('validates required field', () => {
      render(<Input required name="test" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    test('validates minLength constraint', () => {
      render(<Input minLength={5} data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('minLength', '5');
    });

    test('validates maxLength constraint', () => {
      render(<Input maxLength={10} data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('maxLength', '10');
    });

    test('validates pattern constraint', () => {
      const emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
      render(<Input pattern={emailPattern} data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('pattern', emailPattern);
    });

    test('shows error message when state is error', () => {
      render(<Input state="error" errorMessage="This field is required" data-testid="input" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    test('associates error message with input via aria-describedby', () => {
      render(<Input state="error" errorMessage="Error message" id="test-input" data-testid="input" />);

      const input = screen.getByTestId('input');
      const errorId = input.getAttribute('aria-describedby');

      expect(errorId).toBeTruthy();
      expect(screen.getByText('Error message')).toHaveAttribute('id', errorId);
    });
  });

  describe('Accessibility Requirements', () => {
    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');

      // Tab to focus
      await user.tab();
      expect(input).toHaveFocus();

      // Tab away
      await user.tab();
      expect(input).not.toHaveFocus();
    });

    test('supports Escape key to clear when clearable', async () => {
      const user = userEvent.setup();
      const handleClear = jest.fn();

      render(<Input clearable onClear={handleClear} value="test" data-testid="input" />);
      const input = screen.getByTestId('input');

      input.focus();
      await user.keyboard('{Escape}');

      expect(handleClear).toHaveBeenCalled();
    });

    test('supports Enter key for form submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn(e => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Input data-testid="input" />
        </form>
      );

      const input = screen.getByTestId('input');
      input.focus();
      await user.keyboard('{Enter}');

      expect(handleSubmit).toHaveBeenCalled();
    });

    test('has proper ARIA attributes', () => {
      render(
        <Input
          label="Username"
          helperText="Enter your username"
          required
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-describedby');

      // Label should be associated with input
      const label = screen.getByText('Username');
      expect(label).toBeInTheDocument();
    });

    test('supports custom ARIA attributes', () => {
      render(
        <Input
          aria-label="Custom label"
          aria-describedby="custom-description"
          aria-labelledby="custom-label"
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('aria-label', 'Custom label');
      expect(input).toHaveAttribute('aria-describedby', 'custom-description');
      expect(input).toHaveAttribute('aria-labelledby', 'custom-label');
    });

    test('has visible focus indicator', async () => {
      const user = userEvent.setup();

      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');

      await user.tab();

      // Should have focus ring styles applied
      expect(input).toHaveFocus();
      expect(input).toHaveStyle({
        outlineWidth: expect.any(String),
      });
    });

    test('announces validation errors to screen readers', () => {
      render(
        <Input
          state="error"
          errorMessage="Invalid input"
          aria-live="polite"
          data-testid="input"
        />
      );

      const errorMessage = screen.getByText('Invalid input');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Design Token Usage', () => {
    test('applies default design tokens', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');

      // Verify CSS custom properties are used
      expect(input).toHaveStyle({
        backgroundColor: 'var(--color-input-background)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      });
    });

    test('applies state-specific design tokens', () => {
      render(<Input state="error" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveStyle({
        borderColor: 'var(--color-destructive)',
      });
    });

    test('applies size-specific design tokens', () => {
      render(<Input size="lg" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveStyle({
        fontSize: 'var(--text-lg)',
        paddingLeft: 'var(--spacing-4)',
        paddingTop: 'var(--spacing-3)',
      });
    });

    test('applies transition properties', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveStyle({
        transitionProperty: expect.stringContaining('border-color'),
        transitionDuration: expect.any(String),
      });
    });
  });

  describe('Icon Support', () => {
    test('renders start icon', () => {
      render(<Input startIcon={<MockStartIcon />} data-testid="input" />);

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    test('renders end icon', () => {
      render(<Input endIcon={<MockEndIcon />} data-testid="input" />);

      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    test('renders both start and end icons', () => {
      render(
        <Input
          startIcon={<MockStartIcon />}
          endIcon={<MockEndIcon />}
          data-testid="input"
        />
      );

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    test('applies correct icon sizing based on input size', () => {
      render(<Input size="sm" startIcon={<MockStartIcon />} data-testid="input" />);

      const icon = screen.getByTestId('start-icon');
      expect(icon).toHaveStyle({
        width: 'var(--spacing-4)',
        height: 'var(--spacing-4)',
      });
    });
  });

  describe('Clearable Functionality', () => {
    test('shows clear button when clearable and has value', () => {
      render(<Input clearable value="test value" data-testid="input" />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeInTheDocument();
    });

    test('hides clear button when input is empty', () => {
      render(<Input clearable value="" data-testid="input" />);

      const clearButton = screen.queryByRole('button', { name: /clear/i });
      expect(clearButton).not.toBeInTheDocument();
    });

    test('calls onClear when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleClear = jest.fn();

      render(<Input clearable value="test" onClear={handleClear} data-testid="input" />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(handleClear).toHaveBeenCalled();
    });

    test('clears input value when clear button is clicked in uncontrolled mode', async () => {
      const user = userEvent.setup();

      render(<Input clearable defaultValue="test" data-testid="input" />);
      const input = screen.getByTestId('input') as HTMLInputElement;

      expect(input.value).toBe('test');

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(input.value).toBe('');
    });
  });

  describe('Helper Text and Error Messages', () => {
    test('displays helper text', () => {
      render(<Input helperText="This is helpful information" data-testid="input" />);

      expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    });

    test('associates helper text with input', () => {
      render(<Input helperText="Helper text" id="test-input" data-testid="input" />);

      const input = screen.getByTestId('input');
      const helperText = screen.getByText('Helper text');

      expect(input).toHaveAttribute('aria-describedby', helperText.id);
    });

    test('prioritizes error message over helper text', () => {
      render(
        <Input
          helperText="Helper text"
          errorMessage="Error message"
          state="error"
          data-testid="input"
        />
      );

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    test('shows helper text when state is not error', () => {
      render(
        <Input
          helperText="Helper text"
          errorMessage="Error message"
          state="success"
          data-testid="input"
        />
      );

      expect(screen.getByText('Helper text')).toBeInTheDocument();
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    test('integrates with HTML forms', () => {
      render(
        <FormWrapper>
          <Input name="username" data-testid="input" />
        </FormWrapper>
      );

      const input = screen.getByTestId('input');
      const form = screen.getByTestId('test-form');

      expect(input).toHaveAttribute('name', 'username');
      expect(form).toContainElement(input);
    });

    test('supports form validation', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn(e => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Input required name="email" type="email" data-testid="input" />
          <button type="submit">Submit</button>
        </form>
      );

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      const input = screen.getByTestId('input');
      expect(input).toBeInvalid();
    });

    test('maintains form state correctly', async () => {
      const user = userEvent.setup();

      render(
        <FormWrapper>
          <Input name="field1" defaultValue="value1" data-testid="input1" />
          <Input name="field2" defaultValue="value2" data-testid="input2" />
        </FormWrapper>
      );

      const input1 = screen.getByTestId('input1') as HTMLInputElement;
      const input2 = screen.getByTestId('input2') as HTMLInputElement;

      await user.clear(input1);
      await user.type(input1, 'new value 1');

      expect(input1.value).toBe('new value 1');
      expect(input2.value).toBe('value2'); // Should not be affected
    });
  });

  describe('Event Handlers', () => {
    test('calls onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input onChange={handleChange} data-testid="input" />);
      const input = screen.getByTestId('input');

      await user.type(input, 'a');

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'a',
          }),
        })
      );
    });

    test('calls onFocus handler', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();

      render(<Input onFocus={handleFocus} data-testid="input" />);
      const input = screen.getByTestId('input');

      await user.click(input);

      expect(handleFocus).toHaveBeenCalled();
    });

    test('calls onBlur handler', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();

      render(<Input onBlur={handleBlur} data-testid="input" />);
      const input = screen.getByTestId('input');

      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });

    test('calls onKeyDown handler', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();

      render(<Input onKeyDown={handleKeyDown} data-testid="input" />);
      const input = screen.getByTestId('input');

      input.focus();
      await user.keyboard('a');

      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'a',
        })
      );
    });
  });

  describe('Disabled and ReadOnly States', () => {
    test('disables input when disabled prop is true', () => {
      render(<Input disabled data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('disabled');
    });

    test('makes input readonly when readOnly prop is true', () => {
      render(<Input readOnly data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveAttribute('aria-readonly', 'true');
    });

    test('prevents interaction when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input disabled onChange={handleChange} data-testid="input" />);
      const input = screen.getByTestId('input');

      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });

    test('prevents value changes when readonly', async () => {
      const user = userEvent.setup();

      render(<Input readOnly defaultValue="readonly" data-testid="input" />);
      const input = screen.getByTestId('input') as HTMLInputElement;

      await user.type(input, 'new text');

      expect(input.value).toBe('readonly');
    });
  });

  describe('Auto-behaviors', () => {
    test('supports autoFocus', () => {
      render(<Input autoFocus data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveFocus();
    });

    test('supports autoComplete', () => {
      render(<Input autoComplete="email" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('autocomplete', 'email');
    });
  });

  describe('Custom Styling', () => {
    test('accepts custom className', () => {
      render(<Input className="custom-input-class" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveClass('custom-input-class');
    });

    test('merges custom className with default classes', () => {
      render(<Input className="custom-class" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveClass('custom-class');
      // Should also have default input classes
      expect(input.className).toMatch(/input/i);
    });
  });
});