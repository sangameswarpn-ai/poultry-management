import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/language-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PoultryLens AI — Animal Disease & Biosecurity Platform',
  description: 'Digital Farm Management & Biosecurity Portal for Livestock Disease Early Detection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
