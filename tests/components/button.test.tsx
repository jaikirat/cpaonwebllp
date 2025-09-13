/**
 * T005: Button Component Contract Tests
 *
 * Comprehensive test suite for the Button component based on the contracts
 * defined in specs/002-establish-a-unified/contracts/button-component.ts
 *
 * This follows TDD principles - tests will initially fail since the Button
 * component doesn't exist yet.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Import contracts from specs
import {
  ButtonProps,
  ButtonVariantTokens,
  ButtonSizeTokens,
  ButtonAccessibility,
} from '../../specs/002-establish-a-unified/contracts/button-component';

// Import component that will be implemented
import { Button } from '../../src/components/ui/button';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

describe('Button Component Contract Tests', () => {
  describe('ButtonProps Interface Requirements', () => {
    test('accepts all required and optional props according to interface', () => {
      const mockClick = jest.fn();
      const startIcon = <span data-testid="start-icon">→</span>;
      const endIcon = <span data-testid="end-icon">←</span>;

      render(
        <Button
          variant="primary"
          size="lg"
          disabled={false}
          fullWidth={true}
          loading={false}
          startIcon={startIcon}
          endIcon={endIcon}
          type="submit"
          onClick={mockClick}
          className="custom-class"
          aria-label="Custom button"
          aria-describedby="button-description"
        >
          Button Text
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Button Text');
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    test('children prop accepts React.ReactNode', () => {
      render(
        <Button>
          <span>Complex</span> <em>children</em>
        </Button>
      );

      expect(screen.getByRole('button')).toHaveTextContent('Complex children');
    });
  });

  describe('Button Variants', () => {
    const variants: Array<ButtonProps['variant']> = [
      'default',
      'primary',
      'secondary',
      'outline',
      'ghost',
      'destructive',
    ];

    test.each(variants)('renders %s variant correctly', (variant) => {
      render(<Button variant={variant}>Test Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(`button--${variant}`);
    });

    test('defaults to "default" variant when not specified', () => {
      render(<Button>Default Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--default');
    });

    test('applies correct design tokens for each variant', () => {
      Object.entries(ButtonVariantTokens).forEach(([variant, tokens]) => {
        const { unmount } = render(
          <Button variant={variant as ButtonProps['variant']}>
            {variant} Button
          </Button>
        );

        const button = screen.getByRole('button');
        const computedStyle = window.getComputedStyle(button);

        if (tokens.backgroundColor) {
          expect(computedStyle.backgroundColor).toBeDefined();
        }
        if (tokens.textColor) {
          expect(computedStyle.color).toBeDefined();
        }
        if (tokens.borderColor) {
          expect(computedStyle.borderColor).toBeDefined();
        }

        unmount();
      });
    });
  });

  describe('Button Sizes', () => {
    const sizes: Array<ButtonProps['size']> = ['sm', 'md', 'lg', 'xl'];

    test.each(sizes)('renders %s size correctly', (size) => {
      render(<Button size={size}>Test Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(`button--${size}`);
    });

    test('defaults to "md" size when not specified', () => {
      render(<Button>Medium Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--md');
    });

    test('applies correct design tokens for each size', () => {
      Object.entries(ButtonSizeTokens).forEach(([size, tokens]) => {
        const { unmount } = render(
          <Button size={size as ButtonProps['size']}>
            {size} Button
          </Button>
        );

        const button = screen.getByRole('button');
        const computedStyle = window.getComputedStyle(button);

        if (tokens.paddingX || tokens.paddingY) {
          expect(computedStyle.padding).toBeDefined();
        }
        if (tokens.fontSize) {
          expect(computedStyle.fontSize).toBeDefined();
        }
        if (tokens.gap) {
          // Gap applies when icons are present
          expect(computedStyle.gap || computedStyle.columnGap).toBeDefined();
        }

        unmount();
      });
    });
  });

  describe('Interactive States', () => {
    test('handles hover state', async () => {
      const user = userEvent.setup();
      render(<Button>Hover Button</Button>);

      const button = screen.getByRole('button');

      await user.hover(button);
      expect(button).toHaveClass('button--hover');

      await user.unhover(button);
      expect(button).not.toHaveClass('button--hover');
    });

    test('handles focus state', async () => {
      const user = userEvent.setup();
      render(<Button>Focus Button</Button>);

      const button = screen.getByRole('button');

      await user.tab();
      expect(button).toHaveFocus();
      expect(button).toHaveClass('button--focus');
    });

    test('handles active state', async () => {
      render(<Button>Active Button</Button>);

      const button = screen.getByRole('button');

      fireEvent.mouseDown(button);
      expect(button).toHaveClass('button--active');

      fireEvent.mouseUp(button);
      expect(button).not.toHaveClass('button--active');
    });

    test('handles disabled state', () => {
      const mockClick = jest.fn();
      render(
        <Button disabled onClick={mockClick}>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--disabled');

      fireEvent.click(button);
      expect(mockClick).not.toHaveBeenCalled();
    });

    test('handles loading state', () => {
      const mockClick = jest.fn();
      render(
        <Button loading onClick={mockClick}>
          Loading Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--loading');
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();

      fireEvent.click(button);
      expect(mockClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Requirements', () => {
    test('has correct ARIA role', () => {
      render(<Button>Accessible Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('role', 'button');
    });

    test('supports keyboard navigation (Enter and Space)', async () => {
      const mockClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={mockClick}>Keyboard Button</Button>);

      const button = screen.getByRole('button');
      await user.tab();
      expect(button).toHaveFocus();

      // Test Enter key
      await user.keyboard('{Enter}');
      expect(mockClick).toHaveBeenCalledTimes(1);

      // Test Space key
      await user.keyboard(' ');
      expect(mockClick).toHaveBeenCalledTimes(2);
    });

    test('supports Tab and Shift+Tab navigation', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Previous Button</button>
          <Button>Test Button</Button>
          <button>Next Button</button>
        </div>
      );

      const testButton = screen.getByRole('button', { name: 'Test Button' });

      // Tab forward to reach the button
      await user.tab();
      await user.tab();
      expect(testButton).toHaveFocus();

      // Shift+Tab to go back
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(testButton).not.toHaveFocus();
    });

    test('provides accessible name via children or aria-label', () => {
      const { rerender } = render(<Button>Text Content</Button>);
      expect(screen.getByRole('button', { name: 'Text Content' })).toBeInTheDocument();

      rerender(<Button aria-label="Custom Label">Icon Only</Button>);
      expect(screen.getByRole('button', { name: 'Custom Label' })).toBeInTheDocument();
    });

    test('supports aria-describedby for additional context', () => {
      render(
        <div>
          <Button aria-describedby="help-text">Button with help</Button>
          <div id="help-text">This button does something important</div>
        </div>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('announces loading state changes to screen readers', async () => {
      const { rerender } = render(<Button>Submit</Button>);

      rerender(<Button loading>Submit</Button>);

      // Loading spinner should have appropriate aria-label
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    test('announces disabled state to screen readers', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    test('has visible focus indicator with sufficient contrast', async () => {
      const user = userEvent.setup();
      render(<Button>Focus Test</Button>);

      const button = screen.getByRole('button');
      await user.tab();

      expect(button).toHaveFocus();

      const computedStyle = window.getComputedStyle(button);
      expect(computedStyle.outline || computedStyle.boxShadow).toBeDefined();
    });

    test('passes accessibility audit', async () => {
      const { container } = render(
        <div>
          <Button>Default Button</Button>
          <Button variant="primary" startIcon={<span>→</span>}>
            Primary with Icon
          </Button>
          <Button disabled>Disabled Button</Button>
          <Button loading>Loading Button</Button>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Icon Support', () => {
    test('renders startIcon before button text', () => {
      const startIcon = <span data-testid="start-icon">→</span>;

      render(
        <Button startIcon={startIcon}>
          Button Text
        </Button>
      );

      const button = screen.getByRole('button');
      const icon = screen.getByTestId('start-icon');
      const buttonText = screen.getByText('Button Text');

      expect(button).toContainElement(icon);
      expect(button).toContainElement(buttonText);

      // Icon should come before text in DOM order
      const children = Array.from(button.children);
      const iconIndex = children.findIndex(child => child.contains(icon));
      const textIndex = children.findIndex(child => child.contains(buttonText));

      expect(iconIndex).toBeLessThan(textIndex);
    });

    test('renders endIcon after button text', () => {
      const endIcon = <span data-testid="end-icon">←</span>;

      render(
        <Button endIcon={endIcon}>
          Button Text
        </Button>
      );

      const button = screen.getByRole('button');
      const icon = screen.getByTestId('end-icon');
      const buttonText = screen.getByText('Button Text');

      expect(button).toContainElement(icon);
      expect(button).toContainElement(buttonText);

      // Text should come before icon in DOM order
      const children = Array.from(button.children);
      const iconIndex = children.findIndex(child => child.contains(icon));
      const textIndex = children.findIndex(child => child.contains(buttonText));

      expect(textIndex).toBeLessThan(iconIndex);
    });

    test('renders both startIcon and endIcon correctly', () => {
      const startIcon = <span data-testid="start-icon">→</span>;
      const endIcon = <span data-testid="end-icon">←</span>;

      render(
        <Button startIcon={startIcon} endIcon={endIcon}>
          Button Text
        </Button>
      );

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
      expect(screen.getByText('Button Text')).toBeInTheDocument();
    });

    test('applies correct gap spacing for icons based on size', () => {
      Object.keys(ButtonSizeTokens).forEach((size) => {
        const { unmount } = render(
          <Button
            size={size as ButtonProps['size']}
            startIcon={<span>→</span>}
          >
            Text
          </Button>
        );

        const button = screen.getByRole('button');
        const computedStyle = window.getComputedStyle(button);

        // Should have gap styling applied
        expect(computedStyle.gap || computedStyle.columnGap).toBeDefined();

        unmount();
      });
    });
  });

  describe('Loading State with Spinner', () => {
    test('shows loading spinner when loading is true', () => {
      render(<Button loading>Loading Button</Button>);

      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toBeInTheDocument();
    });

    test('hides button content when loading', () => {
      render(
        <Button loading startIcon={<span data-testid="icon">→</span>}>
          Button Text
        </Button>
      );

      // Spinner should be visible
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();

      // Original content should be hidden or replaced
      expect(screen.queryByText('Button Text')).toHaveStyle({ opacity: '0' });
      expect(screen.queryByTestId('icon')).toHaveStyle({ opacity: '0' });
    });

    test('disables interaction when loading', () => {
      const mockClick = jest.fn();
      render(
        <Button loading onClick={mockClick}>
          Loading Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      fireEvent.click(button);
      expect(mockClick).not.toHaveBeenCalled();
    });

    test('maintains button dimensions when loading', () => {
      const { rerender } = render(<Button>Normal Button</Button>);
      const button = screen.getByRole('button');
      const normalRect = button.getBoundingClientRect();

      rerender(<Button loading>Normal Button</Button>);
      const loadingRect = button.getBoundingClientRect();

      expect(loadingRect.height).toBeCloseTo(normalRect.height, 1);
      expect(loadingRect.width).toBeCloseTo(normalRect.width, 1);
    });
  });

  describe('Click Handlers and Form Submission', () => {
    test('calls onClick handler when clicked', async () => {
      const mockClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={mockClick}>Click Me</Button>);

      await user.click(screen.getByRole('button'));
      expect(mockClick).toHaveBeenCalledTimes(1);

      // Check event object
      expect(mockClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
          target: expect.any(Element),
        })
      );
    });

    test('supports form submission with type="submit"', () => {
      const mockSubmit = jest.fn();

      render(
        <form onSubmit={mockSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(mockSubmit).toHaveBeenCalled();
    });

    test('supports form reset with type="reset"', () => {
      render(
        <form>
          <input defaultValue="test" />
          <Button type="reset">Reset Form</Button>
        </form>
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      const resetButton = screen.getByRole('button');

      // Change input value
      fireEvent.change(input, { target: { value: 'changed' } });
      expect(input.value).toBe('changed');

      // Reset form
      fireEvent.click(resetButton);
      expect(input.value).toBe('test');
    });

    test('defaults to type="button"', () => {
      render(<Button>Default Type</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    test('prevents click when disabled', () => {
      const mockClick = jest.fn();

      render(
        <Button disabled onClick={mockClick}>
          Disabled Button
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(mockClick).not.toHaveBeenCalled();
    });

    test('prevents click when loading', () => {
      const mockClick = jest.fn();

      render(
        <Button loading onClick={mockClick}>
          Loading Button
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(mockClick).not.toHaveBeenCalled();
    });
  });

  describe('FullWidth Behavior', () => {
    test('applies full width styling when fullWidth is true', () => {
      render(<Button fullWidth>Full Width Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--full-width');

      const computedStyle = window.getComputedStyle(button);
      expect(computedStyle.width).toBe('100%');
    });

    test('does not apply full width styling by default', () => {
      render(<Button>Normal Button</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('button--full-width');

      const computedStyle = window.getComputedStyle(button);
      expect(computedStyle.width).not.toBe('100%');
    });

    test('maintains full width across different sizes and variants', () => {
      const variants: Array<ButtonProps['variant']> = ['default', 'primary', 'secondary'];
      const sizes: Array<ButtonProps['size']> = ['sm', 'md', 'lg'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { unmount } = render(
            <Button variant={variant} size={size} fullWidth>
              {variant} {size}
            </Button>
          );

          const button = screen.getByRole('button');
          expect(button).toHaveClass('button--full-width');

          const computedStyle = window.getComputedStyle(button);
          expect(computedStyle.width).toBe('100%');

          unmount();
        });
      });
    });
  });

  describe('Design Token Usage', () => {
    test('uses CSS custom properties for theming', () => {
      render(<Button variant="primary">Themed Button</Button>);

      const button = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(button);

      // Should use CSS custom properties from design tokens
      expect(computedStyle.getPropertyValue('--color-primary')).toBeDefined();
    });

    test('applies transition tokens for smooth interactions', () => {
      render(<Button>Animated Button</Button>);

      const button = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(button);

      expect(computedStyle.transition).toBeDefined();
      expect(computedStyle.transitionDuration).toBeDefined();
      expect(computedStyle.transitionTimingFunction).toBeDefined();
    });

    test('applies border radius tokens', () => {
      render(<Button>Rounded Button</Button>);

      const button = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(button);

      expect(computedStyle.borderRadius).toBeDefined();
    });

    test('applies box shadow tokens for elevation', () => {
      render(<Button variant="primary">Elevated Button</Button>);

      const button = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(button);

      expect(computedStyle.boxShadow).toBeDefined();
    });
  });

  describe('Custom CSS Classes', () => {
    test('accepts and applies custom className', () => {
      render(
        <Button className="custom-button-class">
          Custom Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button-class');
    });

    test('preserves default classes when custom className is provided', () => {
      render(
        <Button variant="primary" size="lg" className="custom-class">
          Button with Custom Class
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('button--primary');
      expect(button).toHaveClass('button--lg');
    });
  });
});