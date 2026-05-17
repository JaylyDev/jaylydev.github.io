import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { createTranslateFunction, getHreflang, ScreenLocaleProps, TranslateFunction } from "@/locale/i18n";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import Head from "next/head";

function DonationPage({ t }: { t: TranslateFunction }): JSX.Element {
  const kofiIframeStyle: React.CSSProperties = {
    border: "none",
    width: "100%",
    maxWidth: "600px",
    display: "block",
    margin: "0 auto",
    background: "#ffffff",
  };

  return (
    <main>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,211,153,0.18),_transparent_55%)]" />
      <section className="relative mx-auto flex w-full max-w-5xl flex-col px-6 pb-16 pt-10">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-500 sm:text-5xl">{t("pageTitle")}</h1>
          <p className="mt-4 text-lg leading-relaxed sm:text-xl">{t("pageDescription")}</p>
        </header>

        <div className="mx-auto mt-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("donateText")}</h2>
          <p className="mt-3">{t("whatIsKoFi")}</p>
          <p className="mt-3">
            <a
              href="https://ko-fi.com/jaylymc"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-emerald-400 decoration-2 underline-offset-4 transition-colors hover:text-emerald-400"
            >
              {t("paymentMethodsMessage")}
            </a>
          </p>
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-3">
            <div className="rounded-xl bg-zinc-50">
              <iframe
                id="kofiframe"
                src="https://ko-fi.com/jaylymc/?hidefeed=true&widget=true&embed=true&preview=true"
                style={kofiIframeStyle}
                height="712"
                title="jaylymc"
                allow="payment"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Page({ texts, lang, localizedRoutes }: ScreenLocaleProps) {
  const t = createTranslateFunction(texts);
  const hreflang = getHreflang(lang, localizedRoutes, true);
  return (
    <>
      <Head>
        <title>{t("title")} | JaylyMC</title>
        <meta name="description" content={t("description")} />
        <meta property="og:locale" content={hreflang} />
        <link rel="alternate" hrefLang="en" href="https://jaylydev.github.io/donate/" />
        <link rel="alternate" hrefLang="zh" href="https://jaylydev.github.io/zh/donate/" />
        <meta property="twitter:card" content="summary" />
      </Head>
      <StatsCollection />
      <SiteHeader t={t} lang={lang} localizedRoutes={localizedRoutes} />
      <HeroUIProvider>
        <ThemeProvider>
          <DonationPage t={t} />
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter t={t} lang={lang} localizedRoutes={localizedRoutes} showKofi={false} />
    </>
  );
}
