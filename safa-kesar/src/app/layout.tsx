import type { Metadata } from "next";
import { Epilogue, Hanken_Grotesk, Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-epilogue",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken-grotesk",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Safa Kesar — Pure Artisanal Dry Fruits & Saffron",
    template: "%s · Safa Kesar",
  },
  description:
    "Pure Artisanal Kashmiri Mongra Saffron, Walnuts, Almonds, and Organic Dry Fruits directly from Lethipora, Pampore. Sourced with radical transparency.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${epilogue.variable} ${hankenGrotesk.variable} ${fraunces.variable} ${workSans.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-body-md text-body-md bg-background text-on-background"
      >
        {children}
      </body>
    </html>
  );
}
