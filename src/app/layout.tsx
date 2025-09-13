import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LayoutContainer } from '@/components/layout/LayoutContainer';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { ThemeProvider } from '@/components/theme-provider';
import { primaryNavigation, secondaryNavigation } from '@/config/navigation';
import { BreadcrumbProvider } from '@/providers/BreadcrumbProvider';
import { NavigationProvider } from '@/providers/NavigationProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CPA On Web LLP - Professional Accounting Services',
  description: 'Professional accounting, tax preparation, and financial consulting services. Expert CPA services for individuals and businesses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          attribute="data-theme"
          storageKey="cpaonweb-theme"
          enableTransitions
          enableSystem
          availableThemes={['light', 'dark', 'high-contrast', 'system']}
        >
          <NavigationProvider>
            <BreadcrumbProvider>
              {/* Main Layout Structure */}
              <div className="relative flex min-h-screen flex-col">
                {/* Header Navigation */}
                <Header navigation={primaryNavigation} />

                {/* Mobile Navigation */}
                <MobileNavigation navigation={primaryNavigation} />

                {/* Main Content Area */}
                <main id="main-content" className="flex-1">
                  <LayoutContainer>
                    {/* Breadcrumb Navigation */}
                    <Breadcrumbs className="mb-6" />

                    {/* Page Content */}
                    {children}
                  </LayoutContainer>
                </main>

                {/* Footer */}
                <Footer navigation={secondaryNavigation} />
              </div>
            </BreadcrumbProvider>
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
