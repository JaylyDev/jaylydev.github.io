import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "香港實時隧道收費 | JaylyDev",
  description: "即時提供香港實時三條過海隧道（西隧、東隧、紅隧）和大欖隧道收費資訊。",
  openGraph: {
    type: "article",
    images: "https://jaylydev.github.io/hk-tunnels-tolls/icon.png",
    locale: "zh_HK",
  },
  appleWebApp: {
    title: "香港隧道收費",
    statusBarStyle: "default",
    capable: true,
  },
  manifest: "/hk-tunnels-tolls/manifest.json",
  twitter: {
    card: "summary",
  },
  metadataBase: new URL("https://jaylydev.github.io"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
