export type RouteMode = "fastest" | "coolest" | "cooling-stops";

export type HeatExposureLevel = "low" | "moderate" | "high";

export type RouteSource = "arcgis" | "prototype" | "prototype-fallback";

export type RoutingStatus =
  | "idle"
  | "loading"
  | "success"
  | "fallback"
  | "error";

export interface RouteOption {
  id: string;
  origin: string;
  destination: string;
  mode: RouteMode;
  estimatedMinutes: number;
  estimatedDistance?: number;
  heatExposureLevel: HeatExposureLevel;
  outdoorExposurePercent?: number;
  shadeIndoorPercent?: number;
  coolingStopIds: string[];
  description: string;
  routingPriority?: string;
  recommendedMode?: string;
  candidateCoolingNodeNotes?: string;
  timeConstraintNote?: string;
  routeCoordinates?: [number, number][];
  routeSpatialReferenceWkid?: number;
  routeReference?: string;
  disclaimer: string;
  prototypeEstimate: boolean;
  routeSource?: RouteSource;
  isLiveRoute?: boolean;
  calculatedAt?: string;
  routingStatus?: RoutingStatus;
  routingWarning?: string;
  travelModeName?: string;
}

export interface RouteScenario {
  id: string;
  origin: string;
  destination: string;
  options: Record<RouteMode, RouteOption>;
}

export interface CalculatedPedestrianRoute {
  routeCoordinates: [number, number][];
  routeSpatialReferenceWkid: number;
  distanceMiles: number;
  distanceMeters: number;
  travelTimeMinutes: number;
  source: "arcgis" | "prototype-fallback";
  isLiveRoute: boolean;
  calculatedAt: string;
  travelModeName?: string;
  warning?: string;
}
