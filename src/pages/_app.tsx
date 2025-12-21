import "@/styles/globals.css";
import "@/styles/index.css";
import "@/styles/articles.css";
import "@/styles/components/card.css";
import "@/styles/github-markdown.css";
import "@/styles/highlight.js/github.css";
import "@/styles/posts.css";
import "@/styles/markdown-alert/github-base.css";
import "@/styles/markdown-alert/github-colors-dark-class.css";
import "@/styles/markdown-alert/github-colors-dark-media.css";
import "@/styles/markdown-alert/github-colors-light.css";
import type { AppProps } from "next/app";
import { useLanguageSync } from "@/components/LanguageSwitcher";
import { LocaleProps } from "@/locale/i18n";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps<LocaleProps>) {
  // Sync language preference with localStorage
  useLanguageSync();

  // Update HTML lang attribute on client-side navigation
  useEffect(() => {
    const lang = pageProps.hreflang ?? pageProps.lang ?? "en";
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, [pageProps.hreflang, pageProps.lang]);

  return <Component {...pageProps} />;
}
