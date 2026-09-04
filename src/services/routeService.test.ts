import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CoolRouteLocation } from "../types/location";
import type { RouteOption } from "../types/route";
import {
  calculatePedestrianRoute,
  clearPedestrianRouteCache,
  selectWalkingTravelMode
} from "./routeService";

vi.mock("@arcgis/core/config", () => ({ default: {} }));

vi.mock("@arcgis/core/Graphic", () => ({
  default: class Graphic {
    geometry?: unknown;
    attributes?: Record<string, unknown>;

    constructor(properties: Record<string, unknown>) {
      Object.assign(this, properties);
    }
  }
}));

vi.mock("@arcgis/core/geometry/Point", () => ({
  default: class Point {
    constructor(properties: Record<string, unknown>) {
      Object.assign(this, properties);
    }
  }
}));

vi.mock("@arcgis/core/rest/support/FeatureSet", () => ({
  default: class FeatureSet {
    constructor(properties: Record<string, unknown>) {
      Object.assign(this, properties);
    }
  }
}));

vi.mock("@arcgis/core/rest/support/RouteParameters", () => ({
  default: class RouteParameters {
    constructor(properties: Record<string, unknown>) {
      Object.assign(this, properties);
    }
  }
}));

vi.mock("@arcgis/core/rest/networkService", () => ({
  fetchServiceDescription: vi.fn()
}));

vi.mock("@arcgis/core/rest/route", () => ({
  solve: vi.fn()
}));

const origin: CoolRouteLocation = {
  id: "bur",
  name: "Burdine Hall",
  abbreviation: "BUR",
  type: "class-building",
  latitude: 30.28887,
  longitude: -97.73851
};

const destination: CoolRouteLocation = {
  id: "mez",
  name: "Mezes Hall",
  abbreviation: "MEZ",
  type: "class-building",
  latitude: 30.28437,
  longitude: -97.73896
};

const fallbackRoute: RouteOption = {
  id: "BUR-MEZ-fastest",
  origin: "BUR",
  destination: "MEZ",
  mode: "fastest",
  estimatedMinutes: 8,
  estimatedDistance: 0.35,
  heatExposureLevel: "high",
  coolingStopIds: [],
  description: "Fallback prototype route.",
  routeCoordinates: [
    [-97.73851, 30.28887],
    [-97.73896, 30.28437]
  ],
  disclaimer: "Prototype estimate.",
  prototypeEstimate: true
};

const walkingMode = {
  type: "walk",
  name: "Walking Time",
  impedanceAttributeName: "WalkTime"
} as __esri.TravelMode;

describe("routeService", () => {
  beforeEach(() => {
    clearPedestrianRouteCache();
    vi.clearAllMocks();
  });

  it("selects an ArcGIS walking travel mode", () => {
    expect(selectWalkingTravelMode([walkingMode])?.name).toBe("Walking Time");
  });

  it("transforms a successful ArcGIS route response", async () => {
    const solve = vi.fn().mockResolvedValue({
      routeResults: [
        {
          route: {
            geometry: {
              type: "polyline",
              paths: [
                [
                  [-97.73851, 30.28887],
                  [-97.7388, 30.286],
                  [-97.73896, 30.28437]
                ]
              ],
              spatialReference: { wkid: 4326 }
            },
            attributes: {
              Total_Miles: 0.42,
              Total_TravelTime: 9.4
            }
          }
        }
      ]
    });
    const fetchDescription = vi.fn().mockResolvedValue({
      supportedTravelModes: [walkingMode]
    });

    const result = await calculatePedestrianRoute(
      origin,
      destination,
      fallbackRoute,
      {
        apiKey: "test-key",
        fetchDescription,
        solve
      }
    );

    expect(result.source).toBe("arcgis");
    expect(result.isLiveRoute).toBe(true);
    expect(result.distanceMiles).toBe(0.42);
    expect(result.travelTimeMinutes).toBe(9.4);
    expect(result.routeCoordinates).toHaveLength(3);
    expect(result.travelModeName).toBe("Walking Time");
  });

  it("returns prototype fallback when ArcGIS routing fails", async () => {
    const result = await calculatePedestrianRoute(
      origin,
      destination,
      fallbackRoute,
      {
        apiKey: "test-key",
        fetchDescription: vi.fn().mockResolvedValue({
          supportedTravelModes: [walkingMode]
        }),
        solve: vi.fn().mockRejectedValue(new Error("Rejected by service"))
      }
    );

    expect(result.source).toBe("prototype-fallback");
    expect(result.isLiveRoute).toBe(false);
    expect(result.distanceMiles).toBe(0.35);
    expect(result.travelTimeMinutes).toBe(8);
    expect(result.warning).toContain("Rejected by service");
  });

  it("returns prototype fallback without crashing when API key is missing", async () => {
    const solve = vi.fn();
    const result = await calculatePedestrianRoute(
      origin,
      destination,
      fallbackRoute,
      {
        apiKey: "",
        solve
      }
    );

    expect(result.source).toBe("prototype-fallback");
    expect(result.isLiveRoute).toBe(false);
    expect(solve).not.toHaveBeenCalled();
  });

  it("returns cached route results for repeated origin and destination", async () => {
    const solve = vi.fn().mockResolvedValue({
      routeResults: [
        {
          route: {
            geometry: {
              type: "polyline",
              paths: [[[-97.73851, 30.28887], [-97.73896, 30.28437]]],
              spatialReference: { wkid: 4326 }
            },
            attributes: {
              Total_Miles: 0.42,
              Total_TravelTime: 9.4
            }
          }
        }
      ]
    });
    const fetchDescription = vi.fn().mockResolvedValue({
      supportedTravelModes: [walkingMode]
    });

    const first = await calculatePedestrianRoute(
      origin,
      destination,
      fallbackRoute,
      {
        apiKey: "test-key",
        fetchDescription,
        solve
      }
    );
    const second = await calculatePedestrianRoute(
      origin,
      destination,
      fallbackRoute,
      {
        apiKey: "test-key",
        fetchDescription,
        solve
      }
    );

    expect(second).toBe(first);
    expect(fetchDescription).toHaveBeenCalledTimes(1);
    expect(solve).toHaveBeenCalledTimes(1);
  });
});
