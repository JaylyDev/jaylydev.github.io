import Donation from "@/screens/donate";
import { getStaticLocaleProps, LocaleProps, SUPPORTED_LOCALES } from "@/locale/i18n";
import { GetStaticPaths, GetStaticProps } from "next";

export default function DonationPage({ texts, lang, localizedRoutes }: LocaleProps) {
  return <Donation texts={texts} lang={lang} localizedRoutes={localizedRoutes} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SUPPORTED_LOCALES.map((locale) => ({
    params: { locale },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<LocaleProps> = async ({ params }) => {
  const locale = params?.locale as string;
  const fs = await import("fs/promises");
  const path = await import("path");

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {
      notFound: true,
    };
  }

  return {
    props: await getStaticLocaleProps(locale, "donate", fs, path, "/donate/"),
  };
};
