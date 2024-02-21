import "@/styles/globals.css";
import "@/styles/index.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jayly's Website | JaylyMC",
  description: "JaylyMC's website. Who makes Minecraft animations and make Minecraft Bedrock Add-Ons sometimes.",
  authors: [{ name: "JaylyMC", url: "https://youtube.com/jaylymc" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
