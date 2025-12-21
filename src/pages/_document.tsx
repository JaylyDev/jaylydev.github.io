import { LocaleProps } from "@/locale/i18n";
import { AppType } from "next/app";
import { Enhancer } from "next/dist/shared/lib/utils";
import { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document";
import Document from "next/document";

interface CustomDocumentProps extends DocumentInitialProps {
  lang: string;
  hreflang?: string;
}

class MyDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<CustomDocumentProps> {
    // Extract optional hreflang from renderPage context
    let hreflang: string | undefined;

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => {
          const pageProps = props.pageProps as Partial<LocaleProps>;
          if (pageProps?.hreflang) {
            hreflang = pageProps.hreflang;
          }
          return <App {...props} />;
        },
      });

    const initialProps = await Document.getInitialProps(ctx);

    // Extract locale from the URL path
    const pathname = ctx.pathname;
    let lang = "en"; // default

    // Check if it's a locale-specific page
    if (pathname.startsWith("/[locale]")) {
      lang = (ctx.query.locale as string) || "en";
    }

    return { ...initialProps, lang, hreflang };
  }

  render() {
    const { lang, hreflang } = this.props;

    return (
      <Html lang={hreflang ?? lang}>
        <Head />
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
