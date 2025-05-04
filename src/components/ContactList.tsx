import { Link, Image } from "@heroui/react";

interface IContentGridParam {
  href: string;
  src: string;
  alt: string;
  size: number;
  title: string;
  children: string;
}

function ContentGrid(params: IContentGridParam) {
  return (
    <Link
      href={params.href}
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image src={params.src} alt={params.alt} width={params.size} height={params.size}></Image>
      <h2 className="mb-3 text-2xl font-semibold text-white">
        {params.title + " "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{params.children}</p>
    </Link>
  );
}

export default function ContactList() {
  return (
    <div className="mb-32 grid pb-48 text-left md:mb-0 md:grid-cols-2 md:p-0">
      <ContentGrid
        href="https://youtube.com/@jaylymc"
        src="/assets/youtube_icon.svg"
        alt="YouTube Icon"
        size={100}
        title="YouTube"
      >
        @JaylyMC - Animating Minecraft
      </ContentGrid>
      <ContentGrid
        href="https://mcpedl.com/user/jayly"
        src="/assets/mcpedl_logo_1024.png"
        alt="MCPEDL Icon"
        size={70}
        title="MCPEDL"
      >
        @Jayly - Making Minecraft Add-Ons
      </ContentGrid>
      <ContentGrid
        href="https://github.com/JaylyDev"
        src="/assets/github-mark-white.svg"
        alt="GitHub Icon"
        size={70}
        title="GitHub"
      >
        @JaylyDev - Developing various software projects
      </ContentGrid>
      <ContentGrid
        href="https://discord.gg/5m6GqM7vYN"
        src="/assets/discord_icon.svg"
        alt="Discord Icon"
        size={90}
        title="Discord"
      >
        My Discord server if you want to talk
      </ContentGrid>
    </div>
  );
}
