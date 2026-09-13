"use client";
import React from "react";
import {
  Button,
  Link,
  ProgressBar,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ThemeProvider } from "next-themes";

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
      size="lg"
      onPress={() => {
        window.scrollTo({ behavior: "smooth", top: document.body.scrollHeight });
      }}
    >
      Download
    </Button>
  );
}

export interface DownloadRow {
  key: string;
  version: string;
  supports: string;
  changelog: React.ReactNode;
  download: React.ReactNode;
}

export function DownloadSection({ downloads }: DownloadProps) {
  const columns = [
    { key: "version", label: "Version" },
    { key: "supports", label: "Supports" },
    { key: "changelog", label: "Changelog" },
    { key: "download", label: "Download" },
  ];

  const rows: DownloadRow[] = downloads.map((item, index) => {
    return {
      key: index.toString(),
      version: item.title + (item.channel ? ` (${item.channel})` : ""),
      supports: item.supports,
      changelog: item.changelog_url ? (
        <Link href={item.changelog_url}>
          <Button >Changelog</Button>
        </Link>
      ) : (
        <Button isDisabled >
          Changelog
        </Button>
      ),
      download: (
        <Link href={item.url}>
          <Button >
            <strong>Download</strong>
          </Button>
        </Link>
      ),
    };
  });

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
    
      <ThemeProvider>
        <div className="download-section">
          <p>Downloads</p>
          {value < 100 ? (
            <ProgressBar aria-label="Fetching Downloads..." size="md" value={value} />
          ) : (
            <Table aria-label="Example static collection table">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{item[String(columnKey) as keyof DownloadRow] as React.ReactNode}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </ThemeProvider>
    
  );
}
