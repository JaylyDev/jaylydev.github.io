// components/Card.tsx
import React from "react";
import { Image } from "@nextui-org/react";

interface CardProps {
  title: string;
  description: string;
  links: { text: string; url: string }[];
  image?: { src: string; alt: string };
  media?: string;
}

const Card: React.FC<CardProps> = ({ title, description, links, image, media }) => {
  return (
    <>
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
      <div className="border-b border-5d5f61 mb-2"></div>
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
      <p className="mb-2">
        {description.split("\n").map((line) => (
          <>
            {line}
            <br></br>
          </>
        ))}
      </p>
      <div className="border-b border-5d5f61 mb-2"></div>
      <ul className="list-disc list-inside">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Card;
