import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Account Compound Calculator",
  description:
    "Calculate how many winning trades in a row you need to reach your goal wallet balance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark font-mono",
        jetbrainsMono.variable,
        geistHeading.variable,
      )}
    >
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
