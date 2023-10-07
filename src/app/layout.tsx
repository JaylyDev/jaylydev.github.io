import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JaylyMC Website - Homepage",
  description: "Homepage for JaylyMC website. He makes Minecraft animations and Minecraft Bedrock Add-Ons sometimes.",
  authors: [{ name: "JaylyMC", url: "https://youtube.com/jaylymc" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
