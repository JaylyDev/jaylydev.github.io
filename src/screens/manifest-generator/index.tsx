import Head from "next/head";
import { StatsCollection, SiteFooter, SiteHeader } from "@/components/SiteFormat";
import { useState, useEffect, useCallback, JSX } from "react";
import { Button, HeroUIProvider, Switch, Card, CardBody, CardHeader, Divider, Chip } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { createTranslateFunction, LocaleProps, TranslateFunction } from "@/locale/i18n";
import { v4 as uuidv4 } from "uuid";
import { InArticleAdUnit } from "@/components/AdUnit";
import prettier from "prettier";
import estree from "prettier/plugins/estree";
import babel from "prettier/plugins/babel";

interface VersionTuple {
  major: number;
  minor: number;
  patch: number;
}

interface VersionField {
  value: VersionTuple;
  format: "array" | "string";
  rawString?: string;
}

interface ModuleEntry {
  id: string;
  type: "resources" | "data" | "script" | "world_template" | "skin_pack";
  uuid: string;
  version: VersionField;
  description: string;
  entry: string;
  language: string;
}

interface PackDependency {
  id: string;
  uuid: string;
  version: VersionField;
}

interface ScriptApiDep {
  moduleName: string;
  version: string;
}

interface SubpackEntry {
  id: string;
  folderName: string;
  name: string;
  memoryTier: number;
}

type SettingType = "label" | "slider" | "toggle" | "dropdown";

interface DropdownOption {
  name: string;
  text: string;
}

interface SettingEntry {
  id: string;
  type: SettingType;
  name: string;
  text: string;
  defaultBool: boolean;
  defaultNum: number;
  defaultStr: string;
  min: number;
  max: number;
  step: number;
  options: DropdownOption[];
}

interface MetadataState {
  authors: string;
  license: string;
  url: string;
  productType: "" | "addon";
}

interface PackFormState {
  headerName: string;
  headerDescription: string;
  headerUuid: string;
  headerVersion: VersionField;
  minEngineVersion: VersionField;
  baseGameVersion: VersionField | null;
  allowRandomSeed: boolean;
  lockTemplateOptions: boolean;
  packScope: "" | "global" | "world" | "any";
  modules: ModuleEntry[];
  capabilities: string[];
  dependencies: PackDependency[];
  scriptApiDeps: ScriptApiDep[];
  subpacks: SubpackEntry[];
  settings: SettingEntry[];
  metadata: MetadataState;
}

interface ScriptModule {
  name: string;
  version: string;
  type: "native" | "library";
}

interface ScriptModulesData {
  latest_release_version: string;
  latest_preview_version: string;
  release_modules: ScriptModule[];
  preview_modules: ScriptModule[];
}

type PackKind = "behavior" | "resource" | "world_template" | "skin_pack";
type PackType = "behavior" | "resource" | "addons" | "world_template" | "skin_pack";

interface ManifestHeader {
  name: string;
  description: string;
  uuid: string;
  version: SemVersionValue;
  min_engine_version: number[] | string;
  base_game_version?: number[] | string;
  allow_random_seed?: boolean;
  lock_template_options?: boolean;
  pack_scope?: string;
}

interface ManifestModule {
  type: ModuleEntry["type"];
  uuid: string;
  version: SemVersionValue;
  description?: string;
  language?: string;
  entry?: string;
}

interface ManifestDependency {
  uuid?: string;
  module_name?: string;
  version: SemVersionValue;
}

interface ManifestSubpack {
  folder_name: string;
  name: string;
  memory_tier?: number;
  memory_performance_tier?: number;
}

interface ManifestSetting {
  type: SettingType;
  text: string;
  name?: string;
  default?: boolean | number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: DropdownOption[];
}

interface ManifestMetadata {
  authors?: string[];
  license?: string;
  url?: string;
  product_type?: string;
  generated_with?: {
    jaylydev_manifest_generator: string[];
  };
}

type SemVersionValue = number[] | string;

interface MinecraftManifest {
  format_version: number;
  header: ManifestHeader;
  modules: ManifestModule[];
  dependencies?: ManifestDependency[];
  capabilities?: string[];
  subpacks?: ManifestSubpack[];
  settings?: ManifestSetting[];
  metadata?: ManifestMetadata;
}

interface Capability {
  key: string;
  label: string;
  requiresScript: boolean;
  disabledNote?: string;
}

const BP_CAPABILITIES: Capability[] = [
  { key: "chemistry", label: "Chemistry", requiresScript: false },
  { key: "editorExtension", label: "Editor Extension", requiresScript: false },
  {
    key: "script_eval",
    label: "Script Eval",
    requiresScript: true,
    disabledNote: "requires script module, add a 'script' module in the 'modules' section above",
  },
];

const RP_CAPABILITIES: Capability[] = [
  { key: "chemistry", label: "Chemistry", requiresScript: false },
  { key: "editorExtension", label: "Editor Extension", requiresScript: false },
  { key: "raytraced", label: "Raytraced", requiresScript: false },
  { key: "pbr", label: "PBR", requiresScript: false },
];

const BP_MODULE_TYPES = ["data", "script"] as const;
const RP_MODULE_TYPES = ["resources"] as const;
const WT_MODULE_TYPES = ["world_template"] as const;
const SP_MODULE_TYPES = ["skin_pack"] as const;

function createDefaultVersion(): VersionField {
  return { value: { major: 1, minor: 0, patch: 0 }, format: "array" };
}

function createDefaultMinEngineVersion(): VersionField {
  return { value: { major: 1, minor: 26, patch: 0 }, format: "array" };
}

function createDefaultModule(type: string): ModuleEntry {
  return {
    id: uuidv4(),
    type: type as ModuleEntry["type"],
    uuid: uuidv4(),
    version: createDefaultVersion(),
    description: "",
    entry: type === "script" ? "scripts/main.js" : "",
    language: type === "script" ? "javascript" : "",
  };
}

function createDefaultBPState(t: TranslateFunction): PackFormState {
  return {
    headerName: t("fields.name.defaultValue.behavior"),
    headerDescription: t("fields.description.defaultValue.behavior"),
    headerUuid: uuidv4(),
    headerVersion: createDefaultVersion(),
    minEngineVersion: createDefaultMinEngineVersion(),
    baseGameVersion: null,
    allowRandomSeed: false,
    lockTemplateOptions: false,
    packScope: "",
    modules: [createDefaultModule("data")],
    capabilities: [],
    dependencies: [],
    scriptApiDeps: [],
    subpacks: [],
    settings: [],
    metadata: { authors: "", license: "", url: "", productType: "" },
  };
}

function createDefaultRPState(t: TranslateFunction): PackFormState {
  return {
    headerName: t("fields.name.defaultValue.resource"),
    headerDescription: t("fields.description.defaultValue.resource"),
    headerUuid: uuidv4(),
    headerVersion: createDefaultVersion(),
    minEngineVersion: createDefaultMinEngineVersion(),
    baseGameVersion: null,
    allowRandomSeed: false,
    lockTemplateOptions: false,
    packScope: "",
    modules: [createDefaultModule("resources")],
    capabilities: [],
    dependencies: [],
    scriptApiDeps: [],
    subpacks: [],
    settings: [],
    metadata: { authors: "", license: "", url: "", productType: "" },
  };
}

function createDefaultWorldTemplateState(t: TranslateFunction): PackFormState {
  return {
    headerName: t("fields.name.defaultValue.world_template"),
    headerDescription: t("fields.description.defaultValue.world_template"),
    headerUuid: uuidv4(),
    headerVersion: createDefaultVersion(),
    minEngineVersion: createDefaultMinEngineVersion(),
    baseGameVersion: { value: { major: 1, minor: 13, patch: 0 }, format: "array" },
    allowRandomSeed: false,
    lockTemplateOptions: true,
    packScope: "",
    modules: [createDefaultModule("world_template")],
    capabilities: [],
    dependencies: [],
    scriptApiDeps: [],
    subpacks: [],
    settings: [],
    metadata: { authors: "", license: "", url: "", productType: "" },
  };
}

function createDefaultSkinPackState(t: TranslateFunction): PackFormState {
  return {
    headerName: t("fields.name.defaultValue.skin_pack"),
    headerDescription: t("fields.description.defaultValue.skin_pack"),
    headerUuid: uuidv4(),
    headerVersion: createDefaultVersion(),
    minEngineVersion: createDefaultMinEngineVersion(),
    baseGameVersion: null,
    allowRandomSeed: false,
    lockTemplateOptions: false,
    packScope: "",
    modules: [createDefaultModule("skin_pack")],
    capabilities: [],
    dependencies: [],
    scriptApiDeps: [],
    subpacks: [],
    settings: [],
    metadata: { authors: "", license: "", url: "", productType: "" },
  };
}

function serializeVersion(field: VersionField): SemVersionValue {
  const { value, format, rawString } = field;
  if (format === "string") {
    return rawString !== undefined ? rawString : `${value.major}.${value.minor}.${value.patch}`;
  }
  return [value.major, value.minor, value.patch];
}

function serializeVersionAsString(field: VersionField): string {
  const { value, format, rawString } = field;
  if (format === "string" && rawString !== undefined) {
    return rawString;
  }
  return `${value.major}.${value.minor}.${value.patch}`;
}

function serializeVersionField(field: VersionField, fmtVersion: 2 | 3): SemVersionValue {
  return fmtVersion === 3 ? serializeVersionAsString(field) : serializeVersion(field);
}

function generateManifestJSON(
  state: PackFormState,
  fmtVersion: 2 | 3,
  otherPack?: PackFormState,
  isAddons?: boolean,
): MinecraftManifest {
  const header: ManifestHeader = {
    name: state.headerName,
    description: state.headerDescription,
    uuid: state.headerUuid,
    version: serializeVersionField(state.headerVersion, fmtVersion),
    min_engine_version: serializeVersionField(state.minEngineVersion, fmtVersion),
  };

  if (state.baseGameVersion) {
    header.base_game_version = serializeVersionField(state.baseGameVersion, fmtVersion);
  }
  if (state.allowRandomSeed) {
    header.allow_random_seed = true;
  }
  if (state.lockTemplateOptions) {
    header.lock_template_options = true;
  }
  if (state.packScope) {
    header.pack_scope = state.packScope;
  }

  const modules: ManifestModule[] = state.modules.map((m) => {
    const mod: ManifestModule = {
      type: m.type,
      uuid: m.uuid,
      version: serializeVersionField(m.version, fmtVersion),
    };
    if (m.description) mod.description = m.description;
    if (m.type === "script") {
      mod.language = "javascript";
      if (m.entry) mod.entry = m.entry;
    }
    return mod;
  });

  const manifest: MinecraftManifest = {
    format_version: fmtVersion,
    header,
    modules,
  };

  // Dependencies
  const deps: ManifestDependency[] = [];

  // Pack dependencies (uuid-based)
  for (const dep of state.dependencies) {
    deps.push({ uuid: dep.uuid, version: serializeVersionField(dep.version, fmtVersion) });
  }

  // Script API dependencies (module_name-based)
  for (const scriptDep of state.scriptApiDeps) {
    deps.push({ module_name: scriptDep.moduleName, version: scriptDep.version });
  }

  // Cross-pack dependency in Add-Ons mode
  if (isAddons && otherPack) {
    deps.push({
      uuid: otherPack.headerUuid,
      version: serializeVersionField(otherPack.headerVersion, fmtVersion),
    });
  }

  if (deps.length > 0) {
    manifest.dependencies = deps;
  }

  // Capabilities
  if (state.capabilities.length > 0) {
    manifest.capabilities = [...state.capabilities];
  }

  // Subpacks
  if (state.subpacks.length > 0) {
    manifest.subpacks = state.subpacks.map((s) => {
      const sp: ManifestSubpack = { folder_name: s.folderName, name: s.name };
      if (fmtVersion === 3) {
        sp.memory_performance_tier = Math.max(1, Math.min(5, s.memoryTier));
      } else {
        sp.memory_tier = Math.max(0, s.memoryTier);
      }
      return sp;
    });
  }

  // Settings (V3 only)
  if (fmtVersion === 3 && state.settings.length > 0) {
    manifest.settings = state.settings.map((s) => {
      const setting: ManifestSetting = { type: s.type, text: s.text };

      if (s.type !== "label") {
        setting.name = s.name;
      }

      if (s.type === "slider") {
        setting.default = s.defaultNum;
        setting.min = s.min;
        setting.max = s.max;
        setting.step = s.step;
      } else if (s.type === "toggle") {
        setting.default = s.defaultBool;
      } else if (s.type === "dropdown") {
        setting.default = s.defaultStr;
        setting.options = s.options;
      }

      return setting;
    });
  }

  // Metadata
  const meta: ManifestMetadata = {};
  if (state.metadata.authors) {
    meta.authors = state.metadata.authors
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
  }
  if (state.metadata.license) meta.license = state.metadata.license;
  if (state.metadata.url) meta.url = state.metadata.url;
  if (state.metadata.productType) meta.product_type = state.metadata.productType;
  meta.generated_with = { jaylydev_manifest_generator: ["1.0.0"] };
  manifest.metadata = meta;

  return manifest;
}

interface VersionInputProps {
  label: string;
  field: VersionField;
  onChange: (field: VersionField) => void;
  t: TranslateFunction;
  formatVersion?: 2 | 3;
  forceString?: boolean;
}

const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/;

function VersionInput({
  label,
  field,
  onChange,
  t,
  formatVersion = 2,
  forceString = false,
}: VersionInputProps): JSX.Element {
  const updatePart = (part: keyof VersionTuple, raw: string) => {
    const val = parseInt(raw) || 0;
    onChange({ ...field, value: { ...field.value, [part]: Math.max(0, val) } });
  };

  const handleStringChange = (val: string) => {
    const nextField: VersionField = {
      ...field,
      format: forceString ? "string" : field.format,
      rawString: val,
    };
    const match = val.match(/^(\d+)\.(\d+)\.(\d+)(?:-([^+]+))?(?:\+(.+))?$/);
    if (match) {
      nextField.value = {
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3]),
      };
    }
    onChange(nextField);
  };

  const handleFormatChange = (isString: boolean) => {
    const format = isString ? "string" : "array";
    const nextField: VersionField = {
      ...field,
      format,
    };
    if (format === "string" && field.rawString === undefined) {
      nextField.rawString = `${field.value.major}.${field.value.minor}.${field.value.patch}`;
    }
    onChange(nextField);
  };

  const isString = forceString || field.format === "string";
  const displayVal =
    field.rawString !== undefined ? field.rawString : `${field.value.major}.${field.value.minor}.${field.value.patch}`;
  const isValid = !isString || SEMVER_REGEX.test(displayVal);

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="flex items-center gap-1.5 flex-wrap">
        {isString ? (
          <input
            type="text"
            value={displayVal}
            onChange={(e) => handleStringChange(e.target.value)}
            className={`w-36 sm:w-48 px-2.5 py-1.5 border rounded-lg text-sm dark:bg-gray-800 dark:text-white outline-none focus:ring-2 ${
              isValid
                ? "border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                : "border-red-500 focus:ring-red-500 focus:border-red-500"
            }`}
            placeholder="1.0.0"
          />
        ) : (
          <>
            <input
              type="number"
              min={0}
              value={field.value.major}
              onChange={(e) => updatePart("major", e.target.value)}
              className="w-16 px-2 py-1.5 border rounded-lg text-sm text-center dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <span className="text-gray-500 font-bold">.</span>
            <input
              type="number"
              min={0}
              value={field.value.minor}
              onChange={(e) => updatePart("minor", e.target.value)}
              className="w-16 px-2 py-1.5 border rounded-lg text-sm text-center dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <span className="text-gray-500 font-bold">.</span>
            <input
              type="number"
              min={0}
              value={field.value.patch}
              onChange={(e) => updatePart("patch", e.target.value)}
              className="w-16 px-2 py-1.5 border rounded-lg text-sm text-center dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </>
        )}
        {!forceString ? (
          <div className="flex items-center gap-1.5 ml-2">
            <Switch size="sm" isSelected={isString} onValueChange={handleFormatChange} />
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {isString
                ? t("version.format.string")
                : formatVersion === 3
                  ? t("version.format.object")
                  : t("version.format.array")}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {t("version.format.string")}
            </span>
          </div>
        )}
      </div>
      {isString && !isValid && (
        <p className="text-xs text-red-500 mt-1">Invalid semantic version (e.g. 1.20.0 or 1.21.0-beta)</p>
      )}
    </div>
  );
}

interface UuidFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  t: TranslateFunction;
}

function UuidField({ label, value, onChange, t }: UuidFieldProps): JSX.Element {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1.5 border rounded-lg text-sm font-mono dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
        <Button size="sm" variant="flat" color="success" onPress={() => onChange(uuidv4())}>
          {t("fields.regenerate")}
        </Button>
      </div>
    </div>
  );
}

interface ModuleEditorProps {
  modules: ModuleEntry[];
  onChange: (modules: ModuleEntry[]) => void;
  packKind: PackKind;
  t: TranslateFunction;
  formatVersion: 2 | 3;
}

function ModuleEditor({ modules, onChange, packKind, t, formatVersion }: ModuleEditorProps): JSX.Element {
  const moduleTypes =
    packKind === "behavior"
      ? BP_MODULE_TYPES
      : packKind === "resource"
        ? RP_MODULE_TYPES
        : packKind === "world_template"
          ? WT_MODULE_TYPES
          : SP_MODULE_TYPES;

  const addModule = () => {
    const defaultType =
      packKind === "behavior"
        ? "data"
        : packKind === "resource"
          ? "resources"
          : packKind === "world_template"
            ? "world_template"
            : "skin_pack";
    onChange([...modules, createDefaultModule(defaultType)]);
  };

  const updateModule = (index: number, updated: Partial<ModuleEntry>) => {
    const newModules = [...modules];
    newModules[index] = { ...newModules[index], ...updated };
    // If type changed to script, set defaults
    if (updated.type === "script" && modules[index].type !== "script") {
      newModules[index].entry = "scripts/main.js";
      newModules[index].language = "javascript";
    }
    if (updated.type !== undefined && updated.type !== "script") {
      newModules[index].entry = "";
      newModules[index].language = "";
    }
    onChange(newModules);
  };

  const removeModule = (index: number) => {
    onChange(modules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("modules.title")}</h3>
        <Button size="sm" variant="flat" color="success" onPress={addModule}>
          + {t("modules.add")}
        </Button>
      </div>

      {modules.map((mod, index) => (
        <div
          key={mod.id}
          className="p-3 border rounded-lg dark:border-gray-700 space-y-2 bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("modules.type")}</label>
              <select
                value={mod.type}
                onChange={(e) => updateModule(index, { type: e.target.value as ModuleEntry["type"] })}
                className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {moduleTypes.map((mt) => (
                  <option key={mt} value={mt}>
                    {mt}
                  </option>
                ))}
              </select>
            </div>
            {modules.length > 1 && (
              <Button size="sm" variant="light" color="danger" onPress={() => removeModule(index)}>
                ✕
              </Button>
            )}
          </div>

          <UuidField
            label={t("fields.uuid")}
            value={mod.uuid}
            onChange={(v) => updateModule(index, { uuid: v })}
            t={t}
          />

          <VersionInput
            label={t("fields.version")}
            field={mod.version}
            onChange={(v) => updateModule(index, { version: v })}
            t={t}
            formatVersion={formatVersion}
            forceString={formatVersion === 3}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("fields.description")}</label>
            <input
              value={mod.description}
              onChange={(e) => updateModule(index, { description: e.target.value })}
              placeholder="Optional module description"
              className="w-full px-3 py-1.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {mod.type === "script" && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("modules.entry")}</label>
              <input
                value={mod.entry}
                onChange={(e) => updateModule(index, { entry: e.target.value })}
                placeholder="scripts/main.js"
                className="w-full px-3 py-1.5 border rounded-lg text-sm font-mono dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface CapabilitiesEditorProps {
  capabilities: string[];
  onChange: (caps: string[]) => void;
  packKind: PackKind;
  hasScriptModule: boolean;
  t: TranslateFunction;
}

function CapabilitiesEditor({
  capabilities,
  onChange,
  packKind,
  hasScriptModule,
  t,
}: CapabilitiesEditorProps): JSX.Element {
  const capList = packKind === "behavior" ? BP_CAPABILITIES : RP_CAPABILITIES;

  const toggle = (key: string) => {
    if (capabilities.includes(key)) {
      onChange(capabilities.filter((c) => c !== key));
    } else {
      onChange([...capabilities, key]);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("capabilities.title")}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enable special engine features like ray tracing, chemistry, or scripts.{" "}
          <a href="#capabilities" className="text-emerald-500 hover:underline">
            Learn more
          </a>
        </p>
      </div>
      <div className="space-y-2">
        {capList.map((cap) => {
          const isDisabled = cap.requiresScript && !hasScriptModule;
          return (
            <div key={cap.key} className="flex items-center gap-3">
              <Switch
                size="sm"
                isSelected={capabilities.includes(cap.key)}
                isDisabled={isDisabled}
                onValueChange={() => toggle(cap.key)}
                color="success"
              />
              <span
                className={`text-sm ${isDisabled ? "text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-300"}`}
              >
                {cap.label + " (" + cap.key + ")"}
                {isDisabled && <span className="text-xs ml-1">({cap.disabledNote})</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ScriptApiDepsEditorProps {
  deps: ScriptApiDep[];
  onChange: (deps: ScriptApiDep[]) => void;
  modulesData: ScriptModulesData | null;
  showPreview: boolean;
  onShowPreviewChange: (v: boolean) => void;
  t: TranslateFunction;
  hasScriptModule: boolean;
  formatVersion: 2 | 3;
}

function ScriptApiDepsEditor({
  deps,
  onChange,
  modulesData,
  showPreview,
  onShowPreviewChange,
  t,
  hasScriptModule,
  formatVersion,
}: ScriptApiDepsEditorProps): JSX.Element {
  if (!hasScriptModule) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("scriptapi.title")}</h3>
        <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-lg">
          {t("scriptapi.noScriptModule")}
        </p>
      </div>
    );
  }

  if (!modulesData) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("scriptapi.title")}</h3>
        <p className="text-sm text-gray-500">Loading script modules...</p>
      </div>
    );
  }

  const sourceModules = showPreview ? modulesData.preview_modules : modulesData.release_modules;
  const nativeModules = sourceModules.filter((m) => m.type === "native" && m.name !== "@minecraft/common");

  // Group by module name for version dropdown
  const moduleMap = new Map<string, string[]>();
  for (const m of nativeModules) {
    if (!moduleMap.has(m.name)) moduleMap.set(m.name, []);
    moduleMap.get(m.name)!.push(m.version);
  }

  const isSelected = (name: string) => deps.some((d) => d.moduleName === name);

  const getSelectedVersion = (name: string) => {
    const dep = deps.find((d) => d.moduleName === name);
    return dep?.version || "";
  };

  const toggleModule = (name: string, versions: string[]) => {
    if (isSelected(name)) {
      onChange(deps.filter((d) => d.moduleName !== name));
    } else {
      onChange([...deps, { moduleName: name, version: versions[0] }]);
    }
  };

  const setModuleVersion = (name: string, version: string) => {
    onChange(deps.map((d) => (d.moduleName === name ? { ...d, version } : d)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("scriptapi.title")}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select native Minecraft engine modules your scripts require.{" "}
            <a href="#script-api-dependencies" className="text-emerald-500 hover:underline">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch size="sm" isSelected={showPreview} onValueChange={onShowPreviewChange} color="warning" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{t("scriptapi.showPreview")}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {showPreview
          ? `Preview ${modulesData.latest_preview_version}`
          : `Release ${modulesData.latest_release_version}`}
        {" — "}Only native modules are shown.
      </div>

      <div className="space-y-1.5">
        {Array.from(moduleMap.entries()).map(([name, versions]) => (
          <div
            key={name}
            className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
              isSelected(name)
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <Switch
              size="sm"
              isSelected={isSelected(name)}
              onValueChange={() => toggleModule(name, versions)}
              color="success"
            />
            <span className="text-sm font-mono flex-1 text-gray-800 dark:text-gray-200">{name}</span>
            {isSelected(name) && versions.length > 0 && (
              <select
                value={getSelectedVersion(name)}
                onChange={(e) => setModuleVersion(name, e.target.value)}
                className="px-2 py-1 border rounded text-xs font-mono dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <optgroup label={t("scriptapi.versionSelectGroup")}>
                  <option value="alpha">alpha</option>
                  <option value="beta">beta</option>
                </optgroup>
                {versions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PackDepsEditorProps {
  deps: PackDependency[];
  onChange: (deps: PackDependency[]) => void;
  t: TranslateFunction;
  formatVersion: 2 | 3;
}

function PackDepsEditor({ deps, onChange, t, formatVersion }: PackDepsEditorProps): JSX.Element {
  const addDep = () => {
    onChange([...deps, { id: uuidv4(), uuid: "", version: createDefaultVersion() }]);
  };

  const updateDep = (index: number, updated: Partial<PackDependency>) => {
    const newDeps = [...deps];
    newDeps[index] = { ...newDeps[index], ...updated };
    onChange(newDeps);
  };

  const removeDep = (index: number) => {
    onChange(deps.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("dependencies.title")}</h3>
        <Button size="sm" variant="flat" color="success" onPress={addDep}>
          + {t("dependencies.add")}
        </Button>
      </div>

      {deps.map((dep, index) => (
        <div
          key={dep.id}
          className="p-3 border rounded-lg dark:border-gray-700 space-y-2 bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("dependencies.uuid")}</span>
            <Button size="sm" variant="light" color="danger" onPress={() => removeDep(index)}>
              ✕
            </Button>
          </div>
          <UuidField label="" value={dep.uuid} onChange={(v) => updateDep(index, { uuid: v })} t={t} />
          <VersionInput
            label={t("dependencies.version")}
            field={dep.version}
            onChange={(v) => updateDep(index, { version: v })}
            t={t}
            formatVersion={formatVersion}
            forceString={formatVersion === 3}
          />
        </div>
      ))}
    </div>
  );
}

interface SubpacksEditorProps {
  subpacks: SubpackEntry[];
  onChange: (subpacks: SubpackEntry[]) => void;
  formatVersion: 2 | 3;
  t: TranslateFunction;
}

function SubpacksEditor({ subpacks, onChange, formatVersion, t }: SubpacksEditorProps): JSX.Element {
  const addSubpack = () => {
    onChange([...subpacks, { id: uuidv4(), folderName: "", name: "", memoryTier: 1 }]);
  };

  const updateSubpack = (index: number, updated: Partial<SubpackEntry>) => {
    const newSubs = [...subpacks];
    newSubs[index] = { ...newSubs[index], ...updated };
    onChange(newSubs);
  };

  const removeSubpack = (index: number) => {
    onChange(subpacks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("subpacks.title")}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Configure resource subpacks for different memory tiers.{" "}
            <a href="#subpacks" className="text-emerald-500 hover:underline">
              Learn more
            </a>
          </p>
        </div>
        <Button size="sm" variant="flat" color="success" onPress={addSubpack}>
          + {t("subpacks.add")}
        </Button>
      </div>

      {subpacks.map((sp, index) => (
        <div
          key={sp.id}
          className="p-3 border rounded-lg dark:border-gray-700 space-y-2 bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="flex items-center justify-end">
            <Button size="sm" variant="light" color="danger" onPress={() => removeSubpack(index)}>
              ✕
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("subpacks.name")}</label>
              <input
                value={sp.name}
                onChange={(e) => updateSubpack(index, { name: e.target.value })}
                placeholder="e.g. Low"
                className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("subpacks.folder")}</label>
              <input
                value={sp.folderName}
                onChange={(e) => updateSubpack(index, { folderName: e.target.value })}
                placeholder="e.g. subpack_low"
                className="w-full px-2 py-1.5 border rounded text-sm font-mono dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {formatVersion === 3 ? t("subpacks.memoryPerf") : t("subpacks.memory")}
              </label>
              <input
                type="number"
                min={formatVersion === 3 ? 1 : 0}
                max={formatVersion === 3 ? 5 : undefined}
                value={sp.memoryTier}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val)) {
                    val = formatVersion === 3 ? 1 : 0;
                  } else {
                    if (formatVersion === 3) {
                      val = Math.max(1, Math.min(5, val));
                    } else {
                      val = Math.max(0, val);
                    }
                  }
                  updateSubpack(index, { memoryTier: val });
                }}
                className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface SettingsEditorProps {
  settings: SettingEntry[];
  onChange: (settings: SettingEntry[]) => void;
  t: TranslateFunction;
}

function SettingsEditor({ settings, onChange, t }: SettingsEditorProps): JSX.Element {
  const addSetting = () => {
    onChange([
      ...settings,
      {
        id: uuidv4(),
        type: "label",
        name: "",
        text: "",
        defaultBool: false,
        defaultNum: 0,
        defaultStr: "",
        min: 0,
        max: 100,
        step: 1,
        options: [
          { name: "option1", text: "Option 1" },
          { name: "option2", text: "Option 2" },
        ],
      },
    ]);
  };

  const updateSetting = (index: number, updated: Partial<SettingEntry>) => {
    const newSettings = [...settings];
    newSettings[index] = { ...newSettings[index], ...updated };
    onChange(newSettings);
  };

  const removeSetting = (index: number) => {
    onChange(settings.filter((_, i) => i !== index));
  };

  const updateOption = (settingIndex: number, optIndex: number, field: keyof DropdownOption, value: string) => {
    const newSettings = [...settings];
    const newOptions = [...newSettings[settingIndex].options];
    newOptions[optIndex] = { ...newOptions[optIndex], [field]: value };
    newSettings[settingIndex] = { ...newSettings[settingIndex], options: newOptions };
    onChange(newSettings);
  };

  const addOption = (settingIndex: number) => {
    const newSettings = [...settings];
    const newOptions = [...newSettings[settingIndex].options, { name: "", text: "" }];
    newSettings[settingIndex] = { ...newSettings[settingIndex], options: newOptions };
    onChange(newSettings);
  };

  const removeOption = (settingIndex: number, optIndex: number) => {
    const newSettings = [...settings];
    const newOptions = newSettings[settingIndex].options.filter((_, i) => i !== optIndex);
    newSettings[settingIndex] = { ...newSettings[settingIndex], options: newOptions };
    onChange(newSettings);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("settings.title")}</h3>
            <Chip size="sm" color="warning" variant="flat">
              Preview
            </Chip>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Define configurable in-game settings for Manifest V3.{" "}
            <a href="#manifest-v3-settings" className="text-emerald-500 hover:underline">
              Learn more
            </a>
          </p>
        </div>
        <Button size="sm" variant="flat" color="success" onPress={addSetting}>
          + {t("settings.add")}
        </Button>
      </div>

      {settings.map((setting, index) => (
        <div
          key={setting.id}
          className="p-3 border rounded-lg dark:border-gray-700 space-y-2 bg-gray-50 dark:bg-gray-800/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("settings.type")}</label>
              <select
                value={setting.type}
                onChange={(e) => updateSetting(index, { type: e.target.value as SettingType })}
                className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="label">Label</option>
                <option value="slider">Slider</option>
                <option value="toggle">Toggle</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </div>
            <Button size="sm" variant="light" color="danger" onPress={() => removeSetting(index)}>
              ✕
            </Button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("settings.text")}</label>
            <input
              value={setting.text}
              onChange={(e) => updateSetting(index, { text: e.target.value })}
              className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {setting.type !== "label" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("settings.name")}</label>
              <input
                value={setting.name}
                onChange={(e) => updateSetting(index, { name: e.target.value })}
                placeholder="mypack:setting_name"
                className="w-full px-2 py-1.5 border rounded text-sm font-mono dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {setting.type === "slider" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("settings.default")}</label>
                <input
                  type="number"
                  value={setting.defaultNum}
                  onChange={(e) => updateSetting(index, { defaultNum: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("settings.min")}</label>
                <input
                  type="number"
                  value={setting.min}
                  onChange={(e) => updateSetting(index, { min: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("settings.max")}</label>
                <input
                  type="number"
                  value={setting.max}
                  onChange={(e) => updateSetting(index, { max: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("settings.step")}</label>
                <input
                  type="number"
                  value={setting.step}
                  min={0.001}
                  step={0.1}
                  onChange={(e) => updateSetting(index, { step: parseFloat(e.target.value) || 1 })}
                  className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {setting.type === "toggle" && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("settings.default")}</label>
              <Switch
                size="sm"
                isSelected={setting.defaultBool}
                onValueChange={(v) => updateSetting(index, { defaultBool: v })}
                color="success"
              />
            </div>
          )}

          {setting.type === "dropdown" && (
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("settings.default")}</label>
                <input
                  value={setting.defaultStr}
                  onChange={(e) => updateSetting(index, { defaultStr: e.target.value })}
                  placeholder="Default option name"
                  className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Options</label>
                {setting.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      value={opt.name}
                      onChange={(e) => updateOption(index, optIdx, "name", e.target.value)}
                      placeholder="name"
                      className="flex-1 px-2 py-1 border rounded text-xs font-mono dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none"
                    />
                    <input
                      value={opt.text}
                      onChange={(e) => updateOption(index, optIdx, "text", e.target.value)}
                      placeholder="Display text"
                      className="flex-1 px-2 py-1 border rounded text-xs dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none"
                    />
                    {setting.options.length > 2 && (
                      <button
                        onClick={() => removeOption(index, optIdx)}
                        className="text-red-500 text-xs hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addOption(index)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  + Add option
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface MetadataEditorProps {
  metadata: MetadataState;
  onChange: (metadata: MetadataState) => void;
  t: TranslateFunction;
}

function MetadataEditor({ metadata, onChange, t }: MetadataEditorProps): JSX.Element {
  const update = (field: keyof MetadataState, value: string) => {
    onChange({ ...metadata, [field]: value });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("metadata.title")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("metadata.authors")}</label>
          <input
            value={metadata.authors}
            onChange={(e) => update("authors", e.target.value)}
            placeholder="Author1, Author2"
            className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("metadata.license")}</label>
          <input
            value={metadata.license}
            onChange={(e) => update("license", e.target.value)}
            placeholder="MIT"
            className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("metadata.url")}</label>
          <input
            value={metadata.url}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://example.com"
            className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{t("metadata.productType")}</label>
          <select
            value={metadata.productType}
            onChange={(e) => update("productType", e.target.value)}
            className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Default</option>
            <option value="addon">Addon</option>
          </select>
        </div>
      </div>
    </div>
  );
}

interface PackEditorProps {
  state: PackFormState;
  setState: React.Dispatch<React.SetStateAction<PackFormState>>;
  packKind: PackKind;
  packLabel: string;
  formatVersion: 2 | 3;
  scriptModulesData: ScriptModulesData | null;
  showPreview: boolean;
  onShowPreviewChange: (v: boolean) => void;
  t: TranslateFunction;
}

function PackEditor({
  state,
  setState,
  packKind,
  packLabel,
  formatVersion,
  scriptModulesData,
  showPreview,
  onShowPreviewChange,
  t,
}: PackEditorProps): JSX.Element {
  const update = useCallback(
    <K extends keyof PackFormState>(field: K, value: PackFormState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    [setState],
  );

  const hasScriptModule = state.modules.some((m) => m.type === "script");

  // Auto-remove script_eval capability when no script module
  useEffect(() => {
    if (!hasScriptModule && state.capabilities.includes("script_eval")) {
      update(
        "capabilities",
        state.capabilities.filter((c) => c !== "script_eval"),
      );
    }
  }, [hasScriptModule, state.capabilities, update]);

  // Auto-remove script API deps when no script module
  useEffect(() => {
    if (!hasScriptModule && state.scriptApiDeps.length > 0) {
      update("scriptApiDeps", []);
    }
  }, [hasScriptModule, state.scriptApiDeps.length, update]);

  return (
    <Card className="dark:bg-gray-900 mb-6">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{packLabel}</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Header Fields */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t("fields.general")}</h3>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("fields.name")}</label>
            <input
              value={state.headerName}
              onChange={(e) => update("headerName", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("fields.description")}</label>
            <input
              value={state.headerDescription}
              onChange={(e) => update("headerDescription", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <UuidField
            label={t("fields.uuid")}
            value={state.headerUuid}
            onChange={(v) => update("headerUuid", v)}
            t={t}
          />

          <VersionInput
            label={t("fields.version")}
            field={state.headerVersion}
            onChange={(v) => update("headerVersion", v)}
            t={t}
            formatVersion={formatVersion}
            forceString={formatVersion === 3}
          />

          <VersionInput
            label={t("fields.minEngineVersion")}
            field={state.minEngineVersion}
            onChange={(v) => update("minEngineVersion", v)}
            t={t}
            formatVersion={formatVersion}
            forceString={formatVersion === 3}
          />

          {/* Optional header toggles */}
          {packKind === "world_template" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <Switch
                    size="sm"
                    isSelected={state.allowRandomSeed}
                    onValueChange={(v) => update("allowRandomSeed", v)}
                    color="success"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t("fields.allowRandomSeed")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    size="sm"
                    isSelected={state.lockTemplateOptions}
                    onValueChange={(v) => update("lockTemplateOptions", v)}
                    color="success"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t("fields.lockTemplateOptions")}</span>
                </div>
              </div>

              {/* Base Game Version (optional) */}
              <div className="flex items-center gap-3 pt-1">
                <Switch
                  size="sm"
                  isSelected={state.baseGameVersion !== null}
                  onValueChange={(v) => {
                    if (v) {
                      update("baseGameVersion", createDefaultMinEngineVersion());
                    } else {
                      update("baseGameVersion", null);
                    }
                  }}
                  color="success"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t("fields.baseGameVersion")}</span>
              </div>
              {state.baseGameVersion && (
                <VersionInput
                  label=""
                  field={state.baseGameVersion}
                  onChange={(v) => update("baseGameVersion", v)}
                  t={t}
                  formatVersion={formatVersion}
                  forceString={formatVersion === 3}
                />
              )}
            </>
          )}

          {/* Pack Scope */}
          {packKind !== "world_template" && packKind !== "skin_pack" && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("fields.packScope")}</label>
              <select
                value={state.packScope}
                onChange={(e) => update("packScope", e.target.value as PackFormState["packScope"])}
                className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white ml-2"
              >
                <option value="">{t("fields.packScope.none")}</option>
                <option value="global">{t("fields.packScope.global")}</option>
                <option value="world">{t("fields.packScope.world")}</option>
                <option value="any">{t("fields.packScope.any")}</option>
              </select>
            </div>
          )}
        </div>

        <Divider className="dark:border-gray-700" />

        {/* Modules */}
        <ModuleEditor
          modules={state.modules}
          onChange={(v) => update("modules", v)}
          packKind={packKind}
          t={t}
          formatVersion={formatVersion}
        />

        <Divider className="dark:border-gray-700" />

        {/* Capabilities */}
        {(packKind === "behavior" || packKind === "resource") && (
          <>
            <CapabilitiesEditor
              capabilities={state.capabilities}
              onChange={(v) => update("capabilities", v)}
              packKind={packKind}
              hasScriptModule={hasScriptModule}
              t={t}
            />
            <Divider className="dark:border-gray-700" />
          </>
        )}

        {/* Pack Dependencies (UUID-based) */}
        {(packKind === "behavior" || packKind === "resource") && (
          <>
            <PackDepsEditor
              deps={state.dependencies}
              onChange={(v) => update("dependencies", v)}
              t={t}
              formatVersion={formatVersion}
            />
            <Divider className="dark:border-gray-700" />
          </>
        )}

        {/* Script API Dependencies (only for behavior packs) */}
        {packKind === "behavior" && (
          <>
            <ScriptApiDepsEditor
              deps={state.scriptApiDeps}
              onChange={(v) => update("scriptApiDeps", v)}
              modulesData={scriptModulesData}
              showPreview={showPreview}
              onShowPreviewChange={onShowPreviewChange}
              hasScriptModule={hasScriptModule}
              t={t}
              formatVersion={formatVersion}
            />
            <Divider className="dark:border-gray-700" />
          </>
        )}

        {/* Subpacks */}
        {(packKind === "resource" || packKind === "behavior") && (
          <>
            <SubpacksEditor
              subpacks={state.subpacks}
              onChange={(v) => update("subpacks", v)}
              formatVersion={formatVersion}
              t={t}
            />
            <Divider className="dark:border-gray-700" />
          </>
        )}

        {/* Settings (V3 only) */}
        {formatVersion === 3 && (
          <>
            <Divider className="dark:border-gray-700" />
            <SettingsEditor settings={state.settings} onChange={(v) => update("settings", v)} t={t} />
          </>
        )}

        <Divider className="dark:border-gray-700" />

        {/* Metadata */}
        <MetadataEditor metadata={state.metadata} onChange={(v) => update("metadata", v)} t={t} />
      </CardBody>
    </Card>
  );
}

interface ManifestOutputProps {
  manifest: MinecraftManifest;
  label: string;
  t: TranslateFunction;
}

function ManifestOutput({ manifest, label, t }: ManifestOutputProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const [jsonStr, setJsonStr] = useState(() => JSON.stringify(manifest, null, 2));

  useEffect(() => {
    let active = true;
    const formatJson = async () => {
      try {
        const rawJson = JSON.stringify(manifest);
        const formatted = await prettier.format(rawJson, {
          parser: "json",
          useTabs: false,
          plugins: [estree, babel],
        });
        if (active) {
          setJsonStr(formatted);
        }
      } catch (err) {
        console.error("Failed to format manifest JSON with Prettier:", err);
        if (active) {
          setJsonStr(JSON.stringify(manifest, null, 2));
        }
      }
    };
    formatJson();
    return () => {
      active = false;
    };
  }, [manifest]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = jsonStr;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manifest.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="dark:bg-gray-900 mb-6">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{label}</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="flat" color={copied ? "success" : "default"} onPress={copyToClipboard}>
            {copied ? t("output.copied") : t("output.copy")}
          </Button>
          <Button size="sm" variant="flat" color="primary" onPress={downloadFile}>
            {t("output.download")}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <pre className="bg-gray-950 text-emerald-400 p-4 rounded-xl overflow-auto text-sm font-mono leading-relaxed max-h-[500px] border border-gray-800">
          {jsonStr}
        </pre>
      </CardBody>
    </Card>
  );
}

interface ManifestGeneratorGuideProps {
  guideHtml: string;
}

function ManifestGeneratorGuide({ guideHtml }: ManifestGeneratorGuideProps): JSX.Element {
  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: guideHtml }} />;
}

interface ManifestGeneratorAppProps {
  t: TranslateFunction;
  guideHtml: string;
}

function ManifestGeneratorApp({ t, guideHtml }: ManifestGeneratorAppProps): JSX.Element {
  const [formatVersion, setFormatVersion] = useState<2 | 3>(2);
  const [packType, setPackType] = useState<PackType>("behavior");
  const [bpState, setBpState] = useState<PackFormState>(() => createDefaultBPState(t));
  const [rpState, setRpState] = useState<PackFormState>(() => createDefaultRPState(t));
  const [wtState, setWtState] = useState<PackFormState>(() => createDefaultWorldTemplateState(t));
  const [spState, setSpState] = useState<PackFormState>(() => createDefaultSkinPackState(t));
  const [scriptModulesData, setScriptModulesData] = useState<ScriptModulesData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch script modules
  useEffect(() => {
    fetch("https://jaylydev.github.io/scriptapi-docs/data/script-modules.json")
      .then((r) => r.json() as Promise<ScriptModulesData>)
      .then((data) => setScriptModulesData(data))
      .catch(console.error);
  }, []);

  const isAddons = packType === "addons";
  const showBP = packType === "behavior" || isAddons;
  const showRP = packType === "resource" || isAddons;
  const showWT = packType === "world_template";
  const showSP = packType === "skin_pack";

  // Generate manifests
  const [bpManifest, setBpManifest] = useState<MinecraftManifest | null>(null);
  const [rpManifest, setRpManifest] = useState<MinecraftManifest | null>(null);
  const [wtManifest, setWtManifest] = useState<MinecraftManifest | null>(null);
  const [spManifest, setSpManifest] = useState<MinecraftManifest | null>(null);

  useEffect(() => {
    if (showBP) {
      setBpManifest(generateManifestJSON(bpState, formatVersion, isAddons ? rpState : undefined, isAddons));
    } else {
      setBpManifest(null);
    }
  }, [bpState, rpState, formatVersion, showBP, isAddons]);

  useEffect(() => {
    if (showRP) {
      setRpManifest(generateManifestJSON(rpState, formatVersion, isAddons ? bpState : undefined, isAddons));
    } else {
      setRpManifest(null);
    }
  }, [rpState, bpState, formatVersion, showRP, isAddons]);

  useEffect(() => {
    if (showWT) {
      setWtManifest(generateManifestJSON(wtState, formatVersion));
    } else {
      setWtManifest(null);
    }
  }, [wtState, formatVersion, showWT]);

  useEffect(() => {
    if (showSP) {
      setSpManifest(generateManifestJSON(spState, formatVersion));
    } else {
      setSpManifest(null);
    }
  }, [spState, formatVersion, showSP]);

  // Force formatVersion 2 for Wo and SP
  useEffect(() => {
    if (packType === "world_template" || packType === "skin_pack") {
      setFormatVersion(2);
    }
  }, [packType]);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Page Title */}
      <h1 className="text-center m-4 md:m-6 text-3xl md:text-4xl font-bold">{t("pageHeading")}</h1>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-6">{t("pageSubtitle")}</p>

      {/* Format Version & Pack Type Controls */}
      <Card className="dark:bg-gray-900 mb-6">
        <CardBody className="space-y-4">
          {/* Format Version */}
          {packType !== "world_template" && packType !== "skin_pack" && (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Manifest Version:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color={formatVersion === 2 ? "success" : "default"}
                  variant={formatVersion === 2 ? "solid" : "flat"}
                  onPress={() => setFormatVersion(2)}
                >
                  V2 (Stable)
                </Button>
                <Button
                  size="sm"
                  color={formatVersion === 3 ? "warning" : "default"}
                  variant={formatVersion === 3 ? "solid" : "flat"}
                  onPress={() => setFormatVersion(3)}
                >
                  V3 (Preview)
                </Button>
              </div>
            </div>
          )}

          {/* Pack Type */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("packType.label")}:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                color={packType === "behavior" ? "primary" : "default"}
                variant={packType === "behavior" ? "solid" : "flat"}
                onPress={() => setPackType("behavior")}
              >
                {t("packType.behavior")}
              </Button>
              <Button
                size="sm"
                color={packType === "resource" ? "primary" : "default"}
                variant={packType === "resource" ? "solid" : "flat"}
                onPress={() => setPackType("resource")}
              >
                {t("packType.resource")}
              </Button>
              <Button
                size="sm"
                color={packType === "addons" ? "primary" : "default"}
                variant={packType === "addons" ? "solid" : "flat"}
                onPress={() => setPackType("addons")}
              >
                {t("packType.addons")}
              </Button>
              <Button
                size="sm"
                color={packType === "world_template" ? "primary" : "default"}
                variant={packType === "world_template" ? "solid" : "flat"}
                onPress={() => setPackType("world_template")}
              >
                {t("packType.world_template")}
              </Button>
              <Button
                size="sm"
                color={packType === "skin_pack" ? "primary" : "default"}
                variant={packType === "skin_pack" ? "solid" : "flat"}
                onPress={() => setPackType("skin_pack")}
              >
                {t("packType.skin_pack")}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Pack Editors */}
      {showBP && (
        <PackEditor
          state={bpState}
          setState={setBpState}
          packKind="behavior"
          packLabel={isAddons ? `${t("packType.behavior")}` : t("packType.behavior")}
          formatVersion={formatVersion}
          scriptModulesData={scriptModulesData}
          showPreview={showPreview}
          onShowPreviewChange={setShowPreview}
          t={t}
        />
      )}

      {showRP && (
        <PackEditor
          state={rpState}
          setState={setRpState}
          packKind="resource"
          packLabel={isAddons ? `${t("packType.resource")}` : t("packType.resource")}
          formatVersion={formatVersion}
          scriptModulesData={scriptModulesData}
          showPreview={showPreview}
          onShowPreviewChange={setShowPreview}
          t={t}
        />
      )}

      {showWT && (
        <PackEditor
          state={wtState}
          setState={setWtState}
          packKind="world_template"
          packLabel={t("packType.world_template")}
          formatVersion={formatVersion}
          scriptModulesData={scriptModulesData}
          showPreview={showPreview}
          onShowPreviewChange={setShowPreview}
          t={t}
        />
      )}

      {showSP && (
        <PackEditor
          state={spState}
          setState={setSpState}
          packKind="skin_pack"
          packLabel={t("packType.skin_pack")}
          formatVersion={formatVersion}
          scriptModulesData={scriptModulesData}
          showPreview={showPreview}
          onShowPreviewChange={setShowPreview}
          t={t}
        />
      )}

      {/* Advertisement */}
      <InArticleAdUnit />

      {/* Output Viewers */}
      {showBP && bpManifest && <ManifestOutput manifest={bpManifest} label={t("output.behavior")} t={t} />}
      {showRP && rpManifest && <ManifestOutput manifest={rpManifest} label={t("output.resource")} t={t} />}
      {showWT && wtManifest && <ManifestOutput manifest={wtManifest} label={t("output.world_template")} t={t} />}
      {showSP && spManifest && <ManifestOutput manifest={spManifest} label={t("output.skin_pack")} t={t} />}

      {/* Manifest generator guide */}
      <ManifestGeneratorGuide guideHtml={guideHtml} />
    </div>
  );
}

interface ManifestGeneratorScreenProps extends LocaleProps {
  guideHtml: string;
}

export default function Page({ texts, lang, localizedRoutes, guideHtml }: ManifestGeneratorScreenProps): JSX.Element {
  const t = createTranslateFunction(texts);

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
        <meta name="description" content={t("pageDescription")} />
        <meta property="og:title" content={t("pageTitle")} />
        <meta property="og:description" content={t("pageDescription")} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://jaylydev.github.io/icon.png" />
        <meta property="twitter:card" content="summary" />
        <meta
          name="keywords"
          content="Minecraft manifest generator, Bedrock manifest.json, Script API, behavior pack, resource pack, add-on generator, Minecraft modding tool"
        />
        <link rel="manifest" href={t("pwa.url")} crossOrigin="use-credentials" />
        <meta name="apple-mobile-web-app-title" content={t("appTitle")} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </Head>
      <StatsCollection />
      <SiteHeader t={t} lang={lang} localizedRoutes={localizedRoutes} />
      <HeroUIProvider>
        <ThemeProvider>
          <ManifestGeneratorApp t={t} guideHtml={guideHtml} />
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter t={t} lang={lang} localizedRoutes={localizedRoutes} />
    </>
  );
}
