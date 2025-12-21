import React, { JSX } from "react";
import Image from "next/image";
import Head from "next/head";
import ProjectCard from "../components/Card";
import { SiteHeader, SiteFooter, Subheading } from "../components/SiteFormat";
import { StatsCollection } from "../components/SiteFormat";
import { PublicPost } from "@/utilities/getPublicPosts";
import { PublicPosts } from "@/components/Post";
import { ScreenLocaleProps, createTranslateFunction, TranslateProps } from "@/locale/i18n";

export interface HomeProps {
  posts: PublicPost[];
}

interface IHyperlinkParams {
  url: string;
  text: string;
}

interface Project {
  title: string;
  description: string;
  links: IHyperlinkParams[];
  image?: { src: string; alt: string };
  media?: string;
}

function PreviewLatestYTVideo() {
  return (
    <div className="flex min-h-fit flex-col items-center p-12" id="youtube">
      <Image
        className="hidden dark:block"
        src="/assets/yt_logo_rgb_dark.png"
        alt="dark-mode-image"
        width={302}
        height={68}
      />
      <Image
        className="mb-4 block dark:hidden"
        src="/assets/yt_logo_rgb_light.png"
        alt="light-mode-image"
        width={302}
        height={68}
      />
      <iframe
        src="https://www.youtube.com/embed?listType=playlist&list=UULFguD3-nPXTVY6CHw3F1HWvw"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="youtube-video-playback"
      ></iframe>
    </div>
  );
}

function CurrentProjects({ t }: TranslateProps): JSX.Element {
  const projects: Project[] = [
    {
      title: t("scriptApiExamples.title"),
      description: t("scriptApiExamples.description"),
      links: [{ url: "https://github.com/JaylyDev/ScriptAPI", text: "GitHub" }],
    },
    {
      title: t("scriptApiDocs.title"),
      description: t("scriptApiDocs.description"),
      links: [
        { url: "/scriptapi-docs/", text: t("scriptApiDocs.linkHomepage") },
        { url: "/scriptapi-docs/latest/", text: t("scriptApiDocs.linkStableDocs") },
      ],
    },
    {
      title: t("jaylyBot.title"),
      description: t("jaylyBot.description"),
      links: [
        {
          url: "/posts/jaylybot/",
          text: t("jaylyBot.linkInvite"),
        },
      ],
    },
    {
      title: t("scriptInterpreter.title"),
      description: t("scriptInterpreter.description"),
      links: [{ url: "/posts/script-interpreter/", text: t("scriptInterpreter.linkDownload") }],
      image: { src: "/assets/script-interpreter.png", alt: t("scriptInterpreter.title") },
    },
    {
      title: t("structureConverter.title"),
      description: t("structureConverter.description"),
      links: [
        {
          url: "https://github.com/jaylydev/nbt-to-mcstructure/",
          text: t("structureConverter.linkDownload"),
        },
      ],
      image: {
        src: "/assets/nbt_to_mcstructure_icon.png",
        alt: "Structure",
      },
      media: "/assets/nbt_to_mcstructure_demo.gif",
    },
  ];

  const ProjectElements = projects.map((project, index) => <ProjectCard key={index} {...project} />);

  return (
    <div>
      <Subheading id="projects" title={t("projectsHeading")} />
      <div className="flex min-h-0 flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 m-0 p-0">{ProjectElements}</div>
      </div>
      <PreviewLatestYTVideo />
    </div>
  );
}

function AboutMe({ t }: TranslateProps) {
  return (
    <div className="pb-48">
      <Subheading id="about" title={t("aboutHeading")} />
      <div className="flex min-h-0 flex-col items-center p-4 text-lg">
        <span>
          <p>{t("aboutParagraph1")}</p>
          <p>{t("aboutParagraph2")}</p>
          <p>{t("aboutParagraph3")}</p>
          <p className="italic">{t("aboutContact")}</p>
        </span>
      </div>
    </div>
  );
}

function HomeBanner({ t }: TranslateProps) {
  return (
    <div className="banner-container">
      <div className="flex min-h-0 flex-col items-center p-5">
        <h1 className="relative z-10 text-5xl font-bold text-white" style={{ fontFamily: "Minecraft Five v2" }}>
          {t("bannerTitle")}
        </h1>
        <p className="relative z-10 text-2xl font-bold text-white">{t("bannerSubtitle")}</p>
      </div>
      <div className="banner-shadow"></div>
      <div className="banner-jayly-character"></div>
    </div>
  );
}

function PageHeadMetadata({ t }: TranslateProps) {
  return (
    <Head>
      <title>{t("pageTitle")}</title>
      <meta name="description" content={t("pageDescription")} />
      <meta name="author" content="JaylyMC" />
      <link rel="author" href="https://youtube.com/jaylymc/"></link>
      <meta property="og:title" content={t("pageTitle")} />
      <meta property="og:description" content={t("pageDescription")} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://jaylydev.github.io/icon.png" />
      <meta property="twitter:title" content={t("pageTitle")} />
      <meta property="twitter:description" content={t("pageDescription")} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:image" content="https://jaylydev.github.io/icon.png" />
      <link rel="canonical" href="https://jaylydev.github.io/" />
      <link rel="alternate" hrefLang="zh" href="https://jaylydev.github.io/zh/" />
      <link rel="alternate" hrefLang="en" href="https://jaylydev.github.io" />
    </Head>
  );
}

export default function Home({ posts, texts, lang, localizedRoutes }: HomeProps & ScreenLocaleProps) {
  const t = createTranslateFunction(texts);
  return (
    <>
      <PageHeadMetadata t={t} />
      <StatsCollection />
      <SiteHeader t={t} lang={lang} localizedRoutes={localizedRoutes} />
      <HomeBanner t={t} />
      <CurrentProjects t={t} />
      <PublicPosts posts={posts} t={t} />
      <AboutMe t={t} />
      <SiteFooter t={t} lang={lang} localizedRoutes={localizedRoutes} />
    </>
  );
}
