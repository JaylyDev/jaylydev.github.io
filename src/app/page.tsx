import "@/styles/globals.css";
import "@/styles/index.css";
import React, { JSX } from "react";
import Image from "next/image";
import ProjectCard from "../components/Card";
import { SiteHeader, SiteFooter, Subheading } from "../components/SiteFormat";
import { StatsCollection } from "../components/SiteFormat";
import { PublicPost, getPublicPosts } from "./utilities/getPublicPosts";
import { PublicPosts } from "@/components/Post";

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

function CurrentProjects(): JSX.Element {
  const projects: Project[] = [
    {
      title: `Script API Examples`,
      description:
        "Community Driven Script Examples for using Minecraft's Scripting API.\nThis makes people to easily start develop scripts for Minecraft.",
      links: [{ url: "https://github.com/JaylyDev/ScriptAPI", text: "GitHub" }],
    },
    {
      title: "Script API Docs",
      description:
        "My own documentation for using the Minecraft scripting API. Includes versioned API references, custom code examples for methods and more technical guides.",
      links: [
        { url: "/scriptapi-docs/", text: "Script API Homepage" },
        { url: "/scriptapi-docs/latest/", text: "Stable API Docs" },
      ],
    },
    {
      title: "JaylyBot",
      description: `This is my own Discord bot. It mainly debug your Minecraft scripts, for both Stable and Preview version of Minecraft.
> "Probably one of the few bots I have seen on Discord that I feel is truly worth the effort and time." - Visual1mpact`,
      links: [
        {
          url: "/posts/jaylybot/",
          text: "Invite the Bot",
        },
      ],
    },
    {
      title: "Script Interpreter",
      description: `Script Interpreter is a debugging tool for Minecraft Scripting, that allows user to run JavaScript code in Minecraft Bedrock for testing the API features.
> "Woah this really helps a lot! Like a LOT!" - BlueIcezen`,
      links: [{ url: "/posts/script-interpreter/", text: "Download Script Interpreter" }],
      image: { src: "/assets/script-interpreter.png", alt: "Script Interpreter" },
    },
    {
      title: "Structure Converter",
      description: "A tool to convert Minecraft structures from Java (.nbt) to Bedrock (.mcstructure).",
      links: [{ url: "https://github.com/jaylydev/nbt-to-mcstructure/", text: "Download from GitHub" }],
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
      <Subheading id="projects" title="Projects" />
      <div className="flex min-h-0 flex-col items-center">
        <div
          style={{
            fontSize: "1.1rem",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 m-0 p-0">{ProjectElements}</div>
        </div>
      </div>
      <PreviewLatestYTVideo />
    </div>
  );
}

function AboutMe() {
  const text = `Hi I'm Jayly, this is my website to post my stuff (aside from YouTube and MCPEDL).
                I mainly do Minecraft animations on YouTube, or making Minecraft add-ons for Bedrock.`;
  return (
    <div className="pb-48">
      <Subheading id="about" title="About Me" />
      <div className="flex min-h-0 flex-col items-center p-4 text-lg">
        <div>
          {text.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <h3 style={{ fontStyle: "italic" }}>
            If you have any questions, please feel free to contact me on Discord (jaylymc).
          </h3>
        </div>
      </div>
    </div>
  );
}

function HomeBanner() {
  return (
    <div className="banner-container">
      <div className="flex min-h-0 flex-col items-center p-5">
        <h1 className="relative z-10 text-5xl font-bold text-white" style={{ fontFamily: "Minecraft Five v2" }}>
          Jayly
        </h1>
        <p className="relative z-10 text-2xl font-bold text-white">A website for Jayly</p>
      </div>
      <div className="banner-shadow"></div>
      <div className="banner-jayly-character"></div>
    </div>
  );
}

export default function Home() {
  const posts: PublicPost[] = getPublicPosts();

  return (
    <main id="home">
      <StatsCollection />
      <SiteHeader />
      <HomeBanner />
      <CurrentProjects />
      <PublicPosts posts={posts} />
      <AboutMe />
      <SiteFooter />
    </main>
  );
}
