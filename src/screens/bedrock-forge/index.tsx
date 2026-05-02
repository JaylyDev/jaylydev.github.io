import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { NextRouter, useRouter } from "next/router";
import { InArticleAdUnit } from "@/components/AdUnit";
import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { ScreenLocaleProps, createTranslateFunction } from "@/locale/i18n";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import type {
  MCPEDLCfTagName,
  MCPEDLMeta,
  MCPEDLSubmission,
  MCPEDLSubmissions,
  MCPEDLSubmissionParams,
  MCPEDLSubmissionSort,
} from "./types";

const API_ENDPOINT = "https://api.mcpedl.com/api/submissions";
const PER_PAGE = 10;
const FILTERS_DB_NAME = "beforge-preferences";
const FILTERS_DB_VERSION = 1;
const FILTERS_STORE_NAME = "preferences";
const FILTERS_STORAGE_KEY = "filters";

const CF_TAG_OPTIONS: MCPEDLCfTagName[] = [
  "Armor, Tools, and Weapons",
  "Cosmetics",
  "Data Packs",
  "Fantasy",
  "Food",
  "Horror",
  "Magic",
  "Maps",
  "Minecraft Addon Maker",
  "ModJam 2025",
  "Multiplayer",
  "Performance",
  "Roleplay",
  "Skins",
  "Mobs",
  "Players",
  "Survival",
  "Technology",
  "Texture Packs",
  "Miscellaneous",
  "PvP",
  "Realistic",
  "Simplistic",
  "Themed",
  "Utility",
  "Vanilla+",
];

interface BedrockForgeFilters {
  minDownloads: number;
  maxDownloads: number;
  minRating: number;
  commentsOnly: boolean;
  legacySubmissions: boolean;
  selectedTags: MCPEDLCfTagName[];
}

interface BedrockForgeSortOption {
  label: string;
  value: MCPEDLSubmissionSort;
  description: string;
}

const SORT_OPTIONS: BedrockForgeSortOption[] = [
  {
    label: "Popular this week",
    value: "popular-week",
    description: "Most buzz over the last 7 days.",
  },
  {
    label: "Popular this month",
    value: "popular-month",
    description: "Trending across the last 30 days.",
  },
  {
    label: "Popular all time",
    value: "popular",
    description: "All-time favorites from MCPEDL.",
  },
  {
    label: "Latest",
    value: "latest",
    description: "Newest releases first.",
  },
];

const numberFormatter = new Intl.NumberFormat("en-US");

const defaultFilters: BedrockForgeFilters = {
  minDownloads: 0,
  maxDownloads: 0,
  minRating: 0,
  commentsOnly: false,
  legacySubmissions: false,
  selectedTags: [],
};

function canUseIndexedDb(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openFiltersDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!canUseIndexedDb()) {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    const request = window.indexedDB.open(FILTERS_DB_NAME, FILTERS_DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(FILTERS_STORE_NAME)) {
        database.createObjectStore(FILTERS_STORE_NAME);
      }
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open filters database"));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

function normalizeStoredFilters(value: unknown): BedrockForgeFilters | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const stored = value as Partial<BedrockForgeFilters>;
  const selectedTags = Array.isArray(stored.selectedTags)
    ? stored.selectedTags.filter((tag): tag is MCPEDLCfTagName => CF_TAG_OPTIONS.includes(tag as MCPEDLCfTagName))
    : [];

  return {
    minDownloads:
      typeof stored.minDownloads === "number" && Number.isFinite(stored.minDownloads) ? stored.minDownloads : 0,
    maxDownloads:
      typeof stored.maxDownloads === "number" && Number.isFinite(stored.maxDownloads) ? stored.maxDownloads : 0,
    minRating: typeof stored.minRating === "number" && Number.isFinite(stored.minRating) ? stored.minRating : 0,
    commentsOnly: stored.commentsOnly === true,
    legacySubmissions: stored.legacySubmissions === true,
    selectedTags,
  };
}

async function loadStoredFilters(): Promise<BedrockForgeFilters | null> {
  if (!canUseIndexedDb()) {
    return null;
  }

  const database = await openFiltersDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(FILTERS_STORE_NAME, "readonly");
    const request = transaction.objectStore(FILTERS_STORE_NAME).get(FILTERS_STORAGE_KEY);

    request.onsuccess = () => {
      resolve(normalizeStoredFilters(request.result));
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to read stored filters"));
    };

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("Stored filters read was aborted"));
    };
  });
}

async function saveStoredFilters(filters: BedrockForgeFilters): Promise<void> {
  if (!canUseIndexedDb()) {
    return;
  }

  const database = await openFiltersDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(FILTERS_STORE_NAME, "readwrite");
    transaction.objectStore(FILTERS_STORE_NAME).put(filters, FILTERS_STORAGE_KEY);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Failed to store filters"));
    };

    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("Stored filters write was aborted"));
    };
  });
}

function buildQueryString(params: MCPEDLSubmissionParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set("page", params.page.toString());
  searchParams.set("per_page", params.per_page.toString());
  searchParams.set("is_actual_version", params.is_actual_version.toString());

  if (params.s) {
    searchParams.set("s", params.s);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  return searchParams.toString();
}

function parseNumber(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseRating(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCount(value: number | string): string {
  const numeric = typeof value === "string" ? Number.parseInt(value, 10) : value;
  if (!Number.isFinite(numeric)) {
    return `${value}`;
  }
  return numberFormatter.format(numeric);
}

function formatRating(value: string): string {
  const rating = parseRating(value);
  return Number.isFinite(rating) ? rating.toFixed(1) : "n/a";
}

function normalizeTagId(tag: MCPEDLCfTagName): string {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function SubmissionArticle({ submission }: { submission: MCPEDLSubmission }): JSX.Element {
  const downloadCountString = submission.source == "curseforge" ? formatCount(submission.downloadCount) : "N/A";
  const commentsEnabledString = submission.source == "curseforge" ? (submission.comments_enabled ? "On" : "Off") : "On";
  const [showConfirm, setShowConfirm] = useState(false);

  function openCurseForge() {
    window.open(submission.url, "_blank", "noopener,noreferrer");
    setShowConfirm(false);
  }

  function openMcpedl() {
    window.open("https://mcpedl.com/" + submission.slug, "_blank", "noopener,noreferrer");
    setShowConfirm(false);
  }

  return (
    <article className="beforge-card" key={submission.id}>
      <button
        className="beforge-card-link"
        type="button"
        aria-label={`Open ${submission.title} in new tab`}
        onClick={() => setShowConfirm(true)}
      />
      <div className="beforge-card-media">
        <img src={submission.image} alt={submission.title} loading="lazy" />
      </div>
      <div className="beforge-card-body">
        <span className="beforge-card-title">{submission.title}</span>
        <p className="beforge-card-summary">{submission.summary}</p>
        <div className="beforge-card-meta">
          <span>Downloads: {downloadCountString}</span>
          <span>Rating: {formatRating(submission.average_rating)}</span>
          <span>Comments: {commentsEnabledString}</span>
          <span>Views: {formatCount(submission.popular.popular_all)}</span>
        </div>
        {submission.cf_tags && submission.cf_tags.length > 0 && (
          <div className="beforge-card-tags">
            {submission.cf_tags.map((tag) => (
              <span className="beforge-chip" key={`${submission.id}-${tag.id}`}>
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="external-modal" role="dialog" aria-modal="true">
          <div className="external-modal-backdrop" onClick={() => setShowConfirm(false)} />
          <div className="external-modal-dialog">
            <h3>Leave site?</h3>
            <p>
              You are about to open an external site for <strong>{submission.title}</strong>.
            </p>
            <div className="external-modal-actions">
              <button
                className="beforge-button beforge-button-ghost"
                type="button"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="beforge-button"
                style={{ backgroundColor: "#53a443" }}
                type="button"
                onClick={openMcpedl}
                title="Open on MCPEDL"
              >
                Open on MCPEDL
              </button>
              <button className="beforge-button" type="button" onClick={openCurseForge}>
                Open on CurseForge
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function BedrockForgeApp(): JSX.Element {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeQuery, setActiveQuery] = useState<string>("");
  const [sort, setSort] = useState<MCPEDLSubmissionSort>("latest");
  const [filters, setFilters] = useState<BedrockForgeFilters>(defaultFilters);
  const [hasLoadedStoredFilters, setHasLoadedStoredFilters] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [submissions, setSubmissions] = useState<MCPEDLSubmission[]>([]);
  const [meta, setMeta] = useState<MCPEDLMeta | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const idPrefix = useId();

  const fetchSubmissions = useCallback(async (params: MCPEDLSubmissionParams): Promise<void> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINT}?${buildQueryString(params)}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as MCPEDLSubmissions;
      setSubmissions(payload.data ?? []);
      setMeta(payload.meta ?? null);
      setUpdatedAt(payload.updated_at ?? "");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchPageInQuery = useCallback((page: number): void => {
    setPage(page);
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: page.toString(),
        },
      },
      undefined,
      { scroll: true }
    );
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const rawPage = Array.isArray(router.query.page) ? router.query.page[0] : router.query.page;
    const parsed = Number.parseInt(rawPage ?? "1", 10);
    if (Number.isFinite(parsed) && (parsed > 1000 || parsed < 1) && typeof window !== "undefined") {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("page", "1");
      window.location.replace(nextUrl.toString());
      return;
    }

    const nextPage = Number.isFinite(parsed) && parsed >= 0 ? parsed : 1;
    setPage(nextPage);
  }, [router.isReady, router.query.page]);

  useEffect(() => {
    let isMounted = true;

    loadStoredFilters()
      .then((storedFilters) => {
        if (!isMounted) return;
        if (storedFilters) {
          setFilters(storedFilters);
        }
      })
      .catch(() => {
        // Failing to persist preferences should not block browsing mods.
      })
      .finally(() => {
        if (isMounted) {
          setHasLoadedStoredFilters(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredFilters) return;

    saveStoredFilters(filters).catch(() => {
      // Failing to persist preferences should not block browsing mods.
    });
  }, [filters, hasLoadedStoredFilters]);

  useEffect(() => {
    fetchSubmissions({
      page,
      per_page: PER_PAGE,
      is_actual_version: 1,
      s: activeQuery ? activeQuery : undefined,
      sort,
    });
  }, [activeQuery, sort, page, fetchSubmissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      if (filters.minDownloads > 0 && submission.downloadCount < filters.minDownloads) {
        return false;
      }

      if (filters.maxDownloads > 0 && submission.downloadCount > filters.maxDownloads) {
        return false;
      }

      const rating = parseRating(submission.average_rating);
      if (filters.minRating > 0 && rating < filters.minRating) {
        return false;
      }

      if (filters.commentsOnly && !submission.comments_enabled && submission.source === "curseforge") {
        return false;
      }

      if (!filters.legacySubmissions && submission.source !== "curseforge") {
        return false;
      }

      if (filters.selectedTags.length > 0) {
        if (!submission.cf_tags || submission.cf_tags.length === 0) {
          return false;
        }
        const submissionTags = submission.cf_tags.map((tag) => tag.name);
        const hasMatch = filters.selectedTags.some((tag) => submissionTags.includes(tag));
        if (!hasMatch) {
          return false;
        }
      }

      return true;
    });
  }, [submissions, filters]);

  const activeSortDescription = useMemo(() => {
    const match = SORT_OPTIONS.find((option) => option.value === sort);
    return match ? match.description : "";
  }, [sort]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.minDownloads > 0 ||
      filters.maxDownloads > 0 ||
      filters.minRating > 0 ||
      filters.commentsOnly ||
      filters.legacySubmissions ||
      filters.selectedTags.length > 0
    );
  }, [filters]);

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setActiveQuery(searchTerm.trim());
      searchPageInQuery(1);
    },
    [searchTerm]
  );

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSortChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value as MCPEDLSubmissionSort);
  }, []);

  const handleMinDownloadsChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFilters((current) => ({
      ...current,
      minDownloads: parseNumber(event.target.value),
    }));
  }, []);

  const handleMaxDownloadsChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFilters((current) => ({
      ...current,
      maxDownloads: parseNumber(event.target.value),
    }));
  }, []);

  const handleMinRatingChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFilters((current) => ({
      ...current,
      minRating: parseNumber(event.target.value),
    }));
  }, []);

  const handleCommentsToggle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFilters((current) => ({
      ...current,
      commentsOnly: event.target.checked,
    }));
  }, []);

  const handleLegacySubmissionsToggle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFilters((current) => ({
      ...current,
      legacySubmissions: event.target.checked,
    }));
  }, []);

  const handleTagToggle = useCallback((tag: MCPEDLCfTagName) => {
    setFilters((current) => {
      const isSelected = current.selectedTags.includes(tag);
      const nextTags = isSelected
        ? current.selectedTags.filter((value) => value !== tag)
        : [...current.selectedTags, tag];
      return {
        ...current,
        selectedTags: nextTags,
      };
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleNextPage = useCallback(() => searchPageInQuery(page + 1), [page]);
  const handlePreviousPage = useCallback(() => searchPageInQuery(page - 1), [page]);

  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const canGoNext = currentPage < lastPage;
  const canGoPrevious = currentPage > 1;

  const searchInputId = `${idPrefix}-search`;
  const sortSelectId = `${idPrefix}-sort`;
  const minDownloadsId = `${idPrefix}-min-downloads`;
  const maxDownloadsId = `${idPrefix}-max-downloads`;
  const minRatingId = `${idPrefix}-min-rating`;
  const commentsId = `${idPrefix}-comments`;
  const legacySubmissionId = `${idPrefix}-legacy-submission`;

  return (
    <div className="beforge-shell">
      <div className="beforge-content">
        <header className="beforge-hero">
          <h1 className="beforge-title">Bedrock Forge</h1>
          <p className="beforge-subtitle">Find the best addons, maps, and resource packs for Minecraft Bedrock here!</p>
        </header>
        <form className="beforge-search" onSubmit={handleSearchSubmit}>
          <label className="beforge-sr-only" htmlFor={searchInputId}>
            Search MCPEDL submissions
          </label>
          <input
            id={searchInputId}
            className="beforge-input"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search addons, maps, and resource packs"
          />
          <button className="beforge-button" type="submit" disabled={isLoading}>
            {isLoading ? "Loading" : "Search"}
          </button>
        </form>
        <div className="beforge-layout">
          <aside className="beforge-filters">
            <div className="beforge-panel">
              <div className="beforge-panel-title">Sort</div>
              <label className="beforge-label" htmlFor={sortSelectId}>
                Sort MCPEDL list
              </label>
              <select className="beforge-select" id={sortSelectId} value={sort} onChange={handleSortChange}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="beforge-hint">{activeSortDescription}</p>
            </div>

            <div className="beforge-panel">
              <div className="beforge-panel-title">Filters</div>
              <label className="beforge-label" htmlFor={minDownloadsId}>
                Minimum downloads
              </label>
              <input
                id={minDownloadsId}
                className="beforge-input"
                type="number"
                min={0}
                value={filters.minDownloads}
                onChange={handleMinDownloadsChange}
              />
              <label className="beforge-label" htmlFor={maxDownloadsId}>
                Maximum downloads
              </label>
              <input
                id={maxDownloadsId}
                className="beforge-input"
                type="number"
                min={0}
                value={filters.maxDownloads}
                onChange={handleMaxDownloadsChange}
              />

              <label className="beforge-label" htmlFor={minRatingId}>
                Minimum rating
              </label>
              <div className="beforge-range">
                <input
                  id={minRatingId}
                  type="range"
                  min={0}
                  max={5}
                  step={0.1}
                  value={filters.minRating}
                  onChange={handleMinRatingChange}
                />
                <span className="beforge-range-value">{filters.minRating.toFixed(1)}</span>
              </div>

              <label className="beforge-toggle" htmlFor={commentsId}>
                <input id={commentsId} type="checkbox" checked={filters.commentsOnly} onChange={handleCommentsToggle} />
                Comments enabled only
              </label>
              <label className="beforge-toggle" htmlFor={legacySubmissionId}>
                <input
                  id={legacySubmissionId}
                  type="checkbox"
                  checked={filters.legacySubmissions}
                  onChange={handleLegacySubmissionsToggle}
                />
                Show legacy submissions
              </label>
            </div>

            <div className="beforge-panel">
              <div className="beforge-panel-title">Tags</div>
              <div className="beforge-tags-grid">
                {CF_TAG_OPTIONS.map((tag) => {
                  const tagId = `${idPrefix}-tag-${normalizeTagId(tag)}`;
                  const isChecked = filters.selectedTags.includes(tag);
                  return (
                    <label className="beforge-tag" htmlFor={tagId} key={tag}>
                      <input id={tagId} type="checkbox" checked={isChecked} onChange={() => handleTagToggle(tag)} />
                      <span>{tag}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button className="beforge-button beforge-button-ghost" type="button" onClick={handleResetFilters}>
              Reset filters
            </button>
          </aside>

          <section className="beforge-results">
            <div className="beforge-results-header">
              <div>
                <div className="beforge-results-count">
                  Showing {filteredSubmissions.length} of {submissions.length} loaded
                </div>
                {hasActiveFilters && <div className="beforge-results-note">Filters active</div>}
              </div>
              <div className="beforge-results-meta">
                {activeQuery && <span>Query: {activeQuery}</span>}
                {meta && <span>API total: {formatCount(meta.total)}</span>}
                {updatedAt && <span>Updated: {updatedAt}</span>}
              </div>
            </div>

            {error && <div className="beforge-state beforge-error">{error}</div>}
            {isLoading && !error && <div className="beforge-state">Fetching MCPEDL submissions...</div>}

            {!isLoading && !error && filteredSubmissions.length === 0 && (
              <div className="beforge-state">No submissions match the current filters.</div>
            )}

            <div className="beforge-grid" aria-live="polite">
              {filteredSubmissions.map((submission) => (
                <SubmissionArticle key={submission.id} submission={submission} />
              ))}
            </div>

            <div className="beforge-pagination">
              <div className="beforge-page-info">
                Page {currentPage}
                {meta ? ` of ${lastPage}` : ""}
              </div>
              {/* group of 2 left and right with gap of 1rem */}
              <div className="gap-4 flex">
                <button
                  className="beforge-button"
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={isLoading || !canGoPrevious}
                >
                  {isLoading ? "Loading" : "Previous page"}
                </button>
                <button
                  className="beforge-button"
                  type="button"
                  onClick={handleNextPage}
                  disabled={isLoading || !canGoNext}
                >
                  {isLoading ? "Loading" : "Next page"}
                </button>
              </div>
            </div>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-2533146760921020"
              data-ad-slot="9981621827"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Page({ texts, lang }: ScreenLocaleProps): JSX.Element {
  const t = createTranslateFunction(texts);
  return (
    <>
      <Head>
        <title>Bedrock Forge | JaylyMC</title>
        <meta
          name="description"
          content="An alternative to MCPEDL and CurseForge for Bedrock Edition addons, maps, and resource packs. Find the best mods for Minecraft Bedrock Edition here!"
        />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://jaylydev.github.io/icon.png" />
        <meta property="twitter:card" content="summary" />
      </Head>
      <StatsCollection />
      <SiteHeader t={t} lang={lang} />
      <InArticleAdUnit />
      <HeroUIProvider>
        <ThemeProvider>
          <BedrockForgeApp />
        </ThemeProvider>
      </HeroUIProvider>
      <SiteFooter t={t} lang={lang} />
    </>
  );
}
