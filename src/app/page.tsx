"use client";
import Image from "next/image";
import Script from "next/script";
import { Padding } from "./components/Padding";
import ProjectCard from "./components/Card";
import WebComponent from "./components/TopPage";

interface IHyperlinkParams {
  url: string;
  text: string;
}

function PreviewLatestYTVideo() {
  return (
    <div className="flex min-h-fit flex-col items-center p-12" id="youtube">
      <svg
        viewBox="0 0 90 20"
        focusable="false"
        style={{
          pointerEvents: "none",
          display: "block",
          height: "20%",
          width: 300,
        }}
      >
        <svg viewBox="0 0 90 20" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path
              d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
              fill="#FF0000"
            ></path>
            <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
          </g>
          <g>
            <g>
              <path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z"></path>
              <path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0647 7.34234 47.3234 8.15137C47.5821 8.96275 47.7115 10.0422 47.7115 11.3898V13.2078C47.7115 14.5437 47.5845 15.6161 47.3329 16.4251C47.0812 17.2365 46.672 17.8292 46.1075 18.2031C45.5431 18.5771 44.7764 18.7652 43.8098 18.7652C42.8126 18.7675 42.0342 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 43.0008 8.35833C42.8432 8.77461 42.7656 9.43077 42.7656 10.3292V14.2309C42.7656 15.1575 42.8408 15.8254 42.9914 16.2323C43.1419 16.6415 43.4123 16.8461 43.8074 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z"></path>
              <path d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z"></path>
              <path d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z"></path>
              <path d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z"></path>
              <path d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z"></path>
              <path d="M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.7942 16.343C86.9518 16.0161 87.0365 15.4705 87.0506 14.7085L89.4824 14.8519C89.4965 14.9601 89.5035 15.1106 89.5035 15.3011C89.5035 16.4582 89.186 17.3237 88.5534 17.8952C87.9208 18.4667 87.0247 18.7536 85.8676 18.7536C84.4777 18.7536 83.504 18.3185 82.9466 17.446C82.3869 16.5735 82.1094 15.2259 82.1094 13.4008V11.2136C82.1094 9.33452 82.3987 7.96105 82.9772 7.09558C83.5558 6.2301 84.5459 5.79736 85.9499 5.79736C86.9165 5.79736 87.6597 5.97375 88.1771 6.32888C88.6945 6.684 89.059 7.23433 89.2707 7.98457C89.4824 8.7348 89.5882 9.76961 89.5882 11.0913V13.2362H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83593C84.8892 9.2381 84.8657 9.84722 84.8657 10.6657V11.5641H86.9283V10.6657C86.9283 9.86133 86.9001 9.25221 86.846 8.83593C86.7919 8.41966 86.6931 8.12803 86.5496 7.95635C86.4062 7.78702 86.1851 7.7 85.8864 7.7C85.5854 7.70235 85.3643 7.79172 85.2232 7.96811Z"></path>
            </g>
          </g>
        </svg>
      </svg>
      <iframe
        src="https://www.youtube.com/embed?listType=playlist&list=UULFguD3-nPXTVY6CHw3F1HWvw"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="youtube-video-playback"
      ></iframe>
    </div>
  );
}

export interface Project {
  title: string;
  description: string;
  links: IHyperlinkParams[];
  image?: { src: string; alt: string };
  media?: string;
}

function CurrentProjects() {
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
        "My own Documentation for using the Minecraft scripting API. Includes versioned API references and custom code examples for methods.",
      links: [
        { url: "/scriptapi-docs/latest", text: "Stable API Docs" },
        { url: "/scriptapi-docs/preview", text: "Preview API Docs" },
      ],
    },
    {
      title: "JaylyBot",
      description: `This is my own Discord bot. It mainly debug your Minecraft scripts, for both Stable and Preview version of Minecraft.
> "Probably one of the few bots I have seen on Discord that I feel is truly worth the effort and time." - Visual1mpact`,
      links: [
        {
          url: "https://discord.com/api/oauth2/authorize?client_id=948686094986264716&permissions=277025516544&scope=bot",
          text: "Invite Now",
        },
      ],
    },
    {
      title: "Script Interpreter",
      description: `Script Interpreter is a debugging tool for Minecraft Scripting, that allows user to run JavaScript code in Minecraft: Bedrock Edition for testing the API features.
> "Woah this really helps a lot! Like a LOT!" - BlueIcezen`,
      links: [{ url: "https://mcpedl.com/gametest-interpreter/", text: "MCPEDL" }],
      image: { src: "/images/script-interpreter.png", alt: "Script Interpreter" },
    },
    {
      title: "Structure Converter",
      description:
        "A tool to convert Minecraft structures from Java (.nbt) to Bedrock (.mcstructure). (1.19.70 support)",
      links: [{ url: "https://github.com/jaylydev/nbt-to-mcstructure/", text: "Download from GitHub" }],
      image: {
        src: "https://raw.githubusercontent.com/JaylyDev/nbt-to-mcstructure/main/assets/icon.png",
        alt: "Structure",
      },
      media: "https://github.com/JaylyDev/nbt-to-mcstructure/blob/main/assets/demo_video.gif?raw=true",
    },
    {
      title: "Introduction to Computer Hardware",
      description: "An introduction to computer hardware (CPU, RAM, etc). For computer nerds only I presume...",
      links: [{ url: "/introduction-to-computer-hardware/index.html", text: "Introduction to Computer Hardware" }],
      media: "/images/cpu.png",
    },
  ];

  const ProjectElements = projects.map((project, index) => (
    <div
      key={index}
      style={{ margin: "10px" }}
      className="max-w-[550px] rounded-lg border border-5d5f61 bg-[rgb(207,207,207)] dark:bg-[rgb(23,23,23)] p-4"
    >
      <ProjectCard key={index} {...project} />
    </div>
  ));

  return (
    <>
      <div className="flex min-h-fit flex-col items-center" id="projects">
        <a rel="apple-touch-icon" href="#projects">
          <h3 className="bg-red-500 inline-block text-gray7 px-6 py-4 text-6xl shadow-xl relative z-10 font-bold text-white">
            Projects
          </h3>
        </a>
      </div>
      <div className="flex min-h-0 flex-col items-center p-4">
        <h3 className="relative z-10 text-2xl font-bold dark:text-white">
          These are the projects that I{"'"}m currently working on!
        </h3>
        <br></br>
        <div
          style={{
            fontSize: "1.1rem",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 m-0 p-0">{ProjectElements}</div>
        </div>
      </div>
      <PreviewLatestYTVideo />
    </>
  );
}

function AboutMe() {
  const text = `Hi I'm Jayly, this is my website to post my stuff (aside from YouTube and MCPEDL).
                I mainly do Minecraft videos on YouTube, or making Minecraft add-ons for Bedrock,
                specifically scripting API related.`;
  return (
    <>
      <div className="flex min-h-fit flex-col items-center" id="about">
        <a rel="apple-touch-icon" href="#about">
          <h3 className="bg-red-500 inline-block text-gray7 px-6 py-4 text-6xl shadow-xl relative z-10 font-bold text-white">
            About Me
          </h3>
        </a>
      </div>
      <Padding size={48} />
      <div
        className="flex min-h-0 flex-col items-center p-4"
        style={{
          fontSize: "1.1rem",
        }}
      >
        <div>
          {text.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <h3 style={{ fontStyle: "italic" }}>
            If you have any questions, please feel free to contact me on Discord (jaylymc).
          </h3>
        </div>
      </div>
    </>
  );
}

function SiteHeader() {
  return (
    <div className="sticky top-0 z-30">
      <header
        data-test-id="storeHeader"
        className="RepresentHeader relative leading-none shadow transition-colors duration-150"
        style={{
          color: "#000000",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          data-test-id="storeHeader.mobileLayout"
          className="relative flex min-h-15 items-center justify-between py-1.5 px-6 md:hidden"
        >
          <Image src={"/favicon.ico"} alt={"Jayly Logo"} width={50} height={25}></Image>
        </div>
        <div
          data-test-id="storeHeader.desktopLayout"
          className="border-t md:border-0 hidden md:block py-5 px-6 md:py-3 md:px-8"
        >
          <div className="md:mt-0 md:flex md:items-center md:justify-between md:pt-0">
            <div
              aria-label="Logo"
              className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            ></div>
            <div className="hidden md:ml-4 md:block order-2">
              <a
                rel="apple-touch-icon"
                href="/"
                className="flex flex-none select-none items-center h-12 w-12"
                data-test-id="cartWidget"
              >
                <div className="relative m-auto inline-block">
                  <Image src={"/favicon.ico"} alt={"Jayly Logo"} width={150} height={50}></Image>
                  <div className="absolute right-0 top-0 -mr-2.5 -mt-1.5"></div>
                </div>
              </a>
            </div>
            {/* Subheadings */}
            <div className="md:ml-4 md:block order-3">
              <a href="#home" className="text-gray-600 hover:text-black text-lg mx-4">
                Home
              </a>
              <a href="#projects" className="text-gray-600 hover:text-black text-lg mx-4">
                Projects
              </a>
              <a href="#about" className="text-gray-600 hover:text-black text-lg mx-4">
                About Me
              </a>
              {/* Add more subheadings as needed */}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

function StatsCollection() {
  return (
    <div className="container">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-Q3X0X9VRB2" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-Q3X0X9VRB2');
        `}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2533146760921020"
        crossOrigin="anonymous"
      ></Script>
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex-shrink-0">
      <div className="container">
        <div className="flex flex-col items-center justify-between py-4">
          <p className="text-sm text-gray-500">&copy; JaylyMC {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main id="home">
      <StatsCollection />
      <SiteHeader />
      <div className="flex min-h-0 flex-col items-center bg-indigo-600 p-10">
        <h1 className="relative z-10 text-5xl font-bold text-white" style={{ fontFamily: "Minecraft Five v2" }}>
          Jayly
        </h1>
        <p className="relative z-10 text-2xl font-bold text-white">A website for Jayly</p>
      </div>
      {WebComponent()}
      <CurrentProjects />
      <div className="p-5" />
      <AboutMe />
      <div className="p-24" />
      <Footer />
    </main>
  );
}
