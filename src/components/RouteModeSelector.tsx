import { routeModeLabels, routeModeSummaries } from "../services/routeService";
import type { RouteMode, RouteScenario } from "../types/route";

interface RouteModeSelectorProps {
  scenario: RouteScenario;
  fastestRoute?: RouteScenario["options"]["fastest"];
  selectedMode: RouteMode;
  onSelectMode: (mode: RouteMode) => void;
}

const routeModes: RouteMode[] = ["fastest", "coolest", "cooling-stops"];

const routeIcons: Record<RouteMode, string> = {
  fastest: "walk",
  coolest: "leaf",
  "cooling-stops": "snow"
};

export const RouteModeSelector = ({
  scenario,
  fastestRoute,
  selectedMode,
  onSelectMode
}: RouteModeSelectorProps) => (
  <section className="route-selector" aria-label="Route mode selector">
    {routeModes.map((mode) => {
      const option = mode === "fastest" && fastestRoute ? fastestRoute : scenario.options[mode];
      const selected = selectedMode === mode;
      const summary =
        mode === "cooling-stops"
          ? `${option.coolingStopIds.length} candidate ${
              option.coolingStopIds.length === 1 ? "stop" : "stops"
            }`
          : routeModeSummaries[mode];

      return (
        <button
          key={mode}
          type="button"
          className={`route-mode-card ${selected ? "selected" : ""}`}
          aria-pressed={selected}
          onClick={() => onSelectMode(mode)}
        >
          <span className={`route-card-icon ${mode}`} aria-hidden="true">
            {routeIcons[mode]}
          </span>
          <span>{routeModeLabels[mode]}</span>
          <strong>{option.estimatedMinutes} min</strong>
          {option.estimatedDistance ? (
            <small>{option.estimatedDistance} mi</small>
          ) : null}
          <small>
            {mode === "fastest" && option.routingStatus === "loading"
              ? "Calculating walking route…"
              : summary}
          </small>
          <em>
            {mode === "fastest" && option.isLiveRoute
              ? "Actual pedestrian route"
              : mode === "fastest" && option.routingStatus === "loading"
                ? "ArcGIS walking route"
                : mode === "fastest"
                  ? "Prototype estimate"
                  : "Concept estimate"}
          </em>
        </button>
      );
    })}
  </section>
);
