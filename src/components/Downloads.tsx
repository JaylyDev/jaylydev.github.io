"use client";
import React from "react";
import { Button } from "@/components/ui/Button";

export interface DownloadItem {
  title?: string;
  channel?: string;
  supports: string;
  changelog_url: string;
  url: string;
}

export interface DownloadProps {
  downloads: DownloadItem[];
}

export function DownloadButton(): React.JSX.Element {
  return (
    <Button
      className="download-button"
      color="primary"
      radius="full"
      size="lg"
      onClick={() => {
        window.scrollTo({ behavior: "smooth", top: document.body.scrollHeight });
      }}
    >
      Download
    </Button>
  );
}

export function DownloadSection({ downloads }: DownloadProps) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (value >= 100) {
        clearInterval(interval);
      }
      setValue((v) => (v >= 100 ? v : v + 5));
    }, 250);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="download-section">
      <p>Downloads</p>
      {value < 100 ? (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between text-base">
            <span>Fetching Downloads...</span>
            <span>{value}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Fetching Downloads..."
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            className="relative h-3 w-full overflow-hidden rounded-full bg-[#d4d4d8]/50 dark:bg-[#52525b]/50"
          >
            <div
              className="h-full rounded-full bg-[#17c964] transition-all duration-300"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="p-4 flex flex-col relative justify-between gap-4 rounded-[14px] bg-white dark:bg-[#18181b] shadow-[0_0_5px_0_rgba(0,0,0,0.02),0_2px_10px_0_rgba(0,0,0,0.06),0_0_1px_0_rgba(0,0,0,0.3)] overflow-auto">
          <table aria-label="Downloads table" className="min-w-full h-auto border-collapse">
            <thead>
              <tr>
                <th className="px-3 h-10 text-start align-middle bg-[#f4f4f5] dark:bg-[#27272a] whitespace-nowrap text-[#71717a] dark:text-[#a1a1aa] text-xs font-semibold first:rounded-s-lg">
                  Version
                </th>
                <th className="px-3 h-10 text-start align-middle bg-[#f4f4f5] dark:bg-[#27272a] whitespace-nowrap text-[#71717a] dark:text-[#a1a1aa] text-xs font-semibold">
                  Supports
                </th>
                <th className="px-3 h-10 text-start align-middle bg-[#f4f4f5] dark:bg-[#27272a] whitespace-nowrap text-[#71717a] dark:text-[#a1a1aa] text-xs font-semibold">
                  Changelog
                </th>
                <th className="px-3 h-10 text-start align-middle bg-[#f4f4f5] dark:bg-[#27272a] whitespace-nowrap text-[#71717a] dark:text-[#a1a1aa] text-xs font-semibold last:rounded-e-lg">
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              {downloads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-[#a1a1aa] align-middle text-center h-40">
                    No rows to display.
                  </td>
                </tr>
              ) : (
                downloads.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-3 align-middle text-sm font-normal">
                      {item.title + (item.channel ? ` (${item.channel})` : "")}
                    </td>
                    <td className="py-2 px-3 align-middle text-sm font-normal">{item.supports}</td>
                    <td className="py-2 px-3 align-middle text-sm font-normal">
                      {item.changelog_url ? (
                        <a href={item.changelog_url} className="no-underline hover:no-underline">
                          <Button color="primary">Changelog</Button>
                        </a>
                      ) : (
                        <Button disabled color="default">
                          Changelog
                        </Button>
                      )}
                    </td>
                    <td className="py-2 px-3 align-middle text-sm font-normal">
                      <a href={item.url} className="no-underline hover:no-underline">
                        <Button color="success">
                          <strong>Download</strong>
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
