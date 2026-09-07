import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreaderSerif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InheritanceFi — Autonomous Memory-Powered Inheritance Protocol",
  description:
    "An AI-powered digital inheritance assistant that remembers your wishes across sessions using Sibyl Memory, coordinated by Virtuals Protocol, and executed on Base Sepolia.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interSans.variable} ${newsreaderSerif.variable} ${jetbrainsMono.variable} h-full antialiased bg-white text-[#1d1d20]`}
    >
      <body 
        suppressHydrationWarning
        className="min-h-full flex flex-col antialiased bg-white selection:bg-[#ebebff] selection:text-[#5e5cff]"
      >
        {children}
      </body>
    </html>
  );
}
