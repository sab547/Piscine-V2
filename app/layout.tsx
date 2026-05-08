import type { Metadata } from 'next';
import { Sora, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sora',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'PoolTrack - Gestion d\'entretien de piscine',
  description: 'PoolTrack transforme chaque passage technicien en preuve d\'intervention horodatée, photographiée et envoyée automatiquement au propriétaire.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-white font-body text-text antialiased">
        {children}
      </body>
    </html>
  );
}
