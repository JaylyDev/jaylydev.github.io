// Renders the HK tunnel tolls Open Graph images (en + zh) into out/ after `next build`.
// Prices come from tolls.json so the preview never goes stale; CJK text needs a Noto Sans HK/CJK font installed.
import path from "path";
import sharp from "sharp";
import tollData from "../src/screens/hk-tunnels-tolls/data/tolls.json";
import registryInfo from "../src/screens/hk-tunnels-tolls/data/registry.json";
import type { TollPeriod } from "../src/screens/hk-tunnels-tolls/tollUtils";

const OUTPUT_DIR = path.join(process.cwd(), "out", "hk-tunnels-tolls");
const ICON_PATH = path.join(process.cwd(), "public", "hk-tunnels-tolls", "icon.png");
const FONT_FAMILY = "Noto Sans HK, Noto Sans CJK HK, Microsoft JhengHei, sans-serif";
const CARD_TUNNELS = ["whc", "cht", "ehc", "tai_lam"] as const;

type CardTunnel = (typeof CARD_TUNNELS)[number];

interface OgLocaleText {
  fileName: string;
  title: string;
  subtitle: string;
  cardNote: string;
  url: string;
  tunnelNames: Record<CardTunnel, string>;
}

const LOCALES: OgLocaleText[] = [
  {
    fileName: "og-image.png",
    title: "Hong Kong Tunnel Tolls",
    subtitle: "Live Tolls, Traffic Status &amp; Time-Varying Schedules",
    cardNote: "Time-Varying",
    url: "jaylydev.github.io/hk-tunnels-tolls",
    tunnelNames: { whc: "WHC", cht: "CHT", ehc: "EHC", tai_lam: "Tai Lam" },
  },
  {
    fileName: "og-image-zh.png",
    title: "香港隧道收費",
    subtitle: "即時收費、路況及分時段收費時間表",
    cardNote: "分時段收費",
    url: "jaylydev.github.io/zh/hk-tunnels-tolls",
    tunnelNames: { whc: "西隧", cht: "紅隧", ehc: "東隧", tai_lam: "大欖隧道" },
  },
];

function getPrivateCarRange(key: CardTunnel): string {
  const periods: TollPeriod[] = tollData.tunnels[key].timeVaryingTolls.weekdays.periods;
  const amounts = periods.flatMap((period) => (typeof period.toll === "number" ? [period.toll] : period.toll.range));
  return `$${Math.min(...amounts)} - $${Math.max(...amounts)}`;
}

function renderSvg(text: OgLocaleText): string {
  const cards = CARD_TUNNELS.map((key, index) => {
    const x = 96 + index * 255;
    const color = registryInfo.tunnels[key].color;
    return `
      <rect x="${x}" y="290" width="234" height="142" rx="14" fill="#0f172a" stroke="${color}" stroke-width="3"/>
      <rect x="${x}" y="290" width="10" height="142" rx="5" fill="${color}"/>
      <text x="${x + 28}" y="336" font-size="22" font-weight="700" fill="#e2e8f0">${text.tunnelNames[key]}</text>
      <text x="${x + 28}" y="384" font-size="38" font-weight="700" fill="#4ade80">${getPrivateCarRange(key)}</text>
      <text x="${x + 28}" y="414" font-size="17" fill="#94a3b8">${text.cardNote}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" font-family="${FONT_FAMILY}">
    <rect width="1200" height="630" fill="#172033"/>
    <rect x="0" y="0" width="300" height="8" fill="#0891b2"/>
    <rect x="300" y="0" width="300" height="8" fill="#dc2626"/>
    <rect x="600" y="0" width="300" height="8" fill="#ca8a04"/>
    <rect x="900" y="0" width="300" height="8" fill="#16a34a"/>
    <rect x="64" y="64" width="1072" height="502" rx="28" fill="#111827" stroke="#334155" stroke-width="2"/>
    <text x="250" y="168" font-size="50" font-weight="700" fill="#ffffff">${text.title}</text>
    <text x="250" y="226" font-size="32" fill="#94a3b8">${text.subtitle}</text>
    ${cards}
    <text x="96" y="512" font-size="22" font-weight="600" fill="#e2e8f0">${text.url}</text>
  </svg>`;
}

export async function generateOgImages(): Promise<void> {
  const icon = await sharp(ICON_PATH).resize(128, 128, { kernel: "nearest" }).toBuffer();
  for (const text of LOCALES) {
    const outputPath = path.join(OUTPUT_DIR, text.fileName);
    await sharp(Buffer.from(renderSvg(text)))
      .composite([{ input: icon, left: 100, top: 120 }])
      .png()
      .toFile(outputPath);
    console.log(`Generated ${outputPath}`);
  }
}
