import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InterviewAI — Ace every interview with AI coaching",
  description: "Personalised question banks, flashcard study, and AI-proctored mock interviews. Walk into your next interview confident.",
};

// Exported separately — Next.js 14+ requirement to avoid render-blocking
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to API origin so first authenticated request skips DNS+TLS */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
