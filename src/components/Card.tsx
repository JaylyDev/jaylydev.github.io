import React from "react";
import { Image, Link } from "@heroui/react";

interface CardProps {
  title: string;
  description: string;
  links: { text: string; url: string }[];
  image?: { src: string; alt: string };
  media?: string;
}

const Card: React.FC<CardProps> = ({ title, description, links, image, media }) => {
  return (
    <div className="max-w-[550px] rounded-lg border border-black dark:border-white dark:bg-[rgb(23,23,23)] p-4 m-2.5">
      <div className="p-1 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large flex gap-3">
        {image && (
          <div className="relative shadow-black/5 shadow-none rounded-small" style={{ maxWidth: 40 }}>
            {image && <Image src={image.src} alt={image.alt} height={40} width={40} data-loaded={true}></Image>}
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
        </div>
      </div>
      <div className="border-b border-black dark:border-white mb-2"></div>
      {media && (
        <div className="flex justify-center items-center">
          <Image
            src={media}
            alt="media"
            style={{
              maxHeight: "150px",
              maxWidth: "auto",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )}
      {description.split("\n").map((line, index, array) => (
        <span key={index}>
          {line.startsWith(">") ? <blockquote>{line.substring(2)}</blockquote> : line}
          {/* check if last line */}
          {index === array.length - 1 ? null : <br />}
        </span>
      ))}
      <div className="border-b border-black dark:border-white mb-2"></div>
      <ul className="list-disc list-inside">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.url} target={link.url.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer">
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Card;
