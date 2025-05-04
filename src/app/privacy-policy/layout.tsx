import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | JaylyMC",
  description:
    "This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.",
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
