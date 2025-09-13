import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
