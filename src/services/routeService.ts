import { defaultRouteScenarioId, routeScenarios } from "../data/routes";
import type { RouteMode, RouteScenario } from "../types/route";

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
