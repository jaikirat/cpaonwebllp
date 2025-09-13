import { Button } from '@/components/ui/button';

export default function SandboxPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Component Sandbox</h1>
        <p className="text-muted-foreground">Testing ground for UI components</p>
      </div>

      <div className="space-y-8">
        {/* Button Variants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>

        {/* Button Sizes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">⚙️</Button>
          </div>
        </div>

        {/* Disabled Buttons */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Disabled State</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" disabled>Disabled Default</Button>
            <Button variant="secondary" disabled>Disabled Secondary</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
          </div>
        </div>
      </div>
    </div>
  );
}