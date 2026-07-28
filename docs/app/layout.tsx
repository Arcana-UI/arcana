import './global.css';
import { Banner } from 'fumadocs-ui/components/banner';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          <Banner id="arcana-sunset">
            Arcana UI was a proof of concept and is not actively maintained. For a maintained
            machine-readable design system, see&nbsp;
            <a href="https://astryx.atmeta.com/" target="_blank" rel="noopener noreferrer">
              Meta&apos;s Astryx
            </a>
            .
          </Banner>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    template: '%s | Arcana UI',
    default: 'Arcana UI',
  },
  description:
    'A modern React component library with a warm stone/indigo design system, built for accessibility and AI-first workflows.',
  icons: {
    icon: '/favicon.svg',
  },
};
