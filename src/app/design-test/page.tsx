import Link from 'next/link';

export default function DesignTestPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Design Token Integration Test</h1>

        {/* Color Tests */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Color System Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary p-4 text-primary-foreground rounded-lg">
              <p className="font-semibold">Primary</p>
              <p className="text-sm">var(--color-primary)</p>
            </div>
            <div className="bg-secondary p-4 text-secondary-foreground rounded-lg">
              <p className="font-semibold">Secondary</p>
              <p className="text-sm">var(--color-secondary)</p>
            </div>
            <div className="bg-accent p-4 text-accent-foreground rounded-lg">
              <p className="font-semibold">Accent</p>
              <p className="text-sm">var(--color-accent)</p>
            </div>
            <div className="bg-success p-4 text-success-foreground rounded-lg">
              <p className="font-semibold">Success</p>
              <p className="text-sm">var(--color-success)</p>
            </div>
          </div>
        </section>

        {/* Surface Tests */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Surface Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface p-6 border border-border rounded-lg">
              <p className="font-semibold">Surface</p>
              <p className="text-sm text-text-secondary">Primary surface color</p>
            </div>
            <div className="bg-surface-secondary p-6 border border-border rounded-lg">
              <p className="font-semibold">Surface Secondary</p>
              <p className="text-sm text-text-secondary">Secondary surface</p>
            </div>
            <div className="bg-surface-tertiary p-6 border border-border rounded-lg">
              <p className="font-semibold">Surface Tertiary</p>
              <p className="text-sm text-text-secondary">Tertiary surface</p>
            </div>
          </div>
        </section>

        {/* Typography Tests */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Typography System</h2>
          <div className="space-y-4">
            <p className="text-xs">Extra small text (text-xs)</p>
            <p className="text-sm">Small text (text-sm)</p>
            <p className="text-base">Base text (text-base)</p>
            <p className="text-lg">Large text (text-lg)</p>
            <p className="text-xl">Extra large text (text-xl)</p>
            <p className="text-2xl font-semibold">2XL Heading (text-2xl)</p>
            <p className="text-3xl font-bold">3XL Heading (text-3xl)</p>
          </div>
        </section>

        {/* Component Tests */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Component Styles</h2>
          <div className="space-y-6">
            {/* Button Tests */}
            <div>
              <h3 className="text-lg font-medium mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-base btn-primary">Primary Button</button>
                <button className="btn-base btn-secondary">Secondary Button</button>
                <button className="btn-base btn-primary" disabled>Disabled Button</button>
              </div>
            </div>

            {/* Input Tests */}
            <div>
              <h3 className="text-lg font-medium mb-3">Form Controls</h3>
              <div className="max-w-md space-y-4">
                <input
                  type="text"
                  placeholder="Enter text here..."
                  className="input-base"
                />
                <input
                  type="text"
                  placeholder="Disabled input"
                  className="input-base"
                  disabled
                />
              </div>
            </div>

            {/* Card Tests */}
            <div>
              <h3 className="text-lg font-medium mb-3">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-base">
                  <h4 className="font-semibold mb-2">Card Title</h4>
                  <p className="text-text-secondary">This is a card using our design tokens for consistent spacing, colors, and shadows.</p>
                </div>
                <div className="card-base hover:shadow-lg transition-shadow duration-normal">
                  <h4 className="font-semibold mb-2">Hover Card</h4>
                  <p className="text-text-secondary">This card has hover effects using our design token durations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing Tests */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Spacing System</h2>
          <div className="space-y-4">
            <div className="bg-surface-secondary p-2 rounded">Padding: spacing-2 (0.5rem)</div>
            <div className="bg-surface-secondary p-4 rounded">Padding: spacing-4 (1rem)</div>
            <div className="bg-surface-secondary p-6 rounded">Padding: spacing-6 (1.5rem)</div>
            <div className="bg-surface-secondary p-8 rounded">Padding: spacing-8 (2rem)</div>
          </div>
        </section>

        {/* Border Radius Tests */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Border Radius System</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-secondary p-4 rounded-sm">rounded-sm</div>
            <div className="bg-surface-secondary p-4 rounded">rounded (default)</div>
            <div className="bg-surface-secondary p-4 rounded-lg">rounded-lg</div>
            <div className="bg-surface-secondary p-4 rounded-xl">rounded-xl</div>
          </div>
        </section>

        {/* Theme Instructions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Theme Testing</h2>
          <div className="bg-surface-secondary p-6 rounded-lg">
            <p className="text-text-secondary mb-4">
              Use the theme toggle button in the top-right corner to test different themes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li><strong>Light Theme:</strong> Default light theme with blue primary colors</li>
              <li><strong>Dark Theme:</strong> Dark background with adjusted colors for dark mode</li>
              <li><strong>High Contrast:</strong> Enhanced contrast for accessibility</li>
            </ul>
          </div>
        </section>

        <div className="text-center pt-8 border-t border-border">
          <Link
            href="/"
            className="link-primary"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}