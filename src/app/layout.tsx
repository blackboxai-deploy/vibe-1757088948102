import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Match Pairs - Memory Card Game",
  description: "A fun memory game where you match emoji pairs. Test your memory skills with this engaging card matching game!",
  keywords: ["memory game", "card matching", "emoji game", "brain training", "puzzle"],
  authors: [{ name: "Memory Game Studio" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Match Pairs - Memory Card Game",
    description: "Test your memory skills with this fun emoji card matching game!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Match Pairs - Memory Card Game",
    description: "Test your memory skills with this fun emoji card matching game!",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎮</text></svg>" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className="antialiased font-sans overflow-x-hidden">
        <div id="root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}