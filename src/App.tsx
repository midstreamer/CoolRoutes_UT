import { useCallback, useEffect, useMemo, useState } from "react";
import { AboutView } from "./components/AboutView";
import { AppHeader } from "./components/AppHeader";
import { BottomNavigation } from "./components/BottomNavigation";
import { CampusMap } from "./components/CampusMap";
import { CoolingStopCard } from "./components/CoolingStopCard";
import { CoolingStopList } from "./components/CoolingStopList";
import { DisclaimerFooter } from "./components/DisclaimerFooter";
import { NextClassCard } from "./components/NextClassCard";
import { RouteDetailCard } from "./components/RouteDetailCard";
import { RouteModeSelector } from "./components/RouteModeSelector";
import { ScheduleView } from "./components/ScheduleView";
import { coolingStops, getLocationByAbbreviation } from "./data/locations";
import { useNextClass } from "./hooks/useNextClass";
import { useRouteSelection } from "./hooks/useRouteSelection";
import {
  applyCalculatedRouteToOption,
  calculatePedestrianRoute
} from "./services/routeService";
import type { AppTab } from "./types/navigation";
import type { CoolRouteLocation } from "./types/location";
import type {
  CalculatedPedestrianRoute,
  RouteMode,
  RouteOption,
  RoutingStatus
} from "./types/route";

const App = () => {
  const scheduleContext = useNextClass();
  const [activeTab, setActiveTab] = useState<AppTab>("route");
  const [selectedCoolingStop, setSelectedCoolingStop] =
    useState<CoolRouteLocation>();
  const [showFutureNavigationModal, setShowFutureNavigationModal] =
    useState(false);
  const [fastestRouteResult, setFastestRouteResult] =
    useState<CalculatedPedestrianRoute>();
  const [fastestRoutingStatus, setFastestRoutingStatus] =
    useState<RoutingStatus>("idle");
  const [highlightRemoteSuitable, setHighlightRemoteSuitable] = useState(false);
  const {
    scenario,
    selectedRoute: selectedRouteBase,
    selectedRouteMode,
    setSelectedRouteMode
  } = useRouteSelection(scheduleContext.origin, scheduleContext.destination);

  const origin = getLocationByAbbreviation(scenario.origin);
  const destination = getLocationByAbbreviation(scenario.destination);
  const fastestRouteOption = useMemo<RouteOption>(() => {
    if (fastestRouteResult) {
      return applyCalculatedRouteToOption(
        scenario.options.fastest,
        fastestRouteResult
      );
    }

    return {
      ...scenario.options.fastest,
      routeSource: "prototype",
      isLiveRoute: false,
      routingStatus: fastestRoutingStatus,
      routingWarning:
        fastestRoutingStatus === "loading"
          ? "Calculating walking route…"
          : undefined
    };
  }, [fastestRouteResult, fastestRoutingStatus, scenario]);
  const selectedRoute =
    selectedRouteMode === "fastest" ? fastestRouteOption : selectedRouteBase;
  const recommendedStop = coolingStops.find((stop) =>
    selectedRoute.coolingStopIds.includes(stop.id)
  );
  const displayedCoolingStops = useMemo(() => {
    if (selectedRoute.mode === "cooling-stops") {
      return coolingStops.filter((stop) =>
        selectedRoute.coolingStopIds.includes(stop.id)
      );
    }

    return coolingStops;
  }, [selectedRoute]);

  useEffect(() => {
    let cancelled = false;

    if (
      selectedRouteMode !== "fastest" ||
      !origin ||
      !destination ||
      fastestRouteResult
    ) {
      return;
    }

    setFastestRoutingStatus("loading");
    void calculatePedestrianRoute(
      origin,
      destination,
      scenario.options.fastest
    ).then((result) => {
      if (cancelled) {
        return;
      }

      setFastestRouteResult(result);
      setFastestRoutingStatus(result.isLiveRoute ? "success" : "fallback");
    });

    return () => {
      cancelled = true;
    };
  }, [
    destination,
    fastestRouteResult,
    origin,
    scenario.options.fastest,
    selectedRouteMode
  ]);

  const handleFindCoolStudySpace = () => {
    setHighlightRemoteSuitable(true);
    setActiveTab("cooling");
  };

  const handleSelectCoolingStop = useCallback((location: CoolRouteLocation) => {
    setSelectedCoolingStop(location);
  }, []);

  const handleSelectRouteMode = (mode: RouteMode) => {
    setSelectedRouteMode(mode);
    const nextRecommendedStop = coolingStops.find((stop) =>
      scenario.options[mode].coolingStopIds.includes(stop.id)
    );
    setSelectedCoolingStop(nextRecommendedStop);
  };

  return (
    <div className="app-shell">
      <AppHeader />
      <main>
        {activeTab === "route" ? (
          <div className="route-layout">
            <NextClassCard
              context={scheduleContext}
              onFindCoolStudySpace={handleFindCoolStudySpace}
            />
            <CampusMap
              origin={origin}
              destination={destination}
              coolingStops={displayedCoolingStops}
              selectedRoute={selectedRoute}
              selectedCoolingStopId={selectedCoolingStop?.id}
              onSelectCoolingStop={handleSelectCoolingStop}
            />
            <p className="demo-geometry-label">
              Demo route geometry — conceptual MVP connectors, not pedestrian
              navigation routes.
            </p>
            <div className="route-options-heading">
              <h2>Route Options</h2>
              <span>Compare routes</span>
            </div>
            <RouteModeSelector
              scenario={scenario}
              fastestRoute={fastestRouteOption}
              selectedMode={selectedRouteMode}
              onSelectMode={handleSelectRouteMode}
            />
            <RouteDetailCard route={selectedRoute} />
            <CoolingStopCard
              location={selectedCoolingStop ?? recommendedStop}
              onClose={() => setSelectedCoolingStop(undefined)}
            />
            <button
              type="button"
              className="start-route-button"
              onClick={() => setShowFutureNavigationModal(true)}
            >
              Start Route
            </button>
            {showFutureNavigationModal ? (
              <div
                className="modal-backdrop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="future-navigation-title"
              >
                <div className="card future-modal">
                  <h2 id="future-navigation-title">Future Navigation</h2>
                  <p>
                    Turn-by-turn navigation is planned for a future version.
                  </p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setShowFutureNavigationModal(false)}
                  >
                    Got it
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {activeTab === "cooling" ? (
          <div className="tab-panel">
            <CoolingStopList
              coolingStops={coolingStops}
              highlightedRemoteSuitable={highlightRemoteSuitable}
              selectedId={selectedCoolingStop?.id}
              onSelectStop={handleSelectCoolingStop}
            />
            <CoolingStopCard location={selectedCoolingStop} />
          </div>
        ) : null}
        {activeTab === "schedule" ? (
          <div className="tab-panel">
            <ScheduleView />
          </div>
        ) : null}
        {activeTab === "about" ? (
          <div className="tab-panel">
            <AboutView />
          </div>
        ) : null}
      </main>
      <DisclaimerFooter />
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
