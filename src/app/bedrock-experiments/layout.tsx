import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minecraft Bedrock Experiments Editor | JaylyMC",
  description: "This tool allows you to modify experimental features in your Minecraft Bedrock world.",
  openGraph: {
    type: "article",
    images: "https://jaylydev.github.io/icon.png",
  },
  twitter: {
    card: "summary",
  },
  metadataBase: new URL("https://jaylydev.github.io"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
