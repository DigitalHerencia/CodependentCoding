"use client";

import { Maximize2, Minus, Plus, Search } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type {
  ArchitectureModule,
  ArchitectureZone,
} from "@/lib/content/template-architecture";

/** The system view aggregates real imports; detail views expose their file endpoints. */
export type MapView = "system" | "crm" | "read" | "write" | "focus";

type GraphModule = ArchitectureModule;
type Box = { x: number; y: number; width: number; height: number };
type Viewport = Box;
type PositionedFile = Box & { path: string; zone: ArchitectureZone };
type PositionedZone = Box & {
  zone: ArchitectureZone;
  count: number;
  shown: number;
  expanded: boolean;
};
type GraphEdge = {
  source: string;
  target: string;
  count: number;
  emphasis: boolean;
};

const ZONES: readonly {
  id: ArchitectureZone;
  title: string;
  subtitle: string;
}[] = [
  { id: "routes", title: "01 / ROUTES", subtitle: "Entry points and HTTP boundaries" },
  { id: "features", title: "02 / FEATURES", subtitle: "Feature-level composition" },
  { id: "presentation", title: "03 / PRESENTATION", subtitle: "Templates, blocks, UI primitives" },
  { id: "application", title: "04 / APPLICATION", subtitle: "Workflows, fetchers, actions" },
  { id: "contracts", title: "05 / CONTRACTS", subtitle: "Types, schemas, shared modules" },
  { id: "persistence", title: "06 / PERSISTENCE", subtitle: "Selects, DTOs, transactions, Prisma" },
];

const READ_PATHS = [
  "app/(tenant)/crm/accounts/page.tsx",
  "features/crm/crmAccountsFeature.tsx",
  "lib/workflows/crmWorkflows.ts",
  "lib/fetchers/crmFetchers.ts",
  "lib/db/selects/crmSelects.ts",
  "lib/db/dtos/crmDtos.ts",
  "components/templates/crm-templates.tsx",
  "components/blocks/crm-blocks.tsx",
];
const WRITE_PATHS = [
  "app/(tenant)/crm/accounts/[accountId]/edit/page.tsx",
  "features/crm/crmEditAccountFeature.tsx",
  "features/crm/crmEditAccountForm.tsx",
  "lib/workflows/crmWorkflows.ts",
  "lib/actions/crmActions.ts",
  "lib/db/tenancy.ts",
  "lib/db/dtos/crmDtos.ts",
];

function shortName(file: string, length = 37): string {
  const name = file.split("/").at(-1) ?? file;
  return name.length > length ? name.slice(0, length - 1) + "…" : name;
}

function getSelectedPaths(
  modules: readonly GraphModule[],
  view: MapView,
  active: string,
  focusZone: ArchitectureZone | null,
): Set<string> {
  const byPath = new Map(modules.map((module) => [module.path, module]));
  const inbound = new Map<string, string[]>();
  for (const module of modules) {
    for (const dependency of module.imports) {
      if (!byPath.has(dependency)) continue;
      const neighbors = inbound.get(dependency) ?? [];
      neighbors.push(module.path);
      inbound.set(dependency, neighbors);
    }
  }

  let seeds: string[];
  if (view === "crm") {
    seeds = modules.filter((module) => /crm/i.test(module.path)).map((module) => module.path);
  } else if (view === "read") {
    seeds = READ_PATHS.filter((file) => byPath.has(file));
  } else if (view === "write") {
    seeds = WRITE_PATHS.filter((file) => byPath.has(file));
  } else if (focusZone) {
    seeds = modules
      .filter((module) => module.zone === focusZone)
      .sort((a, b) => b.imports.length - a.imports.length)
      .slice(0, 24)
      .map((module) => module.path);
  } else {
    seeds = byPath.has(active) ? [active] : modules.slice(0, 1).map((module) => module.path);
  }

  const limit = view === "crm" ? 120 : focusZone ? 80 : view === "focus" ? 55 : 72;
  const selected = new Set(seeds.slice(0, limit));
  const direct = new Set<string>();

  for (const seed of seeds) {
    const module = byPath.get(seed);
    if (!module) continue;
    module.imports.forEach((dependency) => direct.add(dependency));
    (inbound.get(seed) ?? []).forEach((importer) => direct.add(importer));
  }

  // Add connected neighbors without manufacturing any relationships.
  for (const file of direct) {
    if (selected.size >= limit) break;
    if (byPath.has(file)) selected.add(file);
  }

  return selected;
}

function graphLayout(
  modules: readonly GraphModule[],
  selected: ReadonlySet<string>,
  expanded: ReadonlySet<ArchitectureZone>,
  overview: boolean,
): {
  zones: PositionedZone[];
  files: PositionedFile[];
  edges: GraphEdge[];
  width: number;
  height: number;
} {
  const groups = new Map<ArchitectureZone, GraphModule[]>();
  for (const zone of ZONES) groups.set(zone.id, []);
  for (const module of modules) {
    if (overview || selected.has(module.path)) {
      groups.get(module.zone)?.push(module);
    }
  }

  const zoneRects: PositionedZone[] = [];
  const fileRects: PositionedFile[] = [];
  const zoneById = new Map<ArchitectureZone, PositionedZone>();
  const fileByPath = new Map<string, PositionedFile>();
  const columnWidth = 370;
  const columns = [46, 496, 946];
  const firstRow = ZONES.slice(0, 3);
  const secondRow = ZONES.slice(3);

  function appendRow(
    row: typeof ZONES,
    top: number,
  ): number {
    let maximum = 0;
    row.forEach((zone, column) => {
      const entries = groups.get(zone.id) ?? [];
      const isExpanded = !overview && expanded.has(zone.id);
      const shown = isExpanded ? Math.min(14, entries.length) : 0;
      const height = isExpanded ? Math.max(118, 89 + shown * 39) : 165;
      const rectangle: PositionedZone = {
        zone: zone.id,
        x: columns[column] ?? 46,
        y: top,
        width: columnWidth,
        height,
        count: entries.length,
        shown,
        expanded: isExpanded,
      };
      maximum = Math.max(maximum, height);
      zoneRects.push(rectangle);
      zoneById.set(zone.id, rectangle);

      if (!isExpanded) return;
      entries.slice(0, shown).forEach((module, index) => {
        const file: PositionedFile = {
          path: module.path,
          zone: module.zone,
          x: rectangle.x + 14,
          y: rectangle.y + 73 + index * 39,
          width: rectangle.width - 28,
          height: 32,
        };
        fileRects.push(file);
        fileByPath.set(file.path, file);
      });
    });
    return maximum;
  }

  const firstHeight = appendRow(firstRow, 44);
  const secondTop = 44 + firstHeight + 115;
  const secondHeight = appendRow(secondRow, secondTop);

  // Both aggregated and file-to-file connectors originate from scanned imports.
  const modulesByPath = new Map(modules.map((module) => [module.path, module]));
  const connections = new Map<string, GraphEdge>();
  for (const module of modules) {
    if (!overview && !selected.has(module.path)) continue;
    for (const dependency of module.imports) {
      if (!overview && !selected.has(dependency)) continue;
      const destination = modulesByPath.get(dependency);
      if (!destination) continue;

      const from = fileByPath.has(module.path)
        ? module.path
        : "zone:" + module.zone;
      const to = fileByPath.has(dependency)
        ? dependency
        : "zone:" + destination.zone;
      if (from === to) continue;
      if (module.zone === destination.zone && (!fileByPath.has(module.path) || !fileByPath.has(dependency))) continue;
      const key = from + "\u0000" + to;
      const current = connections.get(key);
      if (current) {
        current.count += 1;
      } else {
        connections.set(key, {
          source: from,
          target: to,
          count: 1,
          emphasis: false,
        });
      }
    }
  }

  return {
    zones: zoneRects,
    files: fileRects,
    edges: [...connections.values()],
    width: 1362,
    height: secondTop + secondHeight + 65,
  };
}

/** Calculate a directional curve between two graph objects. */
function connector(from: Box, to: Box): string {
  const fromCenterX = from.x + from.width / 2;
  const toCenterX = to.x + to.width / 2;
  const fromCenterY = from.y + from.height / 2;
  const toCenterY = to.y + to.height / 2;
  let sx: number;
  let sy: number;
  let ex: number;
  let ey: number;
  if (Math.abs(fromCenterX - toCenterX) > 130) {
    const forward = fromCenterX < toCenterX;
    sx = forward ? from.x + from.width : from.x;
    sy = fromCenterY;
    ex = forward ? to.x : to.x + to.width;
    ey = toCenterY;
    const bend = Math.max(40, Math.abs(ex - sx) * 0.5);
    return (
      "M " + sx + " " + sy + " C " +
      (sx + (forward ? bend : -bend)) + " " + sy + ", " +
      (ex + (forward ? -bend : bend)) + " " + ey + ", " +
      ex + " " + ey
    );
  }
  const down = fromCenterY < toCenterY;
  sx = fromCenterX;
  ex = toCenterX;
  sy = down ? from.y + from.height : from.y;
  ey = down ? to.y : to.y + to.height;
  const bend = Math.max(34, Math.abs(ey - sy) * 0.5);
  return (
    "M " + sx + " " + sy + " C " +
    sx + " " + (sy + (down ? bend : -bend)) + ", " +
    ex + " " + (ey + (down ? -bend : bend)) + ", " +
    ex + " " + ey
  );
}

function initialViewport(layout: { width: number; height: number }): Viewport {
  return { x: -22, y: -20, width: layout.width + 44, height: layout.height + 40 };
}

function keyActivate(event: KeyboardEvent<SVGGElement>, action: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}


/** Zoomable SVG graph with a pointer-friendly pan surface and accessible node actions. */
function GraphCanvas({
  modules,
  view,
  active,
  focusZone,
  selectFile,
  openZone,
}: {
  modules: readonly GraphModule[];
  view: MapView;
  active: string;
  focusZone: ArchitectureZone | null;
  selectFile: (file: string) => void;
  openZone: (zone: ArchitectureZone) => void;
}) {
  const [expanded, setExpanded] = useState<Set<ArchitectureZone>>(
    () => new Set(ZONES.map((zone) => zone.id)),
  );
  const selected = useMemo(
    () => getSelectedPaths(modules, view, active, focusZone),
    [modules, view, active, focusZone],
  );
  const overview = view === "system";
  const layout = useMemo(
    () => graphLayout(modules, selected, expanded, overview),
    [modules, selected, expanded, overview],
  );
  const [viewport, setViewport] = useState<Viewport>(() => initialViewport(layout));
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    start: Viewport;
    x: number;
    y: number;
    distance: number;
    isPinch: boolean;
  } | null>(null);

  const rectByKey = new Map<string, Box>();
  for (const zone of layout.zones) rectByKey.set("zone:" + zone.zone, zone);
  for (const file of layout.files) rectByKey.set(file.path, file);
  const highlighted = new Set<string>([active]);
  for (const module of modules) {
    if (module.path === active) module.imports.forEach((file) => highlighted.add(file));
    if (module.imports.includes(active)) highlighted.add(module.path);
  }

  function toggleZone(zone: ArchitectureZone) {
    const updated = new Set(expanded);
    if (updated.has(zone)) updated.delete(zone);
    else updated.add(zone);
    const next = graphLayout(modules, selected, updated, overview);
    setExpanded(updated);
    setViewport(initialViewport(next));
  }

  function zoom(factor: number) {
    setViewport((current) => {
      const width = Math.min(5500, Math.max(340, current.width * factor));
      const height = (width / current.width) * current.height;
      return {
        x: current.x + (current.width - width) / 2,
        y: current.y + (current.height - height) / 2,
        width,
        height,
      };
    });
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = svg.getBoundingClientRect();
      setViewport((current) => {
        const factor = event.deltaY > 0 ? 1.12 : 0.89;
        const width = Math.min(5500, Math.max(340, current.width * factor));
        const ratio = width / current.width;
        const mouseX = (event.clientX - rect.left) / rect.width;
        const mouseY = (event.clientY - rect.top) / rect.height;
        return {
          x: current.x + current.width * mouseX * (1 - ratio),
          y: current.y + current.height * mouseY * (1 - ratio),
          width,
          height: current.height * ratio,
        };
      });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  function pointerDown(event: PointerEvent<SVGSVGElement>) {
    if ((event.target as Element).closest("[data-map-node]")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [first, second] = [...pointers.current.values()];
      if (!first || !second) return;
      gesture.current = {
        start: viewport,
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
        distance: Math.hypot(first.x - second.x, first.y - second.y),
        isPinch: true,
      };
    } else {
      gesture.current = {
        start: viewport,
        x: event.clientX,
        y: event.clientY,
        distance: 0,
        isPinch: false,
      };
    }
  }

  function pointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const current = gesture.current;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!current || !rect) return;
    const scale = Math.min(
      rect.width / current.start.width,
      rect.height / current.start.height,
    );
    if (current.isPinch && pointers.current.size === 2) {
      const [first, second] = [...pointers.current.values()];
      if (!first || !second) return;
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      const ratio = current.distance / Math.max(1, distance);
      const width = Math.min(5500, Math.max(340, current.start.width * ratio));
      const height = current.start.height * (width / current.start.width);
      const cx = (first.x + second.x) / 2;
      const cy = (first.y + second.y) / 2;
      setViewport({
        x: current.start.x + (current.start.width - width) / 2 - (cx - current.x) / scale,
        y: current.start.y + (current.start.height - height) / 2 - (cy - current.y) / scale,
        width,
        height,
      });
    } else if (!current.isPinch) {
      setViewport({
        ...current.start,
        x: current.start.x - (event.clientX - current.x) / scale,
        y: current.start.y - (event.clientY - current.y) / scale,
      });
    }
  }

  function pointerUp(event: PointerEvent<SVGSVGElement>) {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const remaining = [...pointers.current.values()];
    if (remaining.length === 1 && remaining[0]) {
      gesture.current = {
        start: viewport,
        x: remaining[0].x,
        y: remaining[0].y,
        distance: 0,
        isPinch: false,
      };
    } else {
      gesture.current = null;
    }
  }

  const showEdge = (edge: GraphEdge) => {
    const from = rectByKey.get(edge.source);
    const to = rectByKey.get(edge.target);
    if (!from || !to) return null;
    const isActive = highlighted.has(edge.source) && highlighted.has(edge.target);
    return (
      <path
        key={edge.source + ">" + edge.target}
        d={connector(from, to)}
        fill="none"
        stroke={isActive ? "var(--signal-strong)" : "var(--signal)"}
        strokeWidth={isActive ? 3 : Math.min(3.4, 1.1 + Math.log2(edge.count + 1) * 0.55)}
        strokeOpacity={isActive ? 0.95 : overview ? 0.48 : 0.28}
        markerEnd="url(#anthimeria-edge-arrow)"
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
    );
  };

  return (
    <div className="relative overflow-hidden border-y border-border bg-background-strong">
      <svg
        ref={svgRef}
        className="block h-[min(72vh,820px)] min-h-[470px] w-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none", userSelect: "none" }}
        viewBox={viewport.x + " " + viewport.y + " " + viewport.width + " " + viewport.height}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Interactive architecture dependency graph. Arrows point from an importing file to the imported module. Drag empty space to pan; pinch or use controls to zoom."
        role="group"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
      >
        <defs>
          <pattern id="anthimeria-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--signal)" opacity=".17" />
          </pattern>
          <marker
            id="anthimeria-edge-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="var(--signal-strong)" opacity=".75" />
          </marker>
        </defs>
        <rect
          x="-6000"
          y="-6000"
          width="15000"
          height="15000"
          fill="url(#anthimeria-grid)"
          pointerEvents="all"
        />
        <g>{layout.edges.map(showEdge)}</g>
        <g>
          {layout.zones.map((zone) => {
            const metadata = ZONES.find((item) => item.id === zone.zone);
            const action = () => (overview ? openZone(zone.zone) : toggleZone(zone.zone));
            return (
              <g
                key={zone.zone}
                role="button"
                tabIndex={0}
                aria-label={(overview ? "Explore " : zone.expanded ? "Collapse " : "Expand ") + (metadata?.title ?? zone.zone)}
                data-map-node="zone"
                onClick={action}
                onKeyDown={(event) => keyActivate(event, action)}
                className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-signal"
              >
                <title>{metadata?.title}: {zone.count} source files. {overview ? "Select to inspect this area." : "Select to expand or collapse."}</title>
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="10"
                  fill="var(--surface)"
                  fillOpacity={zone.expanded ? ".58" : ".93"}
                  stroke="var(--signal)"
                  strokeWidth="1.7"
                />
                <rect x={zone.x} y={zone.y} width={zone.width} height="59" rx="10" fill="var(--surface-raised)" fillOpacity=".92" />
                <path d={"M " + zone.x + " " + (zone.y + 58) + " h " + zone.width} stroke="var(--signal)" strokeOpacity=".5" />
                <text x={zone.x + 16} y={zone.y + 25} fontSize="17" fontWeight="700" fill="var(--foreground)" fontFamily="var(--type-heading)">
                  {metadata?.title}
                </text>
                <text x={zone.x + 16} y={zone.y + 44} fontSize="11" fill="var(--muted-foreground)">
                  {metadata?.subtitle}
                </text>
                <text x={zone.x + zone.width - 16} y={zone.y + 26} fontSize="13" fill="var(--signal-strong)" textAnchor="end">
                  {zone.count}
                </text>
                {!zone.expanded && (
                  <>
                    <text x={zone.x + 17} y={zone.y + 96} fontSize="13" fill="var(--signal-strong)">
                      {overview ? "OPEN ARCHITECTURAL LAYER" : "EXPAND FILE NODES"}
                    </text>
                    <text x={zone.x + 17} y={zone.y + 122} fontSize="12" fill="var(--muted-foreground)">
                      Connected by verified local imports
                    </text>
                    <path d={"M " + (zone.x + 18) + " " + (zone.y + 143) + " h " + (zone.width - 36)} stroke="var(--signal)" strokeDasharray="4 8" strokeOpacity=".45" />
                  </>
                )}
                {zone.expanded && zone.count > zone.shown && (
                  <text x={zone.x + 17} y={zone.y + zone.height - 11} fontSize="10" fill="var(--signal-text)">
                    {"+" + (zone.count - zone.shown) + " additional files available in explorer"}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        <g>
          {layout.files.map((file) => {
            const isActive = file.path === active;
            const isConnected = highlighted.has(file.path);
            const action = () => selectFile(file.path);
            return (
              <g
                key={file.path}
                role="button"
                tabIndex={0}
                aria-label={"Open " + file.path}
                data-map-node="file"
                className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-signal"
                onClick={action}
                onKeyDown={(event) => keyActivate(event, action)}
              >
                <title>{file.path}</title>
                <rect
                  x={file.x}
                  y={file.y}
                  width={file.width}
                  height={file.height}
                  rx="4"
                  fill={isActive ? "var(--signal)" : isConnected ? "#14313a" : "#101521"}
                  stroke={isActive ? "var(--signal-strong)" : "var(--signal)"}
                  strokeOpacity={isActive || isConnected ? 1 : 0.4}
                  strokeWidth={isActive ? 2.3 : 1}
                />
                <circle cx={file.x + 11} cy={file.y + file.height / 2} r="3" fill={isActive ? "var(--foreground)" : "var(--signal-strong)"} />
                <text
                  x={file.x + 23}
                  y={file.y + 21}
                  fontSize="12.2"
                  fontFamily="var(--type-code)"
                  fill={isActive ? "var(--background)" : "var(--foreground)"}
                >
                  {shortName(file.path)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="absolute right-3 bottom-3 flex items-center gap-1 border border-border bg-background-strong/95 p-1">
        <button type="button" aria-label="Zoom in" onClick={() => zoom(0.78)} className="flex size-10 items-center justify-center text-foreground hover:bg-surface-raised">
          <Plus className="size-5" />
        </button>
        <button type="button" aria-label="Zoom out" onClick={() => zoom(1.28)} className="flex size-10 items-center justify-center text-foreground hover:bg-surface-raised">
          <Minus className="size-5" />
        </button>
        <button type="button" aria-label="Fit map" onClick={() => setViewport(initialViewport(layout))} className="flex size-10 items-center justify-center text-foreground hover:bg-surface-raised">
          <Maximize2 className="size-5" />
        </button>
      </div>
    </div>
  );
}

/** Actual import relationships visualized as a compound, pannable graph. */
export function AnthimeriaArchitectureMap({
  modules,
  active,
  selectFile,
  view,
  setView,
}: {
  modules: readonly GraphModule[];
  active: string;
  selectFile: (file: string) => void;
  view: MapView;
  setView: (value: MapView) => void;
}) {
  const [focusZone, setFocusZone] = useState<ArchitectureZone | null>(null);
  const counts = useMemo(() => {
    const existing = new Set(modules.map((module) => module.path));
    return modules.reduce(
      (result, module) => {
        result.edges += module.imports.filter((dependency) => existing.has(dependency)).length;
        return result;
      },
      { edges: 0 },
    );
  }, [modules]);

  const modes: readonly { id: MapView; title: string }[] = [
    { id: "system", title: "SYSTEM" },
    { id: "crm", title: "CRM" },
    { id: "read", title: "READ" },
    { id: "write", title: "WRITE" },
    { id: "focus", title: "FOCUS" },
  ];

  function updateView(next: MapView) {
    setFocusZone(null);
    setView(next);
  }

  function openZone(zone: ArchitectureZone) {
    setFocusZone(zone);
    setView("focus");
  }

  return (
    <div className="min-w-0 bg-background-strong">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-3">
        <div role="group" aria-label="Architecture map scopes" className="flex flex-wrap items-center gap-1.5">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              aria-pressed={view === mode.id && !(mode.id === "focus" && focusZone)}
              onClick={() => updateView(mode.id)}
              className={
                "min-h-10 border px-3 text-xs font-bold tracking-wider transition-colors " +
                (view === mode.id
                  ? "border-signal-strong bg-signal-soft text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground")
              }
            >
              {mode.title}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground">
          {modules.length} modules · {counts.edges} local imports
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
        <Search className="size-3.5 text-signal-text" aria-hidden="true" />
        {view === "system"
          ? "System boundaries and dependency connections. Select a group to reveal its files."
          : view === "focus"
            ? focusZone
              ? "Connections within " + focusZone + " and its neighboring modules."
              : "Imports to and from the currently selected file."
            : "Real imported module connections for this slice; select any file to open its source."}
      </div>
      <GraphCanvas
        key={view + "-" + (focusZone ?? "") + (view === "focus" ? active : "")}
        modules={modules}
        view={view}
        active={active}
        focusZone={focusZone}
        selectFile={selectFile}
        openZone={openZone}
      />
      <p className="m-0 border-t border-border px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
        Arrows run from importing modules toward their local dependencies. They are derived from source imports and exports—not inferred runtime calls. Drag empty space to pan, pinch or scroll to zoom, or use the zoom controls. File nodes open Monaco; the explorer includes every template file.
      </p>
    </div>
  );
}
