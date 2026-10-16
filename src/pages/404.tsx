import Head from "next/head";
import { SiteFooter, SiteHeader, StatsCollection } from "@/components/SiteFormat";
import * as translations from "@/locale/locales/en.json";

export default function Custom404() {
  const statusCode = 404;
  const title = "This page could not be found";

  // Minimal translate function for the 404 page
  const t = (key: string): string => {
    const translation = translations["global"];
    const value = translation[key as keyof typeof translation];
    if (typeof value === "string") {
      return value;
    }
    return key;
  };

  return (
    <>
      <Head>
        <title>
          {statusCode}: {title}
        </title>
      </Head>
      <StatsCollection />
      <SiteHeader t={t} />
      <div className="next-error">
        <div className="leading-48">
          {statusCode ? <h1>{statusCode}</h1> : null}
          <div className="next-error-wrap">
            <h2>{title}.</h2>
          </div>
        </div>
        <SiteFooter t={t} />
      </div>
    </>
  );
}
