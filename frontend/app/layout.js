import { Inter } from 'next/font/google';
import ClientWrapper from './ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Consultoryn',
  description: 'Elegant consultation platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --navy: 11 27 42; /* #0B1B2A */
            --platinum: 229 229 229; /* #E5E5E5 */
            --gold: 234 198 118; /* #EAC676 */
          }
        `}</style>
      </head>
      <body className={`${inter.className} bg-[rgb(var(--platinum))] text-[rgb(var(--navy))] min-h-screen`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}