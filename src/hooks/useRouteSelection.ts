import { useMemo, useState } from "react";
import { getRouteScenario } from "../services/routeService";
import type { RouteMode } from "../types/route";

export const useRouteSelection = (
  origin?: string,
  destination?: string,
  initialMode: RouteMode = "coolest"
) => {
  const [selectedRouteMode, setSelectedRouteMode] =
    useState<RouteMode>(initialMode);

  const scenario = useMemo(
    () => getRouteScenario(origin, destination),
    [origin, destination]
  );

  const selectedRoute = scenario.options[selectedRouteMode];

  return {
    scenario,
    selectedRoute,
    selectedRouteMode,
    setSelectedRouteMode
  };
};
