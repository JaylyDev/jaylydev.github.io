import React from "react";
import "@/styles/globals.css";
import { containerStyle, shadowStyle } from "@/app/components/Banner";
import { SiteFooter, SiteHeader, StatsCollection } from "@/app/components/SiteFormat";
import Head from "next/head";
import { CSSProperties } from "react";

const title = "Manifest Generator";
const description =
  "Quickly and easily generate a manifest.json file for Minecraft: Bedrock Edition resource packs or behavior packs.";

const pageStyle: CSSProperties = {
  display: "flex",
  minHeight: "200px",
  flexDirection: "column",
  placeItems: "center",
  padding: "1.25rem",
  textShadow: "5px 5px 30px black",
};

function PageBanner() {
  return (
    <div style={Object.assign({}, containerStyle, pageStyle)}>
      <h1 className="text-5xl font-bold text-white" style={{ fontFamily: "Minecraft Five v2" }}>
        Jayly
      </h1>
      <p className="text-2xl font-bold text-gray-400">Manifest Generator For Minecraft Bedrock Edition</p>
      <div style={shadowStyle}></div>
    </div>
  );
}

function SelectPackType() {
  // Make a select form
  return <></>;
}

const Page: React.FC = () => {
  return (
    <>
      <Head>
        <title>{title + " | JaylyMC"}</title>
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div>
        <StatsCollection />
        <SiteHeader />
        <PageBanner />
        <SelectPackType />
        <SiteFooter />
      </div>
    </>
  );
};

export default Page;
