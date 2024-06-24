import React from "react";
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
    default:
      return state;
  }
};

// Define action types
enum ActionType {
  ToggleModuleSemver = "TOGGLE_MODULE_SEMVER",
  ToggleHeaderSemver = "TOGGLE_HEADER_SEMVER",
}

// Define action interfaces
interface ModuleSemverEnabledAction {
  type: ActionType.ToggleModuleSemver;
}

interface HeaderSemverEnabledAction {
  type: ActionType.ToggleHeaderSemver;
}

// Define all possible action types
type Action = ModuleSemverEnabledAction | HeaderSemverEnabledAction;

// Reducer function to handle state changes
interface State {
  headerSemverEnabled: boolean;
  moduleSemverEnabled: boolean;
}

const initialState: State = {
  headerSemverEnabled: false,
  moduleSemverEnabled: false,
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
        <Input defaultValue={"1"} key="min_engine_version.major" type="number" min="0" step="1" label="Major" />
        <Input defaultValue={"0"} key="min_engine_version.minor" type="number" min="0" step="1" label="Minor" />
        <Input defaultValue={"0"} key="min_engine_version.patch" type="number" min="0" step="1" label="Patch" />
      </div>
    );
  }
}

interface PackProps {
  packTypeText: MinecraftPackTypeText;
  state: State;
  dispatch: React.Dispatch<Action>;
}

const PackHeader = (props: PackProps) => {
  const headerUUID = uuidv4();
  const setHeaderSemver = () => {
    props.dispatch({ type: ActionType.ToggleHeaderSemver });
  };

  return (
    <div>
      {props.packTypeText} name:
      <Input className="py-2" key="name" label="Name" />
      {props.packTypeText} description:
      <Input className="py-2" key="description" label="Description" />
      {props.packTypeText} UUID:
      <Input isReadOnly className="py-2" key="uuid" label="UUID" defaultValue={headerUUID} />
      {props.packTypeText} Version:
      <div className="py-2" />
      <Switch isSelected={props.state.headerSemverEnabled} onValueChange={setHeaderSemver}>
        Use{" "}
        <a href="https://semver.org/" target="_blank" className="hyperlink">
          SemVer
        </a>{" "}
        (Beta)
      </Switch>
      <VectorVersionOrSemver useSemver={props.state.headerSemverEnabled} />
      Minimum Engine Version:
      <div className="row py-2 flex gap-3">
        <Input defaultValue={"1"} key="min_engine_version.major" type="number" isReadOnly label="Major" />
        <Input defaultValue={"20"} key="min_engine_version.minor" type="number" min="0" step="1" label="Minor" />
        <Input defaultValue={"80"} key="min_engine_version.patch" type="number" min="0" step="10" label="Patch" />
      </div>
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
              <PackHeader packTypeText={MinecraftPackTypeText.BehaviorPack} state={state} dispatch={dispatch} />
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
