'use client';

/**
 * Design System Sandbox - Comprehensive Component Showcase
 *
 * This sandbox provides a comprehensive showcase of all implemented UI components
 * from the unified design system. It demonstrates various states, sizes, and
 * configurations of components for testing and development purposes.
 */

import React from 'react';

import { SandboxThemeControls } from '@/components/SandboxThemeControls';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Section component for organizing different component demonstrations
 */
interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

/**
 * Demo Card component for showcasing individual component variations
 */
interface DemoCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function DemoCard({ title, description, children, className }: DemoCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

/**
 * Component grid for organizing multiple variations
 */
interface ComponentGridProps {
  children: React.ReactNode;
  columns?: number;
}

function ComponentGrid({ children, columns = 2 }: ComponentGridProps) {
  return (
    <div className={cn(
      'grid gap-6',
      columns === 1 && 'grid-cols-1',
      columns === 2 && 'grid-cols-1 md:grid-cols-2',
      columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    )}>
      {children}
    </div>
  );
}

/**
 * Simple icon components for demonstrations
 */
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

/**
 * Main Sandbox Page Component
 */
export default function SandboxPage() {
  const [inputValue, setInputValue] = React.useState('');
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});

  const handleLoadingDemo = (buttonId: string) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Design System Sandbox
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
              Explore and test the unified design system components. This sandbox showcases
              all implemented UI components with various states, sizes, and configurations.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <span>💡</span>
              <span>Use the theme controls below to see all components respond instantly</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Theme Controls */}
        <SandboxThemeControls />

        <div className="space-y-16">

          {/* Button Components */}
          <Section
            title="Button Components"
            description="Versatile button component with multiple variants, sizes, loading states, and icon support."
          >
            <div className="space-y-8">

              {/* Button Variants */}
              <DemoCard
                title="Button Variants"
                description="Different visual styles for various use cases"
              >
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </DemoCard>

              {/* Button Sizes */}
              <DemoCard
                title="Button Sizes"
                description="Multiple size options for different contexts"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm" variant="primary">Small</Button>
                  <Button size="md" variant="primary">Medium</Button>
                  <Button size="lg" variant="primary">Large</Button>
                  <Button size="xl" variant="primary">Extra Large</Button>
                </div>
              </DemoCard>

              {/* Button with Icons */}
              <ComponentGrid columns={2}>
                <DemoCard
                  title="Buttons with Icons"
                  description="Start and end icon placement"
                >
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Button startIcon={<SearchIcon />} variant="outline">
                        Search
                      </Button>
                      <Button endIcon={<ArrowRightIcon />} variant="primary">
                        Continue
                      </Button>
                    </div>
                    <div className="flex gap-3">
                      <Button startIcon={<MailIcon />} endIcon={<ArrowRightIcon />} variant="secondary">
                        Send Email
                      </Button>
                    </div>
                  </div>
                </DemoCard>

                <DemoCard
                  title="Loading States"
                  description="Interactive loading demonstration"
                >
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      loading={loadingStates.demo1 || false}
                      onClick={() => handleLoadingDemo('demo1')}
                      className="w-full"
                    >
                      {loadingStates.demo1 ? 'Loading...' : 'Click to Load'}
                    </Button>
                    <Button
                      variant="outline"
                      loading={loadingStates.demo2 || false}
                      onClick={() => handleLoadingDemo('demo2')}
                      startIcon={<UserIcon />}
                      className="w-full"
                    >
                      {loadingStates.demo2 ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </DemoCard>
              </ComponentGrid>

              {/* Button States */}
              <ComponentGrid columns={2}>
                <DemoCard
                  title="Button States"
                  description="Different interactive and visual states"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary">Normal</Button>
                      <Button variant="primary" disabled>Disabled</Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="secondary">Normal</Button>
                      <Button variant="secondary" disabled>Disabled</Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline">Normal</Button>
                      <Button variant="outline" disabled>Disabled</Button>
                    </div>
                  </div>
                </DemoCard>

                <DemoCard
                  title="Loading States Demo"
                  description="Interactive loading state demonstration"
                >
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      loading={loadingStates.demo3 || false}
                      onClick={() => handleLoadingDemo('demo3')}
                      className="w-full"
                    >
                      {loadingStates.demo3 ? 'Processing...' : 'Process Data'}
                    </Button>
                    <Button
                      variant="outline"
                      loading={loadingStates.demo4 || false}
                      onClick={() => handleLoadingDemo('demo4')}
                      startIcon={<MailIcon />}
                      className="w-full"
                    >
                      {loadingStates.demo4 ? 'Sending...' : 'Send Message'}
                    </Button>
                    <Button
                      variant="destructive"
                      loading={loadingStates.demo5 || false}
                      onClick={() => handleLoadingDemo('demo5')}
                      className="w-full"
                    >
                      {loadingStates.demo5 ? 'Deleting...' : 'Delete Item'}
                    </Button>
                  </div>
                </DemoCard>
              </ComponentGrid>

              {/* Full Width Buttons */}
              <DemoCard
                title="Full Width Buttons"
                description="Buttons that span the full width of their container"
              >
                <div className="space-y-3 max-w-md">
                  <Button variant="primary" fullWidth>Primary Full Width</Button>
                  <Button variant="secondary" fullWidth>Secondary Full Width</Button>
                  <Button variant="outline" fullWidth startIcon={<SearchIcon />}>Outline with Icon</Button>
                </div>
              </DemoCard>

            </div>
          </Section>

          {/* Input Components */}
          <Section
            title="Input Components"
            description="Comprehensive input component with various states, sizes, icons, and validation support."
          >
            <div className="space-y-8">

              {/* Basic Inputs */}
              <ComponentGrid columns={2}>
                <DemoCard
                  title="Input Sizes"
                  description="Small, medium, and large input sizes"
                >
                  <div className="space-y-4">
                    <Input
                      size="sm"
                      placeholder="Small input"
                      label="Small Size"
                    />
                    <Input
                      size="md"
                      placeholder="Medium input"
                      label="Medium Size"
                    />
                    <Input
                      size="lg"
                      placeholder="Large input"
                      label="Large Size"
                    />
                  </div>
                </DemoCard>

                <DemoCard
                  title="Input States"
                  description="Different visual states for validation"
                >
                  <div className="space-y-4">
                    <Input
                      state="default"
                      placeholder="Default state"
                      label="Default"
                    />
                    <Input
                      state="success"
                      placeholder="Success state"
                      label="Success"
                      helperText="Looks good!"
                    />
                    <Input
                      state="warning"
                      placeholder="Warning state"
                      label="Warning"
                      helperText="Please double-check this field"
                    />
                    <Input
                      state="error"
                      placeholder="Error state"
                      label="Error"
                      errorMessage="This field is required"
                    />
                  </div>
                </DemoCard>
              </ComponentGrid>

              {/* Input with Icons */}
              <ComponentGrid columns={2}>
                <DemoCard
                  title="Input with Icons"
                  description="Start and end icon placement"
                >
                  <div className="space-y-4">
                    <Input
                      startIcon={<SearchIcon />}
                      placeholder="Search..."
                      label="Search Input"
                    />
                    <Input
                      startIcon={<MailIcon />}
                      type="email"
                      placeholder="Enter email"
                      label="Email Address"
                    />
                    <Input
                      startIcon={<UserIcon />}
                      endIcon={<ArrowRightIcon />}
                      placeholder="Username"
                      label="Username"
                    />
                  </div>
                </DemoCard>

                <DemoCard
                  title="Interactive Features"
                  description="Clearable inputs and special behaviors"
                >
                  <div className="space-y-4">
                    <Input
                      clearable
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Clearable input"
                      label="Clearable Input"
                      helperText="Type something and see the clear button"
                    />
                    <Input
                      disabled
                      placeholder="Disabled input"
                      label="Disabled"
                    />
                    <Input
                      readOnly
                      value="Read-only value"
                      label="Read-only"
                    />
                  </div>
                </DemoCard>
              </ComponentGrid>

              {/* Input Types Showcase */}
              <DemoCard
                title="Input Types"
                description="Different input types with appropriate icons and validation"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Enter text"
                      label="Text Input"
                      startIcon={<UserIcon />}
                    />
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      label="Email Input"
                      startIcon={<MailIcon />}
                    />
                    <Input
                      type="password"
                      placeholder="Enter password"
                      label="Password Input"
                    />
                    <Input
                      type="search"
                      placeholder="Search..."
                      label="Search Input"
                      startIcon={<SearchIcon />}
                      clearable
                    />
                  </div>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      placeholder="0"
                      label="Number Input"
                    />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      label="Phone Input"
                    />
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      label="URL Input"
                    />
                    <Input
                      type="text"
                      placeholder="Disabled input"
                      label="Disabled State"
                      disabled
                      startIcon={<UserIcon />}
                    />
                  </div>
                </div>
              </DemoCard>

              {/* Form Example */}
              <DemoCard
                title="Complete Form Example"
                description="Form integration with validation states and proper labeling"
              >
                <form className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Enter your full name"
                      startIcon={<UserIcon />}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      startIcon={<MailIcon />}
                      helperText="We'll never share your email with anyone else"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      type="search"
                      placeholder="Search..."
                      startIcon={<SearchIcon />}
                      clearable
                    />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" variant="primary" fullWidth>
                      Submit Form
                    </Button>
                  </div>
                </form>
              </DemoCard>

            </div>
          </Section>

          {/* Card Components */}
          <Section
            title="Card Components"
            description="Flexible card container with header, content, and footer sections. Supports multiple variants and interactive states."
          >
            <div className="space-y-8">

              {/* Card Variants */}
              <ComponentGrid columns={2}>
                <DemoCard
                  title="Card Variants"
                  description="Different visual styles for various contexts"
                  className="space-y-4"
                >
                  <div className="grid gap-4">
                    <Card variant="default" size="sm">
                      <CardContent>Default Card</CardContent>
                    </Card>
                    <Card variant="outlined" size="sm">
                      <CardContent>Outlined Card</CardContent>
                    </Card>
                    <Card variant="elevated" size="sm">
                      <CardContent>Elevated Card</CardContent>
                    </Card>
                    <Card variant="filled" size="sm">
                      <CardContent>Filled Card</CardContent>
                    </Card>
                  </div>
                </DemoCard>

                <DemoCard
                  title="Card Sizes"
                  description="Small, medium, and large card sizes"
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <Card variant="outlined" size="sm">
                      <CardContent>Small Card</CardContent>
                    </Card>
                    <Card variant="outlined" size="md">
                      <CardContent>Medium Card</CardContent>
                    </Card>
                    <Card variant="outlined" size="lg">
                      <CardContent>Large Card</CardContent>
                    </Card>
                  </div>
                </DemoCard>
              </ComponentGrid>

              {/* Structured Cards */}
              <ComponentGrid columns={3}>
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>
                      Simple card with header and content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is the main content area of the card. You can put any
                      content here including text, images, forms, or other components.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Card with Footer</CardTitle>
                    <CardDescription>
                      Card with header, content, and footer sections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Content area with additional footer actions below.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Cancel</Button>
                      <Button size="sm" variant="primary">Confirm</Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card variant="filled">
                  <CardHeader>
                    <CardTitle>Feature Card</CardTitle>
                    <CardDescription>
                      Showcase card with multiple elements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <UserIcon />
                      <span className="text-sm">User Profile</span>
                    </div>
                    <Input
                      size="sm"
                      placeholder="Search features..."
                      startIcon={<SearchIcon />}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="ghost" fullWidth>
                      View All Features
                    </Button>
                  </CardFooter>
                </Card>
              </ComponentGrid>

              {/* Interactive and Special Cards */}
              <ComponentGrid columns={3}>
                <Card
                  variant="outlined"
                  interactive
                  onClick={() => alert('Card clicked!')}
                >
                  <CardHeader>
                    <CardTitle>Interactive Card</CardTitle>
                    <CardDescription>
                      Click anywhere on this card
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      This card is interactive and responds to clicks and keyboard navigation.
                      Try clicking or focusing with Tab and pressing Enter or Space.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <span className="text-sm">Click to interact</span>
                      <ArrowRightIcon />
                    </div>
                  </CardFooter>
                </Card>

                <Card variant="outlined" selected>
                  <CardHeader>
                    <CardTitle>Selected Card</CardTitle>
                    <CardDescription>
                      This card is in selected state
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Cards can have a selected state which is useful for
                      multi-selection interfaces or highlighting current items.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  </CardFooter>
                </Card>

                <Card variant="outlined" disabled>
                  <CardHeader>
                    <CardTitle>Disabled Card</CardTitle>
                    <CardDescription>
                      This card is disabled
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Disabled cards have reduced opacity and cannot be interacted with.
                      This is useful for inactive items or during loading states.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center text-gray-400">
                      <span className="text-sm">Disabled state</span>
                    </div>
                  </CardFooter>
                </Card>
              </ComponentGrid>

              {/* Complex Card Layouts */}
              <DemoCard
                title="Complex Card Layouts"
                description="Advanced card compositions with different content types"
              >
                <ComponentGrid columns={2}>
                  <Card variant="elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>User Profile Card</CardTitle>
                          <CardDescription>Complete user information</CardDescription>
                        </div>
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <UserIcon />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Role</span>
                          <span className="font-medium">Administrator</span>
                        </div>
                      </div>
                      <Input
                        size="sm"
                        placeholder="Search user data..."
                        startIcon={<SearchIcon />}
                      />
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="primary">Edit Profile</Button>
                    </CardFooter>
                  </Card>

                  <Card variant="filled">
                    <CardHeader>
                      <CardTitle>Action Center</CardTitle>
                      <CardDescription>Quick actions and controls</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Button size="sm" variant="ghost" className="justify-start">
                          <MailIcon />
                          Messages
                        </Button>
                        <Button size="sm" variant="ghost" className="justify-start">
                          <SearchIcon />
                          Search
                        </Button>
                        <Button size="sm" variant="ghost" className="justify-start">
                          <UserIcon />
                          Profile
                        </Button>
                        <Button size="sm" variant="ghost" className="justify-start">
                          <ArrowRightIcon />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" variant="primary" fullWidth>
                        Open Dashboard
                      </Button>
                    </CardFooter>
                  </Card>
                </ComponentGrid>
              </DemoCard>

            </div>
          </Section>

          {/* Theme Demonstration */}
          <Section
            title="Theme System Demonstration"
            description="Interactive demonstration of how all components respond to theme changes. Use the theme controls above to see instant updates."
          >
            <div className="space-y-8">

              {/* Theme-aware component showcase */}
              <ComponentGrid columns={3}>
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Theme-Aware Card</CardTitle>
                    <CardDescription>
                      Colors and styles automatically adjust based on the current theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-500 dark:bg-blue-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Progress indicators adapt to theme automatically
                      </p>
                    </div>
                    <Input
                      placeholder="Theme-responsive input"
                      startIcon={<SearchIcon />}
                      size="sm"
                    />
                  </CardContent>
                  <CardFooter>
                    <Button variant="primary" size="sm" fullWidth>
                      Theme-Aware Button
                    </Button>
                  </CardFooter>
                </Card>

                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle>Color Variations</CardTitle>
                    <CardDescription>
                      See how different variants respond to theme changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="primary">Primary</Button>
                      <Button size="sm" variant="secondary">Secondary</Button>
                      <Button size="sm" variant="outline">Outline</Button>
                      <Button size="sm" variant="ghost">Ghost</Button>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Background</span>
                        <span className="font-mono text-gray-800 dark:text-gray-200">
                          Dynamic
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Text</span>
                        <span className="font-mono text-gray-800 dark:text-gray-200">
                          Adaptive
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="filled">
                  <CardHeader>
                    <CardTitle>Interactive Elements</CardTitle>
                    <CardDescription>
                      Form elements with theme-responsive styling
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      size="sm"
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      startIcon={<MailIcon />}
                    />
                    <Input
                      size="sm"
                      label="Search"
                      placeholder="Search content..."
                      startIcon={<SearchIcon />}
                      state="success"
                      helperText="Theme colors apply to all states"
                    />
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" className="flex-1">
                        Submit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ComponentGrid>

              {/* Theme transition demonstration */}
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Theme Transition Effects</CardTitle>
                  <CardDescription>
                    All components support smooth transitions between themes. Try switching themes using the controls above.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Color Transitions</h4>
                      <div className="space-y-2">
                        <div className="w-full h-8 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded transition-colors duration-300" />
                        <div className="w-full h-8 bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-400 dark:to-teal-400 rounded transition-colors duration-300" />
                        <div className="w-full h-8 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Interactive Elements</h4>
                      <div className="space-y-3">
                        <Button variant="primary" className="w-full transition-all duration-300">
                          Smooth Transition Button
                        </Button>
                        <Input
                          placeholder="Transitions apply to inputs too"
                          className="transition-colors duration-300"
                        />
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded transition-colors duration-300">
                          Background color transitions
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </Section>

          {/* Design Tokens Preview */}
          <Section
            title="Design System Overview"
            description="Visual reference for the design system tokens, typography, and spacing."
          >
            <ComponentGrid columns={1}>
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Component Integration</CardTitle>
                  <CardDescription>
                    All components work together seamlessly using the unified design system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Typography Scale */}
                  <div>
                    <h4 className="font-medium mb-3">Typography Scale</h4>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Extra Small (12px)</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Small (14px)</p>
                      <p className="text-base text-gray-600 dark:text-gray-400">Base (16px)</p>
                      <p className="text-lg text-gray-600 dark:text-gray-400">Large (18px)</p>
                      <p className="text-xl text-gray-600 dark:text-gray-400">Extra Large (20px)</p>
                    </div>
                  </div>

                  {/* Color Palette Preview */}
                  <div>
                    <h4 className="font-medium mb-3">Interactive Elements</h4>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary">Primary</Button>
                        <Button size="sm" variant="secondary">Secondary</Button>
                        <Button size="sm" variant="outline">Outline</Button>
                      </div>
                      <div className="flex gap-2">
                        <Input size="sm" placeholder="Input field" />
                        <Button size="sm" variant="ghost" startIcon={<SearchIcon />}>
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    All components share consistent spacing, colors, and typography through design tokens
                  </p>
                </CardFooter>
              </Card>
            </ComponentGrid>
          </Section>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <p>Design System Sandbox • Built with Next.js, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}