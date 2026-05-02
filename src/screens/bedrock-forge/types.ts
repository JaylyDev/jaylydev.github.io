// What MCPEDL responds
export interface MCPEDLSubmissions {
  status: string;
  searchParams: MCPEDLSearchParams;
  data: MCPEDLSubmission[];
  meta: MCPEDLMeta;
  updated_at: string;
}

export interface MCPEDLSearchParams {
  index: string;
  body: MCPEDLSearchBody;
  size: number;
  from: number;
}

export interface MCPEDLSearchBody {
  query: MCPEDLSearchQuery;
  sort: MCPEDLSearchSort;
}

export interface MCPEDLSearchQuery {
  function_score: MCPEDLSearchFunctionScore;
}

export interface MCPEDLSearchFunctionScore {
  query: MCPEDLSearchFunctionScoreQuery;
  field_value_factor?: MCPEDLSearchFieldValueFactor;
}

export interface MCPEDLSearchFieldValueFactor {
  field: string;
  factor: number;
  modifier: string;
  missing: number;
}

export interface MCPEDLSearchFunctionScoreQuery {
  bool: MCPEDLSearchBool;
}

export interface MCPEDLSearchBool {
  must?: MCPEDLSearchMust[];
  must_not: MCPEDLSearchMustNot[];
}

export interface MCPEDLSearchMust {
  multi_match: MCPEDLSearchMultiMatch;
}

export interface MCPEDLSearchMustNot {
  match: MCPEDLSearchMatch;
}

export interface MCPEDLSearchMultiMatch {
  fields: string[];
  query: string;
  operator: string;
}

export interface MCPEDLSearchMatch {
  type_id: number;
}

export interface MCPEDLSearchSort {
  sort_date: string;
}

export interface MCPEDLSubmission {
  slug: string;
  source: string;
  title: string;
  summary: string;
  image: string;
  created_at: string;
  sort_date: string;
  popular: MCPEDLSubmissionPopular;
  tags: MCPEDLTag[];
  url: string;
  downloadCount: number;
  submission_images: string[];
  downloads: MCPEDLDownload[];
  submission_id: number;
  original_submission_id: number;
  mainFileId: number;
  display_name: string;
  username: string;
  user_id: number;
  user_nicename: string;
  user_avatar: string;
  user_role: number;
  comments_enabled: boolean;
  average_rating: string;
  downloads1d: number | null;
  downloads7d: number | null;
  downloads14d: number | null;
  downloads28d: number | null;
  revisions: MCPEDLRevision[];
  type_id: number;
  cf_tags: MCPEDLCfTag[];
  short_description: string;
  categories: MCPEDLCategory[];
  thumbnails: MCPEDLThumbnails;
  update_date: string;
  publish_date: string;
  id: number;
  server_ip: string;
  servertype: string[];
  port: number;
  is_bookmarked: boolean;
  status: string;
}

export interface MCPEDLSubmissionPopular {
  popular_week: string;
  popular_month: string;
  popular_all: string;
}

export interface MCPEDLTag {
  id: number;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  term_id: number | null;
  tag_type_id: number;
}

export interface MCPEDLDownload {
  name: string;
  filename: string;
  downloadUrl: string;
  fileLength: number;
  fileDate: string;
}

export interface MCPEDLRevision {
  changelog: string;
  id: number;
  submission_id: number;
  version: number;
}

export type MCPEDLCfTagName =
  | "Armor, Tools, and Weapons"
  | "Cosmetics"
  | "Data Packs"
  | "Fantasy"
  | "Food"
  | "Horror"
  | "Magic"
  | "Maps"
  | "Minecraft Addon Maker"
  | "ModJam 2025"
  | "Multiplayer"
  | "Performance"
  | "Roleplay"
  | "Skins"
  | "Mobs"
  | "Players"
  | "Survival"
  | "Technology"
  | "Texture Packs"
  | "Miscellaneous"
  | "PvP"
  | "Realistic"
  | "Simplistic"
  | "Themed"
  | "Utility"
  | "Vanilla+";

export interface MCPEDLCfTag {
  id: number;
  name: MCPEDLCfTagName;
  slug: string;
  iconUrl: string;
  url: string;
  parentCategoryId: number;
}

export interface MCPEDLCategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

export interface MCPEDLThumbnails {
  large: string;
  medium: string;
  small: string;
}

export interface MCPEDLMeta {
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
  type: string;
  filterTitle: string;
  seo: MCPEDLSeo;
}

export interface MCPEDLSeo {
  slug: string | null;
  pageTitle: string;
}

export type MCPEDLSubmissionSort =
  | "popular-week"
  | "popular-month"
  | "popular"
  | "latest";

export interface MCPEDLSubmissionParams {
  page: number;
  // range: 0 - 50 (int)
  per_page: number;
  // No idea what this is, range: 0 - 1 (int)
  is_actual_version: number;
  // search query, optional
  s?: string;
  sort?: MCPEDLSubmissionSort;
}
