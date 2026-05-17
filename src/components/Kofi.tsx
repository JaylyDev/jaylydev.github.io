import { Image } from "@heroui/react";

interface KofiWidgetProps {
  donationText: string;
  supportText: string;
  lang?: string;
}

export function KofiWidget({ donationText, supportText, lang }: KofiWidgetProps) {
  // Due to the Global nature of stylesheets, we must use inline styles here.
  // Read more: https://nextjs.org/docs/messages/css-global
  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#00b4f7",
    borderRadius: "100px",
    height: "46px",
    display: "flex",
    alignItems: "center",
    fontFamily: '"DM Sans", sans-serif',
    fontVariantLigatures: "no-common-ligatures",
    fontSize: "16px",
    width: "max-content",
    color: "#fff",
    justifyContent: "space-between",
    padding: "0 20px",
    fontWeight: "var(--weight-m)",
    cursor: "pointer",
  };

  const imgStyle: React.CSSProperties = {
    width: "39px",
    overflowClipMargin: "content-box",
    overflow: "clip",
  };

  const textStyle: React.CSSProperties = {
    marginLeft: "8px",
    color: "#fff",
  };

  const localePrefix = lang && lang !== "en" ? `/${lang}` : "";

  return (
    // Entire widget is a link — clicking anywhere navigates to Ko-fi
    <div className="flex justify-center m-12">
      <a
        href={`${localePrefix}/donate/`}
        className="
        group relative flex flex-col items-center gap-3 text-center no-underline
        rounded-2xl border-2 border-dashed border-blue-500
        px-8 py-7 min-w-[300px] max-w-[480px] mx-auto cursor-pointer
        transition-all duration-300 ease-in-out
        hover:border-solid hover:border-blue-400
        hover:bg-[rgba(0,200,255,0.08)]
        hover:shadow-[0_0_0_4px_rgba(59,130,246,0.15),0_0_32px_rgba(0,200,255,0.2),inset_0_0_40px_rgba(0,200,255,0.05)]
        hover:scale-[1.03] 
      "
      >
        {/* Title */}
        <p className="flex items-center gap-2 text-xl font-semibold m-0 text-black dark:text-white">
          <svg
            className="w-5 h-5 text-blue-400 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          {donationText}
        </p>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground m-0 max-w-xs leading-relaxed text-black dark:text-white">
          {supportText}
        </p>

        {/* Ko-fi button — pointer-events disabled since the parent <a> handles navigation */}
        <span
          title="Support me on ko-fi.com"
          className="kofi-button hover:opacity-85 hover:text-[#f5f5f5] hover:no-underline active:text-[#f5f5f5] active:no-underline transition-opacity flex items-center justify-center gap-2 pointer-events-none"
          style={buttonStyle}
        >
          <span className="kofitext flex items-center justify-center">
            <Image src="https://storage.ko-fi.com/cdn/logomarkLogo.png" alt="Ko-fi donations" style={imgStyle} />
            <span style={textStyle}>{donationText}</span>
          </span>
        </span>
      </a>
    </div>
  );
}
