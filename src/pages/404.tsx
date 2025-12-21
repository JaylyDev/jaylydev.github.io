import Head from "next/head";
import { SiteFooter, SiteHeader, StatsCollection } from "@/components/SiteFormat";

const styles: Record<string, React.CSSProperties> = {
  error: {
    fontFamily:
      'Inter, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    height: "90vh",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  desc: {
    lineHeight: "48px",
  },
  h1: {
    display: "inline-block",
    margin: "0 20px 0 0",
    paddingRight: 23,
    fontSize: 24,
    fontWeight: 500,
    verticalAlign: "top",
  },
  h2: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "28px",
  },
  wrap: {
    display: "inline-block",
  },
};

export default function Custom404() {
  const statusCode = 404;
  const title = "This page could not be found";

  // Minimal translate function for the 404 page
  const t = (key: string) => {
    const translations: Record<string, string> = {
      "header.home": "Home",
      "header.projects": "Projects",
      "header.posts": "Posts",
      "header.about": "About",
      "footer.privacyPolicy": "Privacy Policy",
    };
    return translations[key] || key;
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
      <div style={styles.error}>
        <div style={styles.desc}>
          <style
            dangerouslySetInnerHTML={{
              __html: `body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}
              @media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}`,
            }}
          />
          {statusCode ? (
            <h1 className="next-error-h1" style={styles.h1}>
              {statusCode}
            </h1>
          ) : null}
          <div style={styles.wrap}>
            <h2 style={styles.h2}>{title}.</h2>
          </div>
        </div>
        <SiteFooter t={t} />
      </div>
    </>
  );
}
