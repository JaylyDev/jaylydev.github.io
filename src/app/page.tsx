import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-yellow-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-yellow-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#fcfce4] after:dark:opacity-40 before:lg:h-[360px]">
        <h1 className="relative z-10 text-5xl font-bold text-white">Jayly</h1>
      </div>
      <h3 className="relative z-10 text-2xl font-bold text-white">I make stuff</h3>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-2 lg:text-left">
        <a
          href="https://youtube.com/@jaylymc"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={'youtube_icon.svg'} alt={'YouTube Icon'} width={100} height={100}></Image>
          <h2 className={`mb-3 text-2xl font-semibold`}>
            YouTube{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            @JaylyMC - Animating Minecraft
          </p>
        </a>

        <a
          href="https://mcpedl.com/user/jayly"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={'/mcpedl_logo_1024.png'} alt={'MCPEDL Icon'} width={70} height={70}></Image>
          <h2 className={`mb-3 text-2xl font-semibold`}>
            MCPEDL{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            @Jayly - Making Minecraft Add-Ons
          </p>
        </a>

        <a
          href="https://github.com/JaylyDev"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={'/github-mark-white.svg'} alt={'GitHub Icon'} width={70} height={70}></Image>
          <h2 className={`mb-3 text-2xl font-semibold`}>
            GitHub{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            @JaylyDev - Developing various software projects
          </p>
        </a>

        <a
          href="https://discord.gg/5m6GqM7vYN"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={'/discord_icon.svg'} alt={'Discord Icon'} width={90} height={70}></Image>
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Discord{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Contact me on Discord.
          </p>
        </a>
      </div>
    </main>
  );
}
