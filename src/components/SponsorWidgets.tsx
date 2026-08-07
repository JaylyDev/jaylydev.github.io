import { useState } from "react";

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface SponsorWidgetProps {
  donationText: string;
  supportText: string;
  buttonColor: string;
  borderColor: string;
  hoverBackgroundColor: RGBColor;
  buttonTextColor: string;
  href: string;
  backgroundImage?: string;
  buttonLabel?: string;
  className?: string;
  hashTags?: string[];
}

export function SponsorWidget({
  donationText,
  supportText,
  buttonColor,
  borderColor,
  hoverBackgroundColor,
  buttonTextColor,
  backgroundImage,
  href,
  buttonLabel,
  hashTags,
  className,
}: SponsorWidgetProps) {
  const [isHovered, setIsHovered] = useState(false);

  const rgbString = `${hoverBackgroundColor.r},${hoverBackgroundColor.g},${hoverBackgroundColor.b}`;

  // Due to the Global nature of stylesheets, we must use inline styles here.
  // Read more: https://nextjs.org/docs/messages/css-global
  const containerStyle: React.CSSProperties = {
    // Colors support hex, rgb, named, etc.
    borderColor: borderColor,
    borderStyle: isHovered ? "solid" : "dashed",
    backgroundColor: isHovered ? `rgba(${rgbString},0.08)` : "transparent",
    boxShadow: isHovered
      ? `0 0 0 4px rgba(${rgbString},0.15), 0 0 32px rgba(${rgbString},0.2), inset 0 0 40px rgba(${rgbString},0.05)`
      : "none",
    transform: isHovered ? "scale(1.03)" : "scale(1)",
    transition: "all 300ms ease-in-out",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonColor,
    borderRadius: "50px",
    height: "35px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"DM Sans", sans-serif',
    fontVariantLigatures: "no-common-ligatures",
    fontSize: "16px",
    color: buttonTextColor,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className={
        "grid relative rounded-2xl border-2 cursor-pointer overflow-hidden" +
        (backgroundImage ? " min-[435px]:grid-cols-[auto_1fr]" : " px-3 py-2 min-w-[300px]") +
        (className ? ` ${className}` : "")
      }
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {backgroundImage && (
        <div>
          <img
            src={backgroundImage}
            alt=""
            className="min-[435px]:h-32 object-cover aspect-video rounded-xl mt-2 mb-1 px-1"
          />
          {hashTags && hashTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 px-3 text-sm text-blue-500">
              {hashTags.map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
      <a href={href} target="_blank" className="absolute inset-0 rounded-2xl z-0" aria-label={donationText} />
      <div
        className={"pointer-events-none flex flex-col gap-1" + (backgroundImage ? " mx-3 min-[435px]:mx-1 py-2" : "")}
      >
        <p className="text-xl font-semibold text-black dark:text-white">{donationText}</p>
        <p className="text-sm text-black/70 dark:text-white/70 grow">{supportText}</p>
        <span style={buttonStyle}>{buttonLabel ?? donationText}</span>
      </div>
    </div>
  );
}

interface SponsorSectionProps {
  t: (key: string) => string;
  lang?: string;
  paddingSize?: string;
}

export function SponsorSection({ t, lang, paddingSize }: SponsorSectionProps) {
  const localePrefix = lang && lang !== "en" ? `/${lang}` : "";
  const sectionStyle: React.CSSProperties = {
    padding: paddingSize || `1.5rem`,
  };

  return (
    <section className={`flex flex-col items-center w-full`} style={sectionStyle}>
      <div className="flex flex-col min-[800px]:flex-row gap-5">
        <SponsorWidget
          donationText={t("donation.kofi.title")}
          supportText={t("donation.kofi.description")}
          buttonColor="#00b4f7"
          borderColor="#00b4f7"
          href={`${localePrefix}/donate/`}
          hoverBackgroundColor={{ r: 0, g: 200, b: 255 }}
          buttonTextColor="#fff"
          className="min-[800px]:w-[230px]"
        />
      </div>
    </section>
  );
}
