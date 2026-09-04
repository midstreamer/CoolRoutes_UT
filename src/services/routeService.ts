import { defaultRouteScenarioId, routeScenarios } from "../data/routes";
import esriConfig from "@arcgis/core/config";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import { fetchServiceDescription } from "@arcgis/core/rest/networkService";
import { solve as solveRoute } from "@arcgis/core/rest/route";
import type { CoolRouteLocation } from "../types/location";
import type {
  CalculatedPedestrianRoute,
  RouteMode,
  RouteOption,
  RouteScenario
} from "../types/route";

const ARCGIS_WORLD_ROUTE_SERVICE_URL =
  "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

const METERS_PER_MILE = 1609.344;
const WALK_CACHE_KEY = "WALK";
const routeResultCache = new Map<string, CalculatedPedestrianRoute>();

interface PedestrianRoutingDependencies {
  apiKey?: string;
  fetchDescription?: typeof fetchServiceDescription;
  solve?: typeof solveRoute;
}

export const getRouteScenario = (
  origin?: string,
  destination?: string
): RouteScenario => {
  const matchingScenario = routeScenarios.find(
    (scenario) =>
      scenario.origin === origin && scenario.destination === destination
  );

  return (
    matchingScenario ??
    routeScenarios.find((scenario) => scenario.id === defaultRouteScenarioId) ??
    routeScenarios[0]
  );
};

export const getRouteOption = (
  origin: string | undefined,
  destination: string | undefined,
  mode: RouteMode
) => getRouteScenario(origin, destination).options[mode];

export const routeModeLabels: Record<RouteMode, string> = {
  fastest: "Fastest",
  coolest: "Coolest",
  "cooling-stops": "Cooling Stops"
};

export const routeModeSummaries: Record<RouteMode, string> = {
  fastest: "Mostly outdoors",
  coolest: "More shade / indoor travel",
  "cooling-stops": "Candidate cooling stop"
};

export const getPedestrianRouteCacheKey = (
  originAbbreviation: string,
  destinationAbbreviation: string
) => `${originAbbreviation}|${destinationAbbreviation}|${WALK_CACHE_KEY}`;

export const clearPedestrianRouteCache = () => {
  routeResultCache.clear();
};

const getArcgisApiKey = () => import.meta.env.VITE_ARCGIS_API_KEY?.trim();

const createFallbackResult = (
  origin: CoolRouteLocation,
  destination: CoolRouteLocation,
  fallbackRoute: RouteOption,
  warning: string
): CalculatedPedestrianRoute => {
  const routeCoordinates: [number, number][] =
    fallbackRoute.routeCoordinates && fallbackRoute.routeCoordinates.length > 0
      ? fallbackRoute.routeCoordinates
      : [
          [origin.longitude, origin.latitude],
          [destination.longitude, destination.latitude]
        ];
  const distanceMiles = fallbackRoute.estimatedDistance ?? 0;

  return {
    routeCoordinates,
    routeSpatialReferenceWkid: fallbackRoute.routeSpatialReferenceWkid ?? 4326,
    distanceMiles,
    distanceMeters: distanceMiles * METERS_PER_MILE,
    travelTimeMinutes: fallbackRoute.estimatedMinutes,
    source: "prototype-fallback",
    isLiveRoute: false,
    calculatedAt: new Date().toISOString(),
    warning
  };
};

export const selectWalkingTravelMode = (
  travelModes: __esri.TravelMode[] | null | undefined
) => {
  const modes = travelModes ?? [];

  return (
    modes.find((mode) => mode.type === "walk") ??
    modes.find((mode) => /walk|pedestrian/i.test(mode.name))
  );
};

const extractNumericAttribute = (
  attributes: Record<string, unknown>,
  keys: string[]
) => {
  for (const key of keys) {
    const value = attributes[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
};

const extractFirstRoutePath = (geometry: __esri.Geometry | null | undefined) => {
  if (!geometry || geometry.type !== "polyline") {
    return undefined;
  }

  const polyline = geometry as __esri.Polyline;
  return polyline.paths?.[0]?.map(([x, y]) => [x, y] as [number, number]);
};

export const calculatePedestrianRoute = async (
  origin: CoolRouteLocation,
  destination: CoolRouteLocation,
  fallbackRoute: RouteOption,
  dependencies: PedestrianRoutingDependencies = {}
): Promise<CalculatedPedestrianRoute> => {
  const cacheKey = getPedestrianRouteCacheKey(
    origin.abbreviation,
    destination.abbreviation
  );
  const cachedResult = routeResultCache.get(cacheKey);

  if (cachedResult) {
    return cachedResult;
  }

  const apiKey = dependencies.apiKey ?? getArcgisApiKey();

  if (!apiKey) {
    const fallback = createFallbackResult(
      origin,
      destination,
      fallbackRoute,
      "Live pedestrian routing unavailable. Showing prototype estimate."
    );
    routeResultCache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    esriConfig.apiKey = apiKey;

    const description = await (
      dependencies.fetchDescription ?? fetchServiceDescription
    )(ARCGIS_WORLD_ROUTE_SERVICE_URL, apiKey);
    const walkingTravelMode = selectWalkingTravelMode(
      description.supportedTravelModes
    );

    if (!walkingTravelMode || walkingTravelMode.type !== "walk") {
      throw new Error("No pedestrian walking travel mode is available.");
    }

    const stops = new FeatureSet({
      features: [
        new Graphic({
          geometry: new Point({
            longitude: origin.longitude,
            latitude: origin.latitude,
            spatialReference: { wkid: 4326 }
          })
        }),
        new Graphic({
          geometry: new Point({
            longitude: destination.longitude,
            latitude: destination.latitude,
            spatialReference: { wkid: 4326 }
          })
        })
      ]
    });

    const params = new RouteParameters({
      apiKey,
      stops,
      returnRoutes: true,
      returnDirections: true,
      directionsLengthUnits: "miles",
      directionsOutputType: "summary-only",
      outputLines: "true-shape",
      findBestSequence: false,
      preserveFirstStop: true,
      preserveLastStop: true,
      impedanceAttribute: "walk-time",
      accumulateAttributes: ["walk-time", "miles"],
      restrictionAttributes: ["walking", "preferred-for-pedestrians"],
      travelMode: walkingTravelMode,
      useHierarchy: false
    });

    const solveResult = await (dependencies.solve ?? solveRoute)(
      ARCGIS_WORLD_ROUTE_SERVICE_URL,
      params
    );
    const routeResult = solveResult.routeResults?.[0];
    const routeGraphic = routeResult?.route;
    const routeCoordinates = extractFirstRoutePath(routeGraphic?.geometry);

    if (!routeGraphic || !routeCoordinates?.length) {
      throw new Error("ArcGIS returned no route geometry.");
    }

    const attributes = routeGraphic.attributes as Record<string, unknown>;
    const directions = routeResult?.directions;
    const distanceMiles =
      extractNumericAttribute(attributes, [
        "Total_Miles",
        "TotalMiles",
        "Shape_Length"
      ]) ??
      directions?.totalLength ??
      fallbackRoute.estimatedDistance ??
      0;
    const travelTimeMinutes =
      extractNumericAttribute(attributes, [
        "Total_TravelTime",
        "Total_Minutes",
        "Total_WalkTime"
      ]) ??
      directions?.totalTime ??
      fallbackRoute.estimatedMinutes;
    const result: CalculatedPedestrianRoute = {
      routeCoordinates,
      routeSpatialReferenceWkid:
        routeGraphic.geometry?.spatialReference?.wkid ?? 4326,
      distanceMiles,
      distanceMeters: distanceMiles * METERS_PER_MILE,
      travelTimeMinutes,
      source: "arcgis",
      isLiveRoute: true,
      calculatedAt: new Date().toISOString(),
      travelModeName: walkingTravelMode.name
    };

    routeResultCache.set(cacheKey, result);
    return result;
  } catch (error) {
    const fallback = createFallbackResult(
      origin,
      destination,
      fallbackRoute,
      error instanceof Error
        ? `Live pedestrian routing unavailable. ${error.message}`
        : "Live pedestrian routing unavailable. Showing prototype estimate."
    );
    routeResultCache.set(cacheKey, fallback);
    return fallback;
  }
};

export const applyCalculatedRouteToOption = (
  route: RouteOption,
  calculatedRoute: CalculatedPedestrianRoute
): RouteOption => ({
  ...route,
  estimatedMinutes: Math.round(calculatedRoute.travelTimeMinutes),
  estimatedDistance: Number(calculatedRoute.distanceMiles.toFixed(2)),
  routeCoordinates: calculatedRoute.routeCoordinates,
  routeSpatialReferenceWkid: calculatedRoute.routeSpatialReferenceWkid,
  routeSource: calculatedRoute.isLiveRoute ? "arcgis" : "prototype-fallback",
  isLiveRoute: calculatedRoute.isLiveRoute,
  calculatedAt: calculatedRoute.calculatedAt,
  routingStatus: calculatedRoute.isLiveRoute ? "success" : "fallback",
  routingWarning: calculatedRoute.warning,
  travelModeName: calculatedRoute.travelModeName,
  prototypeEstimate: !calculatedRoute.isLiveRoute,
  disclaimer: calculatedRoute.isLiveRoute
    ? "Walking time and distance are calculated from the pedestrian route. Heat exposure is not yet incorporated."
    : route.disclaimer
});
