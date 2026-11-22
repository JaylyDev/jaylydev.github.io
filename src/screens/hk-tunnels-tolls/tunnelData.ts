import registryInfo from "./data/registry.json";

export const SITE_URL = "https://jaylydev.github.io";
export const GITHUB_REPO_URL = "https://github.com/JaylyDev/jaylydev.github.io";
export const OG_IMAGE_URL = `${SITE_URL}/hk-tunnels-tolls/og-image.png`;

export type VehicleTypeIdentifier = keyof typeof registryInfo.vehicleTypes;
export type HKTunnelIdentifier = keyof typeof registryInfo.tunnels;

export interface BilingualText {
  zh: string;
  en: string;
}

export interface TunnelCamera {
  id: string;
  label: BilingualText;
}

export interface ExtraTrafficIndicator {
  loc: string;
  dest: string;
  approachMinutes: number;
}

export interface ExtraDirectionRoute {
  direction: string;
  speedLimitKmh: number;
  indicators: ExtraTrafficIndicator[];
}

export interface TunnelDetailConfig {
  slug: string;
  registryKey: HKTunnelIdentifier | null;
  isFree: boolean;
  color: string;
  lengthKm: number;
  speedLimitKmh: number;
  shortName: BilingualText;
  officialName: BilingualText;
  seoTitle: BilingualText;
  seoDescription: BilingualText;
  h1: BilingualText;
  connectingRoads: BilingualText;
  hkeTollNote: BilingualText;
  alternativeRoutes: BilingualText;
  siblingSlugs: string[];
  cameras: TunnelCamera[];
  extraRoutes?: ExtraDirectionRoute[];
}

export interface FreeTunnelEntry {
  slug?: string;
  name: BilingualText;
  connectingRoads: BilingualText;
  note: BilingualText;
}

export interface FaqItem {
  question: BilingualText;
  answer: BilingualText;
}

export const TUNNEL_DETAILS: TunnelDetailConfig[] = [
  {
    slug: "tai-lam-tunnel",
    registryKey: "tai_lam",
    isFree: false,
    color: "#16a34a",
    lengthKm: 3.8,
    speedLimitKmh: 80,
    shortName: { zh: "大欖隧道", en: "Tai Lam Tunnel" },
    officialName: { zh: "大欖隧道（三號幹線郊野公園段）", en: "Tai Lam Tunnel (Route 3 Country Park Section)" },
    seoTitle: {
      zh: "大欖隧道即時交通及收費表 | 實時車龍、分時段價錢及路況",
      en: "Tai Lam Tunnel Live Tolls & Traffic Status | Time-Varying Rates & Cameras",
    },
    seoDescription: {
      zh: "即時查詢大欖隧道實時分時段收費、私家車（HK$18-$45）、電單車、的士及貨車最新價錢、元朗及汀九方向車龍行車時間與運輸署實時交通快拍。",
      en: "Check live Tai Lam Tunnel time-varying tolls ($18-$45 private cars), real-time traffic to Yuen Long and Ting Kau, next toll change countdown, and TD CCTV snapshots.",
    },
    h1: { zh: "大欖隧道即時交通及分時段收費表", en: "Tai Lam Tunnel Live Tolls & Traffic Status" },
    connectingRoads: {
      zh: "青朗公路（三號幹線）：連接汀九（荃灣／九龍方向）及八鄉、元朗、錦田（新界西北方向）",
      en: "Tsing Long Highway (Route 3): Connects Ting Kau (Tsuen Wan / Kowloon) with Pat Heung, Yuen Long, and Kam Tin",
    },
    hkeTollNote: {
      zh: "大欖隧道已實施「易通行」不停車繳費及不同時段不同收費；私家車平日按時段收 HK$18 至 HK$45，星期日及公眾假期全日劃一 HK$18。",
      en: "HKeToll contactless tolling and time-varying tolls apply: private cars pay HK$18 to HK$45 on weekdays (Mon-Sat) and a flat HK$18 all day on Sundays and public holidays.",
    },
    alternativeRoutes: {
      zh: "往返元朗、屯門與市區如遇大欖隧道擠塞，可考慮免費替代路線屯門公路或元朗公路經屯赤隧道（往大嶼山）。",
      en: "When congested, drivers heading between Yuen Long / Tuen Mun and urban Kowloon can use the free Tuen Mun Road alternative.",
    },
    siblingSlugs: ["western-harbour-crossing", "shing-mun-tunnels", "eagles-nest-tunnel"],
    cameras: [
      { id: "TL102F", label: { zh: "大欖隧道元朗入口", en: "Tai Lam Tunnel - Yuen Long Side" } },
      { id: "TL103F", label: { zh: "大欖隧道汀九入口", en: "Tai Lam Tunnel - Ting Kau Side" } },
      { id: "AID03116", label: { zh: "青朗公路近大欖隧道九龍入口（北行）", en: "Tsing Long Hwy near Kowloon Entrance (NB)" } },
      { id: "AID03201", label: { zh: "青朗公路近大欖隧道九龍出口（南行）", en: "Tsing Long Hwy near Kowloon Exit (SB)" } },
    ],
  },
  {
    slug: "western-harbour-crossing",
    registryKey: "whc",
    isFree: false,
    color: "#0891b2",
    lengthKm: 2.0,
    speedLimitKmh: 80,
    shortName: { zh: "西隧", en: "Western Harbour Crossing (WHC)" },
    officialName: { zh: "西區海底隧道", en: "Western Harbour Crossing" },
    seoTitle: {
      zh: "西隧（西區海底隧道）即時交通及收費表 | 三隧分流實時車龍、價錢及路況",
      en: "Western Harbour Crossing (WHC) Live Tolls & Traffic | Time-Varying Rates",
    },
    seoDescription: {
      zh: "即時查看西隧（西區海底隧道）三隧分流不同時段不同收費（私家車 HK$20-$60）、往港島及往九龍實時行車時間、下一個轉價倒數及即時交通鏡頭。",
      en: "Live Western Harbour Crossing (WHC) time-varying tolls ($20-$60), cross-harbour journey times to Hong Kong Island and Kowloon, next rate change countdown, and CCTV.",
    },
    h1: { zh: "西隧（西區海底隧道）即時交通及收費表", en: "Western Harbour Crossing (WHC) Live Tolls & Traffic" },
    connectingRoads: {
      zh: "三號幹線：連接西九龍公路（油麻地、尖沙咀、葵涌及機場方向）與港島西營盤干諾道西／林士街天橋",
      en: "Route 3: Connects West Kowloon Highway (Yau Ma Tei, Kwai Chung, Airport) with Sai Ying Pun and Connaught Road West",
    },
    hkeTollNote: {
      zh: "西區海底隧道實施「易通行」不停車繳費及三隧分流分時段收費，私家車平日繁忙時段最高 HK$60、非繁忙 HK$20；的士全日劃一 HK$25。",
      en: "Uses HKeToll and three-harbour-crossing time-varying tolls: private cars pay HK$20-$60 on weekdays, HK$20-$25 on Sundays/holidays; taxis pay flat HK$25.",
    },
    alternativeRoutes: {
      zh: "若西隧或干諾道西天橋車多，可按實時車龍比較紅磡海底隧道（紅隧）或東區海底隧道（東隧）過海。",
      en: "Compare live cross-harbour journey times against the Cross-Harbour Tunnel (CHT) or Eastern Harbour Crossing (EHC) if West Kowloon approaches back up.",
    },
    siblingSlugs: ["cross-harbour-tunnel", "eastern-harbour-crossing", "tai-lam-tunnel"],
    cameras: [
      { id: "H702F", label: { zh: "西區海底隧道香港入口", en: "Western Harbour Crossing - Hong Kong Side" } },
      { id: "K901F", label: { zh: "西區海底隧道九龍入口", en: "Western Harbour Crossing - Kowloon Side" } },
      { id: "AID04102", label: { zh: "干諾道西天橋近匯港中心（東行）", en: "Connaught Rd West Flyover near WHC (EB)" } },
    ],
  },
  {
    slug: "cross-harbour-tunnel",
    registryKey: "cht",
    isFree: false,
    color: "#dc2626",
    lengthKm: 1.86,
    speedLimitKmh: 70,
    shortName: { zh: "紅隧", en: "Cross-Harbour Tunnel (CHT)" },
    officialName: { zh: "紅磡海底隧道", en: "Cross-Harbour Tunnel" },
    seoTitle: {
      zh: "紅隧（紅磡海底隧道）即時交通及收費表 | 三隧分流實時車龍、價錢及路況",
      en: "Cross-Harbour Tunnel (CHT) Live Tolls & Traffic | Time-Varying Rates",
    },
    seoDescription: {
      zh: "即時查看紅隧（紅磡海底隧道）三隧分流分時段收費（私家車 HK$20-$40）、往港島銅鑼灣及往九龍紅磡實時塞車時間、下次轉價倒數與運輸署即時鏡頭。",
      en: "Check live Cross-Harbour Tunnel (CHT) time-varying tolls ($20-$40), real-time congestion to Hong Kong Island and Kowloon, next toll change countdown, and CCTV.",
    },
    h1: { zh: "紅隧（紅磡海底隧道）即時交通及收費表", en: "Cross-Harbour Tunnel (CHT) Live Tolls & Traffic" },
    connectingRoads: {
      zh: "一號幹線：連接九龍紅磡康莊道／公主道及港島銅鑼灣告士打道／堅拿道天橋（往香港仔隧道）",
      en: "Route 1: Connects Hung Hom (Hong Chong Road / Princess Margaret Road) with Causeway Bay (Gloucester Road / Canal Road Flyover)",
    },
    hkeTollNote: {
      zh: "紅磡海底隧道採用「易通行」自動扣費及三隧分流不同時段不同收費，私家車平日收 HK$20 至 HK$40，的士全日劃一 HK$25，商用車劃一 HK$50。",
      en: "Uses HKeToll contactless payment and time-varying tolls: private cars pay HK$20-$40 on weekdays, taxis flat HK$25, and commercial vehicles flat HK$50.",
    },
    alternativeRoutes: {
      zh: "紅隧繁忙時段經常出現長車龍，往港島西或中環可改行西隧，往港島東或觀塘可改行東隧。",
      en: "During peak congestion at Hung Hom or Causeway Bay, divert via Western Harbour Crossing for Central/West or Eastern Harbour Crossing for Kowloon East/Island East.",
    },
    siblingSlugs: ["western-harbour-crossing", "eastern-harbour-crossing", "aberdeen-tunnel"],
    cameras: [
      { id: "H207F", label: { zh: "海底隧道香港入口", en: "Cross-Harbour Tunnel - Hong Kong Side" } },
      { id: "K107F", label: { zh: "海底隧道九龍入口", en: "Cross-Harbour Tunnel - Kowloon Side" } },
    ],
  },
  {
    slug: "eastern-harbour-crossing",
    registryKey: "ehc",
    isFree: false,
    color: "#ca8a04",
    lengthKm: 2.29,
    speedLimitKmh: 70,
    shortName: { zh: "東隧", en: "Eastern Harbour Crossing (EHC)" },
    officialName: { zh: "東區海底隧道", en: "Eastern Harbour Crossing" },
    seoTitle: {
      zh: "東隧（東區海底隧道）即時交通及收費表 | 三隧分流實時車龍、價錢及路況",
      en: "Eastern Harbour Crossing (EHC) Live Tolls & Traffic | Time-Varying Rates",
    },
    seoDescription: {
      zh: "即時查看東隧（東區海底隧道）三隧分流不同時段不同收費（私家車 HK$20-$40）、往港島鰂魚涌及往九龍茶果嶺實時行車時間、轉價倒數及交通鏡頭。",
      en: "Check live Eastern Harbour Crossing (EHC) time-varying tolls ($20-$40), real-time traffic to Kowloon and Hong Kong Island, next toll change countdown, and CCTV.",
    },
    h1: { zh: "東隧（東區海底隧道）即時交通及收費表", en: "Eastern Harbour Crossing (EHC) Live Tolls & Traffic" },
    connectingRoads: {
      zh: "二號幹線：連接九龍油塘／觀塘繞道／將軍澳－藍田隧道與港島鰂魚涌東區走廊",
      en: "Route 2: Connects Kwun Tong Bypass / Yau Tong / Tseung Kwan O - Lam Tin Tunnel with Quarry Bay (Island Eastern Corridor)",
    },
    hkeTollNote: {
      zh: "東區海底隧道實施「易通行」不停車繳費及三隧分流分時段收費，收費水平與紅隧相同（私家車平日 HK$20-$40，的士 HK$25）。",
      en: "Uses HKeToll contactless tolling and shares the same time-varying schedule as CHT: private cars HK$20-$40 on weekdays, taxis flat HK$25.",
    },
    alternativeRoutes: {
      zh: "如觀塘繞道或東區走廊往東隧擠塞，往港島中區可考慮改經紅隧或西隧過海。",
      en: "If Kwun Tong Bypass or Island Eastern Corridor queues build up, consider Cross-Harbour Tunnel or Western Harbour Crossing for Central/Wan Chai.",
    },
    siblingSlugs: ["western-harbour-crossing", "cross-harbour-tunnel", "tseung-kwan-o-tunnel", "tates-cairn-tunnel"],
    cameras: [
      { id: "K952F", label: { zh: "東區海底隧道九龍入口", en: "Eastern Harbour Crossing - Kowloon Side" } },
      { id: "H803F", label: { zh: "東區走廊近鰂魚涌公園", en: "Island Eastern Corridor near Quarry Bay Park" } },
      { id: "AID04112", label: { zh: "東區走廊近太古城（東行）", en: "Island Eastern Corridor near Taikoo Shing (EB)" } },
    ],
  },
  {
    slug: "tates-cairn-tunnel",
    registryKey: "tates_cairn",
    isFree: false,
    color: "#7c3aed",
    lengthKm: 4.0,
    speedLimitKmh: 70,
    shortName: { zh: "大老山隧道", en: "Tate's Cairn Tunnel" },
    officialName: { zh: "大老山隧道", en: "Tate's Cairn Tunnel" },
    seoTitle: {
      zh: "大老山隧道即時交通及收費表 | 實時車龍、各車種價錢及路況",
      en: "Tate's Cairn Tunnel Live Tolls & Traffic Status | Fixed Rates & Cameras",
    },
    seoDescription: {
      zh: "即時查詢大老山隧道全日固定收費（私家車／的士 HK$20、電單車 HK$15、貨車 HK$24-$28）、往沙田及往九龍實時行車時間、平均車速及即時交通快拍。",
      en: "Check Tate's Cairn Tunnel fixed all-day tolls ($20 private cars/taxis, $15 motorcycles, $24-$28 goods vehicles), live traffic to Sha Tin and Kowloon, and CCTV.",
    },
    h1: { zh: "大老山隧道即時交通及收費表", en: "Tate's Cairn Tunnel Live Tolls & Traffic Status" },
    connectingRoads: {
      zh: "二號幹線：連接九龍鑽石山／觀塘繞道與沙田石門、馬鞍山及大埔（吐露港公路）",
      en: "Route 2: Connects Diamond Hill / Kwun Tong Bypass in Kowloon East with Sha Tin, Ma On Shan, and Tai Po",
    },
    hkeTollNote: {
      zh: "大老山隧道使用「易通行」不停車繳費，全日收取固定費用，不設分時段收費：私家車及的士 HK$20、電單車 HK$15、輕型貨車 HK$24、中／重型貨車 HK$28。",
      en: "Uses HKeToll with flat all-day tolls: private cars and taxis HK$20, motorcycles HK$15, LGV HK$24, MGV/HGV HK$28.",
    },
    alternativeRoutes: {
      zh: "大老山隧道往九龍或沙田繁忙時段如見車龍，可改行獅子山隧道（HK$8）或青沙管制區尖山隧道（HK$8）。",
      en: "When Tate's Cairn Tunnel queues extend toward Sha Tin or Diamond Hill, consider Lion Rock Tunnel (HK$8) or Eagle's Nest Tunnel (HK$8).",
    },
    siblingSlugs: ["lion-rock-tunnel", "eagles-nest-tunnel", "shing-mun-tunnels", "eastern-harbour-crossing"],
    cameras: [
      { id: "K931F", label: { zh: "大老山隧道九龍入口", en: "Tate's Cairn Tunnel - Kowloon Side" } },
      { id: "ST942F", label: { zh: "大老山隧道沙田入口", en: "Tate's Cairn Tunnel - Sha Tin Side" } },
      { id: "AID02118", label: { zh: "大老山隧道近收費廣場（北行）", en: "Tate's Cairn Tunnel near Toll Plaza (NB)" } },
    ],
  },
  {
    slug: "lion-rock-tunnel",
    registryKey: "lion_rock",
    isFree: false,
    color: "#e11d48",
    lengthKm: 1.4,
    speedLimitKmh: 70,
    shortName: { zh: "獅子山隧道", en: "Lion Rock Tunnel" },
    officialName: { zh: "獅子山隧道", en: "Lion Rock Tunnel" },
    seoTitle: {
      zh: "獅子山隧道即時交通及收費表 | 獅隧實時車龍、HK$8 收費及路況",
      en: "Lion Rock Tunnel Live Tolls & Traffic Status | Flat $8 Rate & Cameras",
    },
    seoDescription: {
      zh: "即時查看獅子山隧道（獅隧）所有車種全日劃一 HK$8 收費、往沙田及往九龍窩打老道實時車龍行車時間、平均車速與運輸署即時鏡頭。",
      en: "Check live Lion Rock Tunnel traffic to Sha Tin and Kowloon, flat HK$8 toll for all vehicles, average speed, and official Transport Department CCTV snapshots.",
    },
    h1: { zh: "獅子山隧道（獅隧）即時交通及收費表", en: "Lion Rock Tunnel Live Tolls & Traffic Status" },
    connectingRoads: {
      zh: "一號幹線：連接九龍塘窩打老道／龍翔道與沙田獅子山隧道公路及大圍",
      en: "Route 1: Connects Kowloon Tong (Waterloo Road / Lung Cheung Road) with Sha Tin and Tai Wai",
    },
    hkeTollNote: {
      zh: "獅子山隧道已實施「易通行」不停車繳費，所有車輛類型全日劃一收費 HK$8。",
      en: "Uses HKeToll contactless payment with a flat HK$8 toll all day for all vehicle classes.",
    },
    alternativeRoutes: {
      zh: "獅隧在上下班高峰期容易塞車，往西九龍可改用尖山隧道（青沙公路，同為 HK$8），往東九龍可改用大老山隧道（HK$20）。",
      en: "During rush hour, divert via Eagle's Nest Tunnel / Tsing Sha Control Area (HK$8) for West Kowloon or Tate's Cairn Tunnel (HK$20) for East Kowloon.",
    },
    siblingSlugs: ["tates-cairn-tunnel", "eagles-nest-tunnel", "shing-mun-tunnels"],
    cameras: [
      { id: "AID01123", label: { zh: "獅子山隧道公路近九龍入口（北行）", en: "Lion Rock Tunnel Rd near Kowloon Entrance (NB)" } },
      { id: "AID01124", label: { zh: "獅子山隧道公路近收費廣場（北行）", en: "Lion Rock Tunnel Rd near Toll Plaza (NB)" } },
      { id: "ST922F", label: { zh: "獅子山隧道公路近紅梅谷路", en: "Lion Rock Tunnel Rd near Hung Mui Kuk Rd" } },
      { id: "K502F", label: { zh: "窩打老道／歌和老街", en: "Waterloo Road / Cornwall Street" } },
    ],
  },
  {
    slug: "aberdeen-tunnel",
    registryKey: "aberdeen",
    isFree: false,
    color: "#2563eb",
    lengthKm: 1.9,
    speedLimitKmh: 70,
    shortName: { zh: "香港仔隧道", en: "Aberdeen Tunnel" },
    officialName: { zh: "香港仔隧道", en: "Aberdeen Tunnel" },
    seoTitle: {
      zh: "香港仔隧道即時交通及收費表 | 實時車龍、HK$8 收費及路況",
      en: "Aberdeen Tunnel Live Tolls & Traffic Status | Flat $8 Rate & Cameras",
    },
    seoDescription: {
      zh: "即時查看香港仔隧道全日劃一 HK$8 收費（所有車種）、往灣仔／跑馬地及往香港仔／黃竹坑實時行車時間、塞車狀況與即時交通快拍。",
      en: "Check Aberdeen Tunnel live traffic to Wan Chai and Aberdeen, flat HK$8 toll for all vehicles, journey times, and Transport Department CCTV snapshots.",
    },
    h1: { zh: "香港仔隧道即時交通及收費表", en: "Aberdeen Tunnel Live Tolls & Traffic Status" },
    connectingRoads: {
      zh: "一號幹線：連接港島南區黃竹坑／香港仔與灣仔堅拿道天橋及跑馬地",
      en: "Route 1: Connects Wong Chuk Hang / Aberdeen in Southern District with Wan Chai (Canal Road Flyover) and Happy Valley",
    },
    hkeTollNote: {
      zh: "香港仔隧道使用「易通行」不停車繳費，所有車輛類型全日劃一收費 HK$8。",
      en: "Uses HKeToll contactless tolling with a flat HK$8 toll all day for all vehicle classes.",
    },
    alternativeRoutes: {
      zh: "如香港仔隧道北行（往灣仔／紅隧）間歇性封閉或擠塞，可改經薄扶林道或南風道／深水灣道繞道往市區。",
      en: "If intermittent closures or queues affect northbound traffic toward Wan Chai, alternative routes include Pok Fu Lam Road or Nam Fung Road.",
    },
    siblingSlugs: ["cross-harbour-tunnel", "western-harbour-crossing", "eastern-harbour-crossing"],
    cameras: [
      { id: "H210F", label: { zh: "香港仔隧道灣仔入口", en: "Aberdeen Tunnel - Wan Chai Side" } },
      { id: "H421F", label: { zh: "香港仔隧道香港仔入口", en: "Aberdeen Tunnel - Aberdeen Side" } },
      { id: "H401F", label: { zh: "黃竹坑道近香港仔隧道", en: "Wong Chuk Hang Road near Aberdeen Tunnel" } },
    ],
  },
  {
    slug: "shing-mun-tunnels",
    registryKey: "shing_mun",
    isFree: false,
    color: "#059669",
    lengthKm: 2.6,
    speedLimitKmh: 70,
    shortName: { zh: "城門隧道", en: "Shing Mun Tunnels" },
    officialName: { zh: "城門隧道", en: "Shing Mun Tunnels" },
    seoTitle: {
      zh: "城門隧道即時交通及收費表 | 城隧實時車龍、HK$8 收費及路況",
      en: "Shing Mun Tunnels Live Tolls & Traffic Status | Flat $8 Rate & Cameras",
    },
    seoDescription: {
      zh: "即時查看城門隧道（城隧）全日劃一 HK$8 收費、往沙田及往荃灣象鼻山路實時行車時間、平均車速及運輸署實時交通鏡頭。",
      en: "Check live Shing Mun Tunnels traffic between Sha Tin and Tsuen Wan, flat HK$8 toll for all vehicles, average speed, and official CCTV snapshots.",
    },
    h1: { zh: "城門隧道（城隧）即時交通及收費表", en: "Shing Mun Tunnels Live Tolls & Traffic Status" },
    connectingRoads: {
      zh: "九號幹線：連接荃灣象鼻山路（往葵涌、青衣、屯門）與沙田大圍及沙田市中心",
      en: "Route 9: Connects Cheung Pei Shan Road in Tsuen Wan with Tai Wai and Sha Tin Town Centre",
    },
    hkeTollNote: {
      zh: "城門隧道已實施「易通行」不停車繳費，所有車輛類型全日劃一收費 HK$8。",
      en: "Uses HKeToll contactless tolling with a flat HK$8 toll all day for all vehicle classes.",
    },
    alternativeRoutes: {
      zh: "如城門隧道往荃灣或沙田擠塞，可考慮經青沙公路（尖山隧道，HK$8）再接長青隧道或呈祥道繞行。",
      en: "When congested between Tsuen Wan and Sha Tin, drivers can divert via Tsing Sha Highway (Eagle's Nest Tunnel, HK$8) and Ching Cheung Road.",
    },
    siblingSlugs: ["eagles-nest-tunnel", "lion-rock-tunnel", "tates-cairn-tunnel", "tai-lam-tunnel"],
    cameras: [
      { id: "SM934F", label: { zh: "城門隧道沙田入口", en: "Shing Mun Tunnel - Sha Tin Side" } },
      { id: "SM933F", label: { zh: "城門隧道公路", en: "Shing Mun Tunnel Road" } },
      { id: "SM936F", label: { zh: "象鼻山路（荃灣入口）", en: "Cheung Pei Shan Road (Tsuen Wan Side)" } },
    ],
  },
  {
    slug: "eagles-nest-tunnel",
    registryKey: "eagles_nest",
    isFree: false,
    color: "#0d9488",
    lengthKm: 3.8,
    speedLimitKmh: 80,
    shortName: { zh: "尖山隧道", en: "Eagle's Nest Tunnel" },
    officialName: {
      zh: "尖山隧道及沙田嶺隧道（青沙管制區）",
      en: "Eagle's Nest Tunnel & Sha Tin Heights Tunnel (Tsing Sha Control Area)",
    },
    seoTitle: {
      zh: "尖山隧道及沙田嶺隧道（青沙管制區）即時交通及收費表 | HK$8 收費及路況",
      en: "Eagle's Nest Tunnel (Tsing Sha Control Area) Live Tolls & Traffic | Flat $8",
    },
    seoDescription: {
      zh: "即時查看尖山隧道及沙田嶺隧道（青沙管制區／青沙公路）全日劃一 HK$8 收費、往九龍荔枝角及往沙田實時路況、行車時間與交通鏡頭。",
      en: "Check live Eagle's Nest & Sha Tin Heights Tunnel (Tsing Sha Control Area) traffic, flat HK$8 toll for all vehicles, journey times, and TD CCTV snapshots.",
    },
    h1: {
      zh: "尖山隧道及沙田嶺隧道（青沙管制區）即時交通及收費表",
      en: "Eagle's Nest Tunnel & Sha Tin Heights Tunnel Live Tolls & Traffic",
    },
    connectingRoads: {
      zh: "八號幹線（青沙公路）：連接西九龍／荔枝角／昂船洲大橋（往機場）與沙田大圍及大埔公路",
      en: "Route 8 (Tsing Sha Highway): Connects West Kowloon / Lai Chi Kok / Stonecutters Bridge with Tai Wai and Sha Tin",
    },
    hkeTollNote: {
      zh: "青沙管制區（尖山隧道及沙田嶺隧道）是全港首條實施「易通行」不停車繳費的隧道，所有車輛類型全日劃一收費 HK$8。",
      en: "Tsing Sha Control Area (Eagle's Nest & Sha Tin Heights Tunnels) uses HKeToll contactless payment with a flat HK$8 toll for all vehicle classes.",
    },
    alternativeRoutes: {
      zh: "青沙公路一般較獅子山隧道暢通，如遇突發事故擠塞，往沙田及九龍可改行獅子山隧道（HK$8）或城門隧道（HK$8）。",
      en: "Typically less congested than Lion Rock Tunnel; if incidents occur, divert via Lion Rock Tunnel (HK$8) or Shing Mun Tunnels (HK$8).",
    },
    siblingSlugs: ["lion-rock-tunnel", "tates-cairn-tunnel", "shing-mun-tunnels", "tai-lam-tunnel"],
    cameras: [
      { id: "TS104F", label: { zh: "青沙公路近荔枝角", en: "Tsing Sha Highway near Lai Chi Kok" } },
      { id: "TS105F", label: { zh: "沙田嶺隧道沙田入口", en: "Sha Tin Heights Tunnel - Sha Tin Side" } },
      { id: "AID03114", label: { zh: "西九龍公路近青沙公路（北行）", en: "West Kowloon Hwy near Tsing Sha Hwy (NB)" } },
    ],
  },
  {
    slug: "tseung-kwan-o-tunnel",
    registryKey: null,
    isFree: true,
    color: "#0284c7",
    lengthKm: 0.9,
    speedLimitKmh: 70,
    shortName: { zh: "將軍澳隧道", en: "Tseung Kwan O Tunnel" },
    officialName: { zh: "將軍澳隧道", en: "Tseung Kwan O Tunnel" },
    seoTitle: {
      zh: "將軍澳隧道即時交通及收費表 | HK$0 免費通行、實時車龍及路況",
      en: "Tseung Kwan O Tunnel Live Traffic & Tolls | Free (HK$0) & CCTV Cameras",
    },
    seoDescription: {
      zh: "將軍澳隧道已全面豁免收費（所有車種 HK$0 免費）。即時查詢將軍澳隧道往九龍觀塘實時車龍行車時間、運輸署即時交通鏡頭及將藍隧道替代路線。",
      en: "Tseung Kwan O Tunnel is toll-free (HK$0 for all vehicles). Check live journey time toward Kowloon, official TD traffic camera snapshots, and Tseung Kwan O - Lam Tin Tunnel alternatives.",
    },
    h1: { zh: "將軍澳隧道即時交通及收費（HK$0 免費）", en: "Tseung Kwan O Tunnel Live Traffic & Toll Info (HK$0 Free)" },
    connectingRoads: {
      zh: "七號幹線：連接將軍澳寶琳／坑口／將軍澳市中心與九龍觀塘及秀茂坪（將軍澳道）",
      en: "Route 7: Connects Tseung Kwan O (Po Lam, Hang Hau, Town Centre) with Kwun Tong and Sau Mau Ping (Tseung Kwan O Road)",
    },
    hkeTollNote: {
      zh: "將軍澳隧道自 2022 年 12 月 11 日起已永久豁免隧道費，所有車輛類型全日 HK$0 免費通行，無須透過「易通行」繳費。",
      en: "Tseung Kwan O Tunnel has been permanently toll-free (HK$0 for all vehicle classes) since 11 December 2022; no HKeToll fee is charged.",
    },
    alternativeRoutes: {
      zh: "如將軍澳隧道往觀塘方向擠塞，可使用同為免費的將軍澳－藍田隧道（將藍隧道）直達茶果嶺、東隧及觀塘繞道。",
      en: "When westbound queues build up toward Kwun Tong, use the toll-free Tseung Kwan O - Lam Tin Tunnel directly connecting to Cha Kwo Ling, EHC, and Kwun Tong Bypass.",
    },
    siblingSlugs: ["eastern-harbour-crossing", "tates-cairn-tunnel", "cross-harbour-tunnel"],
    cameras: [
      { id: "TK904F", label: { zh: "將軍澳隧道將軍澳入口", en: "Tseung Kwan O Tunnel - Tseung Kwan O Side" } },
      { id: "AID07104", label: { zh: "將軍澳隧道公路近隧道入口（西行）", en: "Tseung Kwan O Tunnel Rd near Portal (WB)" } },
      { id: "AID07229", label: { zh: "將軍澳隧道公路近隧道入口（東行）", en: "Tseung Kwan O Tunnel Rd near Portal (EB)" } },
      { id: "K811F", label: { zh: "將軍澳道近翠屏南邨（觀塘側）", en: "Tseung Kwan O Rd near Tsui Ping South (Kwun Tong)" } },
    ],
    extraRoutes: [
      {
        direction: "toKowloon",
        speedLimitKmh: 70,
        indicators: [
          { loc: "N08", dest: "TKOT", approachMinutes: 2 },
          { loc: "N09", dest: "TKOT", approachMinutes: 2 },
          { loc: "N10", dest: "TKOT", approachMinutes: 2 },
        ],
      },
    ],
  },
];

export const TUNNEL_DETAIL_BY_SLUG: Record<string, TunnelDetailConfig> = Object.fromEntries(
  TUNNEL_DETAILS.map((item) => [item.slug, item]),
);

export const TUNNEL_SLUG_BY_REGISTRY_KEY: Record<HKTunnelIdentifier, string> = {
  whc: "western-harbour-crossing",
  cht: "cross-harbour-tunnel",
  ehc: "eastern-harbour-crossing",
  tai_lam: "tai-lam-tunnel",
  tates_cairn: "tates-cairn-tunnel",
  aberdeen: "aberdeen-tunnel",
  shing_mun: "shing-mun-tunnels",
  lion_rock: "lion-rock-tunnel",
  eagles_nest: "eagles-nest-tunnel",
};

export const FREE_GOVERNMENT_TUNNELS: FreeTunnelEntry[] = [
  {
    slug: "tseung-kwan-o-tunnel",
    name: { zh: "將軍澳隧道", en: "Tseung Kwan O Tunnel" },
    connectingRoads: { zh: "將軍澳 ↔ 觀塘（七號幹線）", en: "Tseung Kwan O ↔ Kwun Tong (Route 7)" },
    note: { zh: "2022 年起全面免費，可查看實時路況及鏡頭", en: "Toll-free since Dec 2022; live traffic & CCTV available" },
  },
  {
    name: { zh: "將軍澳－藍田隧道", en: "Tseung Kwan O - Lam Tin Tunnel" },
    connectingRoads: { zh: "將軍澳跨灣連接路 ↔ 茶果嶺／東隧", en: "Tseung Kwan O Cross Bay Link ↔ Cha Kwo Ling / EHC" },
    note: { zh: "將軍澳隧道主要免費替代路線", en: "Main free alternative to Tseung Kwan O Tunnel" },
  },
  {
    name: { zh: "啟德隧道", en: "Kai Tak Tunnel" },
    connectingRoads: { zh: "九龍灣 ↔ 土瓜灣／紅磡（五號幹線）", en: "Kowloon Bay ↔ To Kwa Wan / Hung Hom (Route 5)" },
    note: { zh: "前稱機場隧道，全日免費通行", en: "Formerly Airport Tunnel, toll-free all day" },
  },
  {
    name: { zh: "長青隧道", en: "Cheung Ching Tunnel" },
    connectingRoads: { zh: "青衣 ↔ 葵涌（三號幹線）", en: "Tsing Yi ↔ Kwai Chung (Route 3)" },
    note: { zh: "往來機場及新界西北主要免費幹線隧道", en: "Free strategic Route 3 tunnel toward Airport & NW NT" },
  },
  {
    name: { zh: "南灣隧道", en: "Nam Wan Tunnel" },
    connectingRoads: { zh: "昂船洲大橋 ↔ 青衣西北交匯處（八號幹線）", en: "Stonecutters Bridge ↔ NW Tsing Yi Interchange (Route 8)" },
    note: { zh: "青沙公路往機場方向免費路段", en: "Free Route 8 section linking Tsing Sha Hwy to Airport" },
  },
  {
    name: { zh: "中環及灣仔繞道隧道", en: "Central - Wan Chai Bypass Tunnel" },
    connectingRoads: { zh: "中環林士街天橋 ↔ 北角東區走廊（四號幹線）", en: "Central Rumsey St Flyover ↔ North Point IEC (Route 4)" },
    note: { zh: "繞過中環及銅鑼灣地面道路，全日免費", en: "Bypasses Central & Causeway Bay surface roads, toll-free" },
  },
  {
    name: { zh: "屯門－赤鱲角隧道", en: "Tuen Mun - Chek Lap Kok Tunnel" },
    connectingRoads: { zh: "屯門第 40 區 ↔ 港珠澳大橋香港口岸／機場", en: "Tuen Mun Area 40 ↔ HZMB HK Port / Airport" },
    note: { zh: "往來新界西北與機場最快捷免費海底隧道", en: "Fastest toll-free subsea link between Tuen Mun & Airport" },
  },
  {
    name: { zh: "龍山隧道／長山隧道", en: "Lung Shan Tunnel / Cheung Shan Tunnel" },
    connectingRoads: { zh: "粉嶺公路 ↔ 香園圍邊境管制站（香園圍公路）", en: "Fanling Highway ↔ Heung Yuen Wai Boundary Control Point" },
    note: { zh: "香港最長陸上行車隧道（龍山隧道），全日免費", en: "Hong Kong's longest land road tunnel (Lung Shan), toll-free" },
  },
];

export const HUB_FAQ_ITEMS: FaqItem[] = [
  {
    question: {
      zh: "「過渡時段」點樣計費？",
      en: "How are tolls calculated during the Transition Period?",
    },
    answer: {
      zh: "在三隧分流及大欖隧道的「不同時段不同收費」安排下，過渡時段內私家車隧道費每 2 分鐘遞增或遞減 HK$2，電單車則每 2 分鐘調整 HK$0.8（為私家車收費的 40%），讓收費平穩過渡至下一個時段，避免駕駛者臨近轉價時減速或加速。",
      en: "Under Hong Kong's time-varying toll scheme (three cross-harbour tunnels and Tai Lam Tunnel), private car tolls step up or down by HK$2 every 2 minutes during transition periods, while motorcycle tolls adjust by HK$0.8 every 2 minutes (40% of private car tolls) to ensure smooth traffic flow.",
    },
  },
  {
    question: {
      zh: "過海的士隧道費係 HK$25 定 HK$50？",
      en: "Is the cross-harbour taxi tunnel toll HK$25 or HK$50?",
    },
    answer: {
      zh: "三條過海隧道（西區海底隧道、紅磡海底隧道、東區海底隧道）的士收費全日劃一 HK$25。如乘客於「過海的士站」上車，只需付單程 HK$25 隧道費；如於一般街道或非過海的士站上車，須支付去程及回程隧道費合共 HK$50。",
      en: "All three cross-harbour tunnels (WHC, CHT, and EHC) charge a flat HK$25 all day for taxis. Passengers boarding at a designated cross-harbour taxi stand pay the single-way HK$25 toll, while trips starting elsewhere incur both outbound and return tolls totaling HK$50.",
    },
  },
  {
    question: {
      zh: "冇裝「易通行」車輛貼點補交？逾期罰幾多？",
      en: "How do I pay HKeToll without a vehicle tag, and what are the late surcharges?",
    },
    answer: {
      zh: "未安裝「易通行」車輛貼的車主，須在駛經收費隧道後的 14 個工作天內，透過「易通行」網站、手機應用程式或便利店補交隧道費。逾期繳費將被徵收首筆 HK$175 逾期附加費；若於指定限期內仍未繳清，會被加徵額外 HK$350 附加費（合共 HK$525）並可能面臨檢控。",
      en: "Drivers without an HKeToll vehicle tag must settle the toll within 14 business days via the HKeToll website, mobile app, or convenience stores. Late payment incurs an initial HK$175 surcharge, and failing to pay within the further deadline adds an extra HK$350 surcharge (HK$525 total).",
    },
  },
  {
    question: {
      zh: "星期六同公眾假期點計收費？",
      en: "How do tunnel tolls apply on Saturdays and public holidays?",
    },
    answer: {
      zh: "星期六（如非公眾假期）按「星期一至六」平日分時段收費表計算，設有繁忙、一般及非繁忙時段；公眾假期（即使適逢星期一至六）則按「星期日及公眾假期」較優惠收費表計算（三隧私家車 HK$20-$25，大欖隧道全日劃一 HK$18）。",
      en: "Saturdays (when not a public holiday) follow the Monday-to-Saturday time-varying weekday schedule with Peak, Regular, and Off-Peak rates. General public holidays follow the cheaper Sunday and Public Holiday schedule (HK$20-$25 for cross-harbour tunnels; flat HK$18 all day for Tai Lam Tunnel).",
    },
  },
];

export function getTunnelPagePath(slug: string, lang: string): string {
  return lang === "zh" ? `/zh/hk-tunnels-tolls/${slug}/` : `/hk-tunnels-tolls/${slug}/`;
}

export function getHubPagePath(lang: string): string {
  return lang === "zh" ? "/zh/hk-tunnels-tolls/" : "/hk-tunnels-tolls/";
}
