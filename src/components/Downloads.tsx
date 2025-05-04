"use client";
import React from "react";
import {
  Button,
  getKeyValue,
  Link,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  HeroUIProvider,
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
      color="primary"
      radius="full"
      size="lg"
      onPress={() => {
        window.scrollTo({ behavior: "smooth", top: document.body.scrollHeight });
      }}
    >
      Download
    </Button>
  );
}

export function DownloadSection({ downloads }: DownloadProps) {
  const columns = [
    { key: "version", label: "Version" },
    { key: "supports", label: "Supports" },
    { key: "changelog", label: "Changelog" },
    { key: "download", label: "Download" },
  ];

  const rows = downloads.map((item, index) => {
    return {
      key: index.toString(),
      version: item.title + (item.channel ? ` (${item.channel})` : ""),
      supports: item.supports,
      changelog: item.changelog_url ? (
        <Link href={item.changelog_url}>
          <Button color="primary">Changelog</Button>
        </Link>
      ) : (
        <Button disabled color="default">
          Changelog
        </Button>
      ),
      download: (
        <Link href={item.url}>
          <Button color="success">
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
    <HeroUIProvider>
      <ThemeProvider>
        <div className="download-section">
          <p>Downloads</p>
          {value < 100 ? (
            <Progress label="Fetching Downloads..." size="md" value={value} color="success" showValueLabel={true} />
          ) : (
            <Table aria-label="Example static collection table">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={rows} emptyContent="No rows to display.">
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
