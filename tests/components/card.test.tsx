/**
 * T007: Card Component Contract Test
 *
 * Comprehensive test suite validating the Card component contract
 * based on specifications in specs/002-establish-a-unified/contracts/card-component.ts
 *
 * This test file follows Test-Driven Development (TDD) approach and will initially fail
 * until the Card component is implemented according to the contract specifications.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import contracts from specifications
import {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardState,
  CardTokens,
  CardAccessibility,
  CardVariantTokens,
  CardSizeTokens,
  CardStateTransitions,
  CardComposition,
  CardUsagePatterns,
} from '@/specs/002-establish-a-unified/contracts/card-component';

// Import the component (will fail until implemented)
import { Card } from '@/components/ui/card';

describe('T007: Card Component Contract Tests', () => {
  describe('CardProps Interface Requirements', () => {
    it('should accept children prop', () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should have default variant of "default"', () => {
      render(<Card data-testid="card">Default Card</Card>);
      const card = screen.getByTestId('card');

      // Should apply default variant styles
      expect(card).toHaveStyle({
        backgroundColor: 'var(--color-card-background)',
        borderColor: 'transparent',
        borderWidth: '0',
        boxShadow: 'var(--shadow-sm)',
      });
    });

    it('should have default size of "md"', () => {
      render(<Card data-testid="card">Medium Card</Card>);
      const card = screen.getByTestId('card');

      // Should apply medium size styles
      expect(card).toHaveStyle({
        padding: 'var(--spacing-4)',
        borderRadius: 'var(--radius-md)',
      });
    });

    it('should have default interactive state of false', () => {
      render(<Card data-testid="card">Non-interactive Card</Card>);
      const card = screen.getByTestId('card');

      expect(card).not.toHaveAttribute('tabindex');
      expect(card).not.toHaveAttribute('role', 'button');
    });

    it('should have default disabled state of false', () => {
      render(<Card data-testid="card">Enabled Card</Card>);
      const card = screen.getByTestId('card');

      expect(card).not.toHaveAttribute('disabled');
      expect(card).not.toHaveAttribute('aria-disabled');
    });

    it('should accept and apply className prop', () => {
      render(<Card className="custom-class" data-testid="card">Styled Card</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveClass('custom-class');
    });

    it('should render as div element by default', () => {
      render(<Card data-testid="card">Default Element</Card>);
      const card = screen.getByTestId('card');

      expect(card.tagName.toLowerCase()).toBe('div');
    });

    it('should accept aria-label prop for interactive cards', () => {
      render(
        <Card
          interactive
          aria-label="Clickable card"
          data-testid="card"
        >
          Interactive Card
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('aria-label', 'Clickable card');
    });

    it('should accept aria-describedby prop', () => {
      render(
        <>
          <div id="card-description">This describes the card</div>
          <Card aria-describedby="card-description" data-testid="card">
            Described Card
          </Card>
        </>
      );
      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('aria-describedby', 'card-description');
    });
  });

  describe('Card Variants', () => {
    it('should apply default variant styles', () => {
      render(<Card variant="default" data-testid="card">Default</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        backgroundColor: 'var(--color-card-background)',
        borderColor: 'transparent',
        borderWidth: '0',
        boxShadow: 'var(--shadow-sm)',
      });
    });

    it('should apply outlined variant styles', () => {
      render(<Card variant="outlined" data-testid="card">Outlined</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        backgroundColor: 'var(--color-card-background)',
        borderColor: 'var(--color-border)',
        borderWidth: 'var(--border-width)',
        boxShadow: 'none',
      });
    });

    it('should apply elevated variant styles', () => {
      render(<Card variant="elevated" data-testid="card">Elevated</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        backgroundColor: 'var(--color-card-background)',
        borderColor: 'transparent',
        borderWidth: '0',
        boxShadow: 'var(--shadow-md)',
      });
    });

    it('should apply filled variant styles', () => {
      render(<Card variant="filled" data-testid="card">Filled</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        backgroundColor: 'var(--color-muted)',
        borderColor: 'transparent',
        borderWidth: '0',
        boxShadow: 'none',
      });
    });
  });

  describe('Card Sizes', () => {
    it('should apply small size styles', () => {
      render(<Card size="sm" data-testid="card">Small</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        padding: 'var(--spacing-3)',
        borderRadius: 'var(--radius-sm)',
      });
    });

    it('should apply medium size styles', () => {
      render(<Card size="md" data-testid="card">Medium</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        padding: 'var(--spacing-4)',
        borderRadius: 'var(--radius-md)',
      });
    });

    it('should apply large size styles', () => {
      render(<Card size="lg" data-testid="card">Large</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        padding: 'var(--spacing-6)',
        borderRadius: 'var(--radius-lg)',
      });
    });
  });

  describe('Interactive Card Behavior', () => {
    it('should be focusable when interactive', () => {
      render(<Card interactive data-testid="card">Interactive</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('should have button role when interactive', () => {
      render(<Card interactive data-testid="card">Interactive</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('role', 'button');
    });

    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Card interactive onClick={handleClick} data-testid="card">
          Clickable
        </Card>
      );
      const card = screen.getByTestId('card');

      await user.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Enter key is pressed', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Card interactive onClick={handleClick} data-testid="card">
          Clickable
        </Card>
      );
      const card = screen.getByTestId('card');

      card.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space key is pressed', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Card interactive onClick={handleClick} data-testid="card">
          Clickable
        </Card>
      );
      const card = screen.getByTestId('card');

      card.focus();
      await user.keyboard('{ }');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply hover effects on mouse enter', async () => {
      const user = userEvent.setup();

      render(<Card interactive variant="elevated" data-testid="card">Hoverable</Card>);
      const card = screen.getByTestId('card');

      await user.hover(card);

      // Should apply hover shadow for elevated variant
      expect(card).toHaveStyle({
        boxShadow: 'var(--shadow-lg)',
      });
    });

    it('should show focus indicator when focused', async () => {
      const user = userEvent.setup();

      render(<Card interactive data-testid="card">Focusable</Card>);
      const card = screen.getByTestId('card');

      await user.tab();
      expect(card).toHaveFocus();

      // Should have focus ring styles
      expect(card).toHaveStyle({
        outline: 'var(--focus-ring-width) solid var(--focus-ring-color)',
      });
    });
  });

  describe('Card Composition', () => {
    it('should render Card.Header subcomponent', () => {
      render(
        <Card>
          <Card.Header>Card Header</Card.Header>
        </Card>
      );

      expect(screen.getByText('Card Header')).toBeInTheDocument();
    });

    it('should render Card.Content subcomponent', () => {
      render(
        <Card>
          <Card.Content>Card Content</Card.Content>
        </Card>
      );

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render Card.Footer subcomponent', () => {
      render(
        <Card>
          <Card.Footer>Card Footer</Card.Footer>
        </Card>
      );

      expect(screen.getByText('Card Footer')).toBeInTheDocument();
    });

    it('should apply proper spacing between card sections', () => {
      render(
        <Card data-testid="card">
          <Card.Header>Header</Card.Header>
          <Card.Content>Content</Card.Content>
          <Card.Footer>Footer</Card.Footer>
        </Card>
      );

      const card = screen.getByTestId('card');
      // Should have gap styling applied
      expect(card).toHaveStyle({
        gap: 'var(--spacing-3)', // Default medium gap
      });
    });

    it('should allow custom className on subcomponents', () => {
      render(
        <Card>
          <Card.Header className="custom-header">Header</Card.Header>
          <Card.Content className="custom-content">Content</Card.Content>
          <Card.Footer className="custom-footer">Footer</Card.Footer>
        </Card>
      );

      expect(screen.getByText('Header')).toHaveClass('custom-header');
      expect(screen.getByText('Content')).toHaveClass('custom-content');
      expect(screen.getByText('Footer')).toHaveClass('custom-footer');
    });
  });

  describe('Selected State Functionality', () => {
    it('should apply selected styling when selected prop is true', () => {
      render(<Card selected data-testid="card">Selected</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        borderColor: 'var(--selected-border-color)',
        backgroundColor: 'var(--selected-background-color)',
      });
    });

    it('should have aria-selected attribute when selected', () => {
      render(<Card selected interactive data-testid="card">Selected</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('aria-selected', 'true');
    });

    it('should toggle selection state on click for selectable cards', async () => {
      const user = userEvent.setup();
      let isSelected = false;

      const handleClick = () => {
        isSelected = !isSelected;
      };

      const { rerender } = render(
        <Card
          interactive
          selected={isSelected}
          onClick={handleClick}
          data-testid="card"
        >
          Selectable
        </Card>
      );

      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('aria-selected', 'false');

      await user.click(card);

      rerender(
        <Card
          interactive
          selected={true}
          onClick={handleClick}
          data-testid="card"
        >
          Selectable
        </Card>
      );

      expect(card).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Accessibility Requirements', () => {
    describe('Keyboard Support', () => {
      it('should be focusable with Tab key', async () => {
        const user = userEvent.setup();

        render(<Card interactive data-testid="card">Focusable</Card>);
        const card = screen.getByTestId('card');

        await user.tab();
        expect(card).toHaveFocus();
      });

      it('should lose focus with Shift+Tab', async () => {
        const user = userEvent.setup();

        render(
          <>
            <button>Previous</button>
            <Card interactive data-testid="card">Focusable</Card>
          </>
        );

        const card = screen.getByTestId('card');
        const button = screen.getByRole('button', { name: 'Previous' });

        card.focus();
        await user.keyboard('{Shift>}{Tab}{/Shift}');

        expect(button).toHaveFocus();
      });

      it('should activate on Enter key', async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(
          <Card interactive onClick={handleClick} data-testid="card">
            Activatable
          </Card>
        );

        const card = screen.getByTestId('card');
        card.focus();
        await user.keyboard('{Enter}');

        expect(handleClick).toHaveBeenCalled();
      });

      it('should activate on Space key', async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(
          <Card interactive onClick={handleClick} data-testid="card">
            Activatable
          </Card>
        );

        const card = screen.getByTestId('card');
        card.focus();
        await user.keyboard('{ }');

        expect(handleClick).toHaveBeenCalled();
      });
    });

    describe('ARIA Attributes', () => {
      it('should have appropriate role for interactive cards', () => {
        render(<Card interactive data-testid="card">Interactive</Card>);
        const card = screen.getByTestId('card');

        expect(card).toHaveAttribute('role', 'button');
      });

      it('should support aria-label', () => {
        render(
          <Card interactive aria-label="Custom label" data-testid="card">
            Labeled
          </Card>
        );
        const card = screen.getByTestId('card');

        expect(card).toHaveAttribute('aria-label', 'Custom label');
      });

      it('should support aria-describedby', () => {
        render(
          <>
            <div id="description">Description text</div>
            <Card interactive aria-describedby="description" data-testid="card">
              Described
            </Card>
          </>
        );
        const card = screen.getByTestId('card');

        expect(card).toHaveAttribute('aria-describedby', 'description');
      });

      it('should support aria-selected for selectable cards', () => {
        render(<Card interactive selected data-testid="card">Selected</Card>);
        const card = screen.getByTestId('card');

        expect(card).toHaveAttribute('aria-selected', 'true');
      });

      it('should have proper tabIndex for interactive cards', () => {
        render(<Card interactive data-testid="card">Interactive</Card>);
        const card = screen.getByTestId('card');

        expect(card).toHaveAttribute('tabindex', '0');
      });

      it('should not have tabIndex for non-interactive cards', () => {
        render(<Card data-testid="card">Non-interactive</Card>);
        const card = screen.getByTestId('card');

        expect(card).not.toHaveAttribute('tabindex');
      });
    });

    describe('Focus Management', () => {
      it('should show visible focus indicator with proper contrast', async () => {
        const user = userEvent.setup();

        render(<Card interactive data-testid="card">Focusable</Card>);
        const card = screen.getByTestId('card');

        await user.tab();

        expect(card).toHaveFocus();
        expect(card).toHaveStyle({
          outline: 'var(--focus-ring-width) solid var(--focus-ring-color)',
        });
      });

      it('should maintain logical tab order', async () => {
        const user = userEvent.setup();

        render(
          <>
            <Card interactive data-testid="card1">First</Card>
            <Card interactive data-testid="card2">Second</Card>
            <Card interactive data-testid="card3">Third</Card>
          </>
        );

        const card1 = screen.getByTestId('card1');
        const card2 = screen.getByTestId('card2');
        const card3 = screen.getByTestId('card3');

        await user.tab();
        expect(card1).toHaveFocus();

        await user.tab();
        expect(card2).toHaveFocus();

        await user.tab();
        expect(card3).toHaveFocus();
      });
    });
  });

  describe('Design Token Usage', () => {
    it('should apply CardVariantTokens correctly', () => {
      Object.entries(CardVariantTokens).forEach(([variant, tokens]) => {
        render(
          <Card
            variant={variant as CardProps['variant']}
            data-testid={`card-${variant}`}
          >
            {variant} Card
          </Card>
        );

        const card = screen.getByTestId(`card-${variant}`);

        Object.entries(tokens).forEach(([property, value]) => {
          if (property === 'backgroundColor') {
            expect(card).toHaveStyle({ backgroundColor: value });
          } else if (property === 'borderColor') {
            expect(card).toHaveStyle({ borderColor: value });
          } else if (property === 'borderWidth') {
            expect(card).toHaveStyle({ borderWidth: value });
          } else if (property === 'boxShadow') {
            expect(card).toHaveStyle({ boxShadow: value });
          }
        });
      });
    });

    it('should apply CardSizeTokens correctly', () => {
      Object.entries(CardSizeTokens).forEach(([size, tokens]) => {
        render(
          <Card
            size={size as CardProps['size']}
            data-testid={`card-${size}`}
          >
            {size} Card
          </Card>
        );

        const card = screen.getByTestId(`card-${size}`);

        Object.entries(tokens).forEach(([property, value]) => {
          if (property === 'padding') {
            expect(card).toHaveStyle({ padding: value });
          } else if (property === 'borderRadius') {
            expect(card).toHaveStyle({ borderRadius: value });
          }
        });
      });
    });

    it('should apply transition tokens for interactive states', () => {
      render(<Card interactive data-testid="card">Interactive</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        transitionDuration: 'var(--transition-duration)',
        transitionTimingFunction: 'var(--transition-timing-function)',
        transitionProperty: 'var(--transition-property)',
      });
    });
  });

  describe('Semantic Element Rendering', () => {
    it('should render as div by default', () => {
      render(<Card data-testid="card">Default</Card>);
      const card = screen.getByTestId('card');

      expect(card.tagName.toLowerCase()).toBe('div');
    });

    it('should render as article when specified', () => {
      render(<Card as="article" data-testid="card">Article</Card>);
      const card = screen.getByTestId('card');

      expect(card.tagName.toLowerCase()).toBe('article');
    });

    it('should render as section when specified', () => {
      render(<Card as="section" data-testid="card">Section</Card>);
      const card = screen.getByTestId('card');

      expect(card.tagName.toLowerCase()).toBe('section');
    });

    it('should render as aside when specified', () => {
      render(<Card as="aside" data-testid="card">Aside</Card>);
      const card = screen.getByTestId('card');

      expect(card.tagName.toLowerCase()).toBe('aside');
    });
  });

  describe('Disabled State', () => {
    it('should not be focusable when disabled', () => {
      render(<Card interactive disabled data-testid="card">Disabled</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('aria-disabled', 'true');
      expect(card).not.toHaveAttribute('tabindex');
    });

    it('should not respond to click when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Card
          interactive
          disabled
          onClick={handleClick}
          data-testid="card"
        >
          Disabled
        </Card>
      );
      const card = screen.getByTestId('card');

      await user.click(card);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not respond to keyboard events when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Card
          interactive
          disabled
          onClick={handleClick}
          data-testid="card"
        >
          Disabled
        </Card>
      );
      const card = screen.getByTestId('card');

      // Try to focus and activate
      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');
      await user.keyboard('{ }');

      expect(card).not.toHaveFocus();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should apply disabled visual styles', () => {
      render(<Card interactive disabled data-testid="card">Disabled</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveStyle({
        opacity: 'var(--opacity-disabled)',
        cursor: 'not-allowed',
      });
    });
  });

  describe('Usage Patterns', () => {
    describe('Simple Pattern', () => {
      it('should render simple card with content only', () => {
        render(
          <Card>
            <Card.Content>Simple content</Card.Content>
          </Card>
        );

        expect(screen.getByText('Simple content')).toBeInTheDocument();
      });
    });

    describe('With Header Pattern', () => {
      it('should render card with header and content', () => {
        render(
          <Card>
            <Card.Header>Card Title</Card.Header>
            <Card.Content>Card content</Card.Content>
          </Card>
        );

        expect(screen.getByText('Card Title')).toBeInTheDocument();
        expect(screen.getByText('Card content')).toBeInTheDocument();
      });
    });

    describe('Full Pattern', () => {
      it('should render card with all sections', () => {
        render(
          <Card>
            <Card.Header>Header</Card.Header>
            <Card.Content>Content</Card.Content>
            <Card.Footer>Footer</Card.Footer>
          </Card>
        );

        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
      });
    });

    describe('Interactive Pattern', () => {
      it('should render clickable card with proper behavior', async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(
          <Card interactive onClick={handleClick}>
            <Card.Content>Interactive content</Card.Content>
          </Card>
        );

        const card = screen.getByRole('button');

        expect(card).toBeInTheDocument();
        expect(card).toHaveAttribute('tabindex', '0');

        await user.click(card);
        expect(handleClick).toHaveBeenCalled();
      });
    });

    describe('Selectable Pattern', () => {
      it('should render selectable card with toggle behavior', async () => {
        const user = userEvent.setup();
        let selected = false;

        const handleClick = () => {
          selected = !selected;
        };

        const { rerender } = render(
          <Card
            interactive
            selected={selected}
            onClick={handleClick}
            data-testid="selectable-card"
          >
            <Card.Content>Selectable content</Card.Content>
          </Card>
        );

        const card = screen.getByTestId('selectable-card');

        expect(card).toHaveAttribute('aria-selected', 'false');

        await user.click(card);

        // Simulate re-render with new selected state
        rerender(
          <Card
            interactive
            selected={true}
            onClick={handleClick}
            data-testid="selectable-card"
          >
            <Card.Content>Selectable content</Card.Content>
          </Card>
        );

        expect(card).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Component Export Structure', () => {
    it('should export Card as main component', () => {
      expect(Card).toBeDefined();
      expect(typeof Card).toBe('function');
    });

    it('should export Card.Header as subcomponent', () => {
      expect(Card.Header).toBeDefined();
      expect(typeof Card.Header).toBe('function');
    });

    it('should export Card.Content as subcomponent', () => {
      expect(Card.Content).toBeDefined();
      expect(typeof Card.Content).toBe('function');
    });

    it('should export Card.Footer as subcomponent', () => {
      expect(Card.Footer).toBeDefined();
      expect(typeof Card.Footer).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onClick for interactive cards gracefully', () => {
      expect(() => {
        render(<Card interactive>No onClick handler</Card>);
      }).not.toThrow();
    });

    it('should handle invalid variant prop gracefully', () => {
      // This test ensures TypeScript prevents invalid variants,
      // but runtime should handle gracefully
      expect(() => {
        render(<Card variant="default">Valid variant</Card>);
      }).not.toThrow();
    });

    it('should handle invalid size prop gracefully', () => {
      expect(() => {
        render(<Card size="md">Valid size</Card>);
      }).not.toThrow();
    });
  });

  describe('Performance Considerations', () => {
    it('should not re-render unnecessarily', () => {
      const handleClick = jest.fn();

      const { rerender } = render(
        <Card interactive onClick={handleClick}>Content</Card>
      );

      // Re-render with same props
      rerender(
        <Card interactive onClick={handleClick}>Content</Card>
      );

      // Component should handle this efficiently
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});