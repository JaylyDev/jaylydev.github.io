import React, { useEffect, useState } from "react";
import "@/styles/globals.css";
import "@/styles/manifest-generator.css";
import "highlight.js/styles/github-dark.css";
import { containerStyle, shadowStyle } from "@/app/components/Banner";
import { SiteFooter, SiteHeader, StatsCollection } from "@/app/components/SiteFormat";
import Head from "next/head";
import { CSSProperties } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import hljs from "highlight.js";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@nextui-org/button";

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

enum MinecraftPackType {
  BehaviorPack = "behavior_pack",
  ResourcePack = "resource_pack",
  SkinPack = "skin_pack",
  Addon = "addon",
}

enum MinecraftPackTypeText {
  BehaviorPack = "Behavior Pack",
  ResourcePack = "Resource Pack",
  SkinPack = "Skin Pack",
  Addon = "Add-On",
}

// Define action types
enum ActionType {
  ToggleModuleSemver = "TOGGLE_MODULE_SEMVER",
  ToggleHeaderSemver = "TOGGLE_HEADER_SEMVER",
  TogglePreview = "TOGGLE_PREVIEW",
}

// Define action interfaces
interface ModuleSemverEnabledAction {
  type: ActionType.ToggleModuleSemver;
}

interface HeaderSemverEnabledAction {
  type: ActionType.ToggleHeaderSemver;
}

interface PreviewEnabledAction {
  type: ActionType.TogglePreview;
}

// Define all possible action types
type Action = ModuleSemverEnabledAction | HeaderSemverEnabledAction | PreviewEnabledAction;

type Version = {
  major: number;
  minor: number;
  patch: number;
};

type VectorVersionOrString = string | [number, number, number];

// Reducer function to handle state changes
interface State {
  headerSemverEnabled: boolean;
  moduleSemverEnabled: boolean;
  isPreview: boolean;
}

interface MinecraftVersionMetadata {
  latest: Version;
  preview: Version;
}

interface VersionJSON {
  latest: { version: string };
}

interface VersionInputParam {
  defaultValue: number;
  keyName: string;
  label: string;
  min: number;
}

interface ManifestScriptModule {
  description: string;
  entry: string;
  uuid: string;
  type: "script";
  language: "javascript";
  version: VectorVersionOrString;
}

interface ManifestDataModule {
  description: string;
  uuid: string;
  type: "data";
  version: VectorVersionOrString;
}

type ManifestModule = ManifestScriptModule | ManifestDataModule;

const initialState: State = {
  headerSemverEnabled: false,
  moduleSemverEnabled: false,
  isPreview: false,
};

const versionStringParser = (versionString: string): Version => {
  const [major, minor, patch] = versionString.split(".").map((v) => parseInt(v));
  return { major, minor, patch };
};

function VectorVersionOrSemver({ useSemver }: { useSemver: boolean }) {
  if (useSemver) {
    return (
      <div className="row py-2">
        <Input key="min_engine_version" label="Version" />
      </div>
    );
  } else {
    return (
      <div className="row py-2 flex gap-3">
        <Input defaultValue={"0"} key="min_engine_version.major" type="number" min="0" step="1" label="Major" />
        <Input defaultValue={"1"} key="min_engine_version.minor" type="number" min="0" step="1" label="Minor" />
        <Input defaultValue={"0"} key="min_engine_version.patch" type="number" min="0" step="1" label="Patch" />
      </div>
    );
  }
}

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

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ToggleHeaderSemver:
      return { ...state, headerSemverEnabled: !state.headerSemverEnabled };
    case ActionType.ToggleModuleSemver:
      return { ...state, moduleSemverEnabled: !state.moduleSemverEnabled };
    case ActionType.TogglePreview:
      return { ...state, isPreview: !state.isPreview };
    default:
      return state;
  }
};

function VersionInput(params: VersionInputParam) {
  return (
    <Input
      defaultValue={params.defaultValue.toString()}
      key={params.keyName}
      type="number"
      min={params.min}
      step="1"
      label={params.label}
    />
  );
}

interface MinecraftEngineVersionParam {
  isPreview: boolean;
  data: MinecraftVersionMetadata;
  minEngineVersion: Version;
}

interface PackProps {
  packTypeText: MinecraftPackTypeText;
  state: State;
  dispatch: React.Dispatch<Action>;
}

function MinecraftEngineVersion(param: MinecraftEngineVersionParam) {
  const version = param.isPreview ? param.data.preview : param.data.latest;
  const MajorVersionInput = () => (
    <VersionInput
      keyName="min_engine_version.major"
      defaultValue={version.major}
      label={"Major"}
      min={param.minEngineVersion.major}
    />
  );
  const MinorVersionInput = () => (
    <VersionInput
      keyName="min_engine_version.minor"
      defaultValue={version.minor}
      label={"Minor"}
      min={param.minEngineVersion.minor}
    />
  );
  const PatchVersionInput = () => (
    <VersionInput
      keyName="min_engine_version.patch"
      defaultValue={version.patch}
      label={"Patch"}
      min={param.minEngineVersion.patch}
    />
  );
  return (
    <div className="row py-2 flex gap-3">
      <MajorVersionInput />
      <MinorVersionInput />
      <PatchVersionInput />
    </div>
  );
}

const PackHeader = (props: PackProps) => {
  const headerUUID = uuidv4();
  const minEngineVersion: Version = { major: 1, minor: 13, patch: 0 };
  const setHeaderSemver = () => {
    props.dispatch({ type: ActionType.ToggleHeaderSemver });
  };
  const setPreviewEnabled = () => {
    props.dispatch({ type: ActionType.TogglePreview });
  };
  const [data, setData] = useState<MinecraftVersionMetadata>({
    latest: minEngineVersion,
    preview: minEngineVersion,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestResponse = await fetch(
          "https://raw.githubusercontent.com/Mojang/bedrock-samples/main/version.json"
        );
        const previewResponse = await fetch(
          "https://raw.githubusercontent.com/Mojang/bedrock-samples/preview/version.json"
        );
        const mainJsonData: VersionJSON = await latestResponse.json();
        const previewJsonData: VersionJSON = await previewResponse.json();
        const latestVersionString = mainJsonData.latest.version;
        const previewVersionString = previewJsonData.latest.version;
        setData({
          latest: versionStringParser(latestVersionString),
          preview: versionStringParser(previewVersionString),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {props.packTypeText} name:
      <Input className="py-2" key="name" label="Name" />
      {props.packTypeText} description:
      <Input className="py-2" key="description" label="Description" />
      {props.packTypeText} UUID:
      <Input isReadOnly className="py-2" key="uuid" label="UUID" defaultValue={headerUUID} />
      {props.packTypeText} Version:
      <div className="py-1" />
      <Switch isSelected={props.state.headerSemverEnabled} onValueChange={setHeaderSemver}>
        Use{" "}
        <a href="https://semver.org/" target="_blank" className="hyperlink">
          SemVer
        </a>{" "}
        (Experimental)
      </Switch>
      <VectorVersionOrSemver useSemver={props.state.headerSemverEnabled} />
      Minimum Engine Version:
      <div className="py-1" />
      <Switch isSelected={props.state.isPreview} onValueChange={setPreviewEnabled}>
        Use Preview
      </Switch>
      <MinecraftEngineVersion isPreview={props.state.isPreview} minEngineVersion={minEngineVersion} data={data} />
    </div>
  );
};

const PackModule = (props: PackProps) => {
  const manifestModules: ManifestModule[] = [
    {
      description: "",
      type: "data",
      uuid: uuidv4(),
      version: [1, 0, 0],
    },
  ];
  const moduleDescriptionOnChange = (index: number, value: string) => {
    manifestModules[index].description = value;
  };
  return (
    <div>
      {manifestModules.map((moduleMeta, index) => (
        <div key={index}>
          <h2 className="text-3xl font-bold">
            {index + 1}. {manifestModules[index].type} module:
          </h2>
          Module description:
          <Input
            className="py-2"
            key="description"
            label="Description"
            onChange={(e) => moduleDescriptionOnChange(index, e.target.value)}
          />
          Module UUID:
          <Input isReadOnly className="py-2" key="uuid" label="UUID" defaultValue={moduleMeta.uuid} />
        </div>
      ))}
    </div>
  );
};

const ManifestJSONGenerator = (props: PackProps) => {
  // Display code block
  const snippetField = JSON.stringify(
    {
      format_version: 2,
      header: {
        name: "My ${props.packTypeText} Name",
        description: "My ${props.packTypeText} Description",
        uuid: "${uuidv4()}",
        version: [1, 0, 0],
        min_engine_version: [1, 20, 80],
      },
      modules: [
        {
          description: "My ${props.packTypeText} Description",
          type: "resources",
          uuid: "${uuidv4()}",
          version: [1, 0, 0],
        },
      ],
    },
    null,
    4
  );
  const highlightedCode = hljs.highlightAuto(snippetField, ["json"]);

  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlightedCode.value }} />
    </pre>
  );
};

function ManifestGenerator() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div className="content-body flex w-full flex-col dark">
      <Tabs aria-label="Options" color="primary">
        <Tab key={MinecraftPackType.BehaviorPack} title="Behavior Pack">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold">Manifest Header</h2>
              <PackHeader packTypeText={MinecraftPackTypeText.BehaviorPack} state={state} dispatch={dispatch} />
            </CardBody>
            <CardBody>
              <h2 className="text-2xl font-bold">Manifest Modules</h2>
              <PackModule packTypeText={MinecraftPackTypeText.BehaviorPack} state={state} dispatch={dispatch} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key={MinecraftPackType.ResourcePack} title="Resource Pack">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur.
            </CardBody>
          </Card>
        </Tab>
        <Tab key={MinecraftPackType.SkinPack} title="Skin Pack">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </CardBody>
          </Card>
        </Tab>
        <Tab key={MinecraftPackType.Addon} title="Add-On">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <Card>
        <CardBody>
          <h2 className="text-2xl font-bold">Manifest Code</h2>
          <ManifestJSONGenerator packTypeText={MinecraftPackTypeText.BehaviorPack} state={state} dispatch={dispatch} />
        </CardBody>
        <Button color="success" onPress={() => alert("e")} style={{ position: "absolute", top: 10, right: 10 }}>
          Copy Code
        </Button>
      </Card>
    </div>
  );
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
      <StatsCollection />
      <SiteHeader />
      <PageBanner />
      <ManifestGenerator />
      <SiteFooter />
    </>
  );
};

export default Page;
