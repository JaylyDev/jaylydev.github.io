import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JaylyMC | A website for Jayly",
  description:
    "JaylyMC makes Minecraft animations on YouTube and Minecraft Add-Ons for Bedrock Edition. There are couple of articles about Minecraft and coding.",
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
      <body>{children}</body>
    </html>
  );
}
