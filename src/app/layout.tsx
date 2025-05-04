import { inter } from "@/components/Font";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jayly's Website | JaylyMC",
  description: "JaylyMC's website. Who makes Minecraft animations and make Minecraft Bedrock Add-Ons sometimes.",
  authors: [{ name: "JaylyMC", url: "https://youtube.com/jaylymc" }],
  openGraph: {
    type: "website",
    images: "https://jaylydev.github.io/icon.png",
  },
  twitter: {
    card: "summary",
  },
  metadataBase: new URL("https://jaylydev.github.io"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
