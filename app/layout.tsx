// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Nav } from '../components/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Abdulsamad | Fullstack Engineer',
  description: 'Fullstack Software Engineer specializing in Backend Architecture, AI Integration, and Web3.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Nav />
        {/* We can put a global Nav component here later */}
        {children}
      </body>
    </html>
  );
}