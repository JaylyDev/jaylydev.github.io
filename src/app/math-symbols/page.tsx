"use client";

import { StatsCollection, SiteHeader, SiteFooter } from "@/components/SiteFormat";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useState, useMemo } from "react";
import symbolsData from "./data/symbols.json";
import BackToTopButton from "../../components/BackToTopButton";

interface Symbol {
  symbol: string;
  codes: string[];
  description: string;
  tags: string[];
}

interface Category {
  category: string;
  symbols: Symbol[];
}

function MathEquationSymbolsApp(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const categories: Category[] = symbolsData;

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    const term = searchTerm.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        symbols: category.symbols.filter(
          (symbol) =>
            symbol.symbol.toLowerCase().includes(term) ||
            symbol.codes.some((code) => code.toLowerCase().includes(term)) ||
            symbol.description.toLowerCase().includes(term) ||
            symbol.tags.some((tag) => tag.toLowerCase().includes(term))
        ),
      }))
      .filter((category) => category.symbols.length > 0);
  }, [searchTerm, categories]);

  const totalSymbols = categories.reduce((sum, cat) => sum + cat.symbols.length, 0);
  const filteredSymbolsCount = filteredCategories.reduce((sum, cat) => sum + cat.symbols.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Glossary of Math Symbols for Microsoft Word</h1>
      <p className="mb-3 text-gray-600 dark:text-gray-300">
        Complete list of UnicodeMath character keywords and properties from{" "}
        <a href="https://www.unicode.org/notes/tn28/tn28-7.html">UTN28 specification (version 3.3)</a>{" "}
        <a href="https://www.unicode.org/notes/tn28/UTN28-PlainTextMath-v3.3.pdf">(Paper)</a>.
      </p>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        All symbols are supported in Microsoft 365 apps (Word, Excel, PowerPoint, OneNote, Outlook, Publisher, Access)
        and Google Workspace apps (Docs, Sheets, Slides, Forms) that include equation editors.
      </p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by keyword, glyph, or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredSymbolsCount} of {totalSymbols} symbols
      </div>

      {filteredCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{category.category}</h2>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                    Codes
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody>
                {category.symbols.map((symbol, index) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3 text-center text-2xl text-gray-900 dark:text-gray-100">{symbol.symbol}</td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100">
                      {symbol.codes.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{symbol.description}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex flex-wrap gap-1">
                        {symbol.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filteredSymbolsCount === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No symbols found matching your search.</div>
      )}
    </div>
  );
}

export default function Page(): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StatsCollection />
        <SiteHeader />
        <HeroUIProvider>
          <ThemeProvider>
            <MathEquationSymbolsApp />
            <BackToTopButton />
          </ThemeProvider>
        </HeroUIProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
