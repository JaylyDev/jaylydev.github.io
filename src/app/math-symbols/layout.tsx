import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary of Math Symbols for Microsoft Word | JaylyDev",
  description:
    "Complete list of Math Symbols, codes and their keywords used in Microsoft 365 apps, including Word, Excel, PowerPoint, and many more.",
  openGraph: {
    type: "article",
    images: "https://jaylydev.github.io/icon.png",
    locale: "en",
  },
  twitter: {
    card: "summary",
  },
  metadataBase: new URL("https://jaylydev.github.io"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
