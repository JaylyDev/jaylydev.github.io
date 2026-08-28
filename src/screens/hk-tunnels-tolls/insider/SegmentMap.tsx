import React, { useEffect, useRef, useState, useMemo } from "react";
import registryInfo from "../data/registry.insider.json";
import { TranslateFunction } from "@/locale/i18n";
import "leaflet/dist/leaflet.css";

type LocalizedString = string | { id: string };

type HKTunnelIdentifier = keyof typeof registryInfo.tunnels;

function resolveLocalizedString(value: LocalizedString, t: TranslateFunction): string {
  if (typeof value === "string") return value;
  return t(value.id);
}

interface IrnSegmentWithRoute {
  id: string;
  name: string;
  type: "approach" | "bore";
  path: [number, number][];
  tunnelKey: HKTunnelIdentifier;
  tunnelName: LocalizedString;
  tunnelColor: string;
  direction: string;
  speedLimitKmh: number;
}

interface SegmentMapProps {
  irnSpeeds: Record<string, number> | null;
  t: TranslateFunction;
  selectedTunnelKey?: HKTunnelIdentifier | "all";
}

function getSegmentColor(speed: number | null, limit: number): string {
  if (speed === null || speed <= 0) return "#9ca3af";
  if (speed >= limit * 0.75) return "#16a34a";
  if (speed >= limit * 0.4) return "#d97706";
  return "#dc2626";
}

export default function SegmentMap({ irnSpeeds, t, selectedTunnelKey: initialTunnel = "all" }: SegmentMapProps): JSX.Element {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const layerGroupRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [selectedTunnel, setSelectedTunnel] = useState<HKTunnelIdentifier | "all">(initialTunnel);

  const allSegments = useMemo(() => {
    const list: IrnSegmentWithRoute[] = [];
    const seen = new Set<string>();

    (Object.entries(registryInfo.tunnels) as [HKTunnelIdentifier, (typeof registryInfo.tunnels)[HKTunnelIdentifier]][]).forEach(([tKey, tunnel]) => {
      const tunnelAny = tunnel as Record<string, unknown>;
      const limit = (typeof tunnelAny.maxLegalSpeedKmh === "number" ? tunnelAny.maxLegalSpeedKmh : 70);
      const routes = Array.isArray(tunnelAny.journeyRoutes) ? (tunnelAny.journeyRoutes as Record<string, unknown>[]) : [];
      
      routes.forEach((route) => {
        const routeLimit = typeof route.speedLimitKmh === "number" ? route.speedLimitKmh : limit;
        const direction = typeof route.direction === "string" ? route.direction : "unknown";
        const irnSegs = Array.isArray(route.irnSegments) ? (route.irnSegments as Record<string, unknown>[]) : [];
        
        irnSegs.forEach((seg) => {
          const id = String(seg.id);
          const name = String(seg.name || "");
          const type = (seg.type === "bore" ? "bore" : "approach") as "approach" | "bore";
          const path = Array.isArray(seg.path) ? (seg.path as [number, number][]) : [];
          if (path.length === 0) return;
          
          const key = `${tKey}-${direction}-${id}`;
          if (!seen.has(key)) {
            seen.add(key);
            list.push({
              id,
              name,
              type,
              path,
              tunnelKey: tKey,
              tunnelName: tunnel.name as LocalizedString,
              tunnelColor: tunnel.color,
              direction,
              speedLimitKmh: routeLimit,
            });
          }
        });
      });
    });
    return list;
  }, []);

  const visibleSegments = useMemo(() => {
    if (selectedTunnel === "all") return allSegments;
    return allSegments.filter((s) => s.tunnelKey === selectedTunnel);
  }, [allSegments, selectedTunnel]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [22.3193, 114.1694],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    import("leaflet").then((L) => {
      layerGroup.clearLayers();

      const allLatLngs: [number, number][] = [];

      visibleSegments.forEach((seg) => {
        const speed = irnSpeeds && typeof irnSpeeds[seg.id] === "number" ? Math.round(irnSpeeds[seg.id]) : null;
        const color = getSegmentColor(speed, seg.speedLimitKmh);
        const isApproach = seg.type === "approach";

        const polyline = L.polyline(seg.path, {
          color,
          weight: isApproach ? 6 : 7,
          opacity: 0.9,
        });

        // Tooltip on hover
        polyline.bindTooltip(
          `<b>#${seg.id}</b> ${seg.name ? `(${seg.name})` : ""}: <b>${speed != null ? `${speed} km/h` : "N/A"}</b> (${isApproach ? "500m Approach" : "Bore"})`,
          { sticky: true }
        );

        // Detailed popup on click
        const popupContent = `
          <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 2px;">
              Segment #${seg.id}
            </div>
            <div style="color: #666; margin-bottom: 4px;">${seg.name}</div>
            <div><b>Tunnel:</b> ${resolveLocalizedString(seg.tunnelName, t)}</div>
            <div><b>Direction:</b> ${t(`direction.${seg.direction}`)}</div>
            <div><b>Zone:</b> ${isApproach ? "500m Approach Ramp" : "Tunnel Bore"}</div>
            <div><b>Speed Limit:</b> ${seg.speedLimitKmh} km/h</div>
            <div style="margin-top: 4px; font-weight: bold; color: ${color};">
              <b>Live Speed:</b> ${speed != null ? `${speed} km/h` : "No speed data"}
            </div>
          </div>
        `;
        polyline.bindPopup(popupContent);

        allLatLngs.push(...seg.path);
        layerGroup.addLayer(polyline);
      });

      if (allLatLngs.length > 0) {
        if (selectedTunnel !== "all") {
          const bounds = L.latLngBounds(allLatLngs);
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
        } else {
          map.setView([22.3193, 114.1694], 12);
        }
      }
    });
  }, [visibleSegments, irnSpeeds, selectedTunnel, t]);

  return (
    <div className="card-base-min mb-6 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/20 dark:border-white/20 pb-2">
        <h3 className="text-xl md:text-lg font-semibold flex items-center gap-2">
          <span>🗺️</span>
          <span>IRN Traffic Network Map</span>
        </h3>
        <div className="flex items-center gap-2">
          <label htmlFor="tunnel-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tunnel:
          </label>
          <select
            id="tunnel-filter"
            value={selectedTunnel}
            onChange={(e) => setSelectedTunnel(e.target.value as HKTunnelIdentifier | "all")}
            className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-2.5 py-1 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Tunnels</option>
            {(Object.entries(registryInfo.tunnels) as [HKTunnelIdentifier, (typeof registryInfo.tunnels)[HKTunnelIdentifier]][]).map(([key, tunnel]) => (
              <option key={key} value={key}>
                {resolveLocalizedString(tunnel.name as LocalizedString, t)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className="w-full h-[450px] md:h-[500px] rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden shadow-inner relative z-0"
        style={{ minHeight: "450px" }}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded border border-gray-200 dark:border-gray-800 font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-gray-700 dark:text-gray-300">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-green-600 inline-block" /> Smooth (≥75% limit)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" /> Slow (40–75% limit)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 inline-block" /> Congested (&lt;40% limit)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-gray-400 inline-block" /> No Speed Data
          </span>
        </div>
      </div>
    </div>
  );
}
