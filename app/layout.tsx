import type { Metadata } from "next";
import { Mukta, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const mukta = Mukta({ variable: "--font-mukta", subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Saaj Admin",
  description: "Manage The House of Saaj store",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mukta.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
