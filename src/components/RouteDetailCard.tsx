import { getLocationByAbbreviation } from "../data/locations";
import { routeModeLabels } from "../services/routeService";
import type { RouteOption } from "../types/route";

interface RouteDetailCardProps {
  route: RouteOption;
}

export const RouteDetailCard = ({ route }: RouteDetailCardProps) => {
  const coolingStops = route.coolingStopIds
    .map((id) => getLocationByAbbreviation(id.toUpperCase()))
    .filter(Boolean);
  const shadeCoverage =
    route.shadeIndoorPercent && route.shadeIndoorPercent >= 40
      ? "Improved"
      : `${route.shadeIndoorPercent ?? 0}%`;

  return (
    <section className="card route-detail-card">
      <div className="section-heading">
        <p className="eyebrow">Selected Route</p>
        <h2>{routeModeLabels[route.mode]} Route</h2>
      </div>
      <dl className="detail-grid">
        <div>
          <dt>Estimated time</dt>
          <dd>{route.estimatedMinutes} min</dd>
        </div>
        <div>
          <dt>Outdoor exposure</dt>
          <dd>{route.heatExposureLevel}</dd>
        </div>
        <div>
          <dt>Shade / indoor coverage</dt>
          <dd>{shadeCoverage}</dd>
        </div>
        <div>
          <dt>{coolingStops.length === 1 ? "Cooling stop" : "Cooling stops"}</dt>
          <dd>
            {coolingStops.length > 0
              ? coolingStops.map((stop) => stop?.abbreviation).join(", ")
              : "None"}
          </dd>
        </div>
      </dl>
      {route.routingPriority || route.recommendedMode ? (
        <div className="route-guidance">
          {route.routingPriority ? (
            <p>
              <strong>Route priority:</strong> {route.routingPriority}
            </p>
          ) : null}
          {route.recommendedMode ? (
            <p>
              <strong>Document recommendation:</strong>{" "}
              {route.recommendedMode}
            </p>
          ) : null}
          {route.candidateCoolingNodeNotes ? (
            <p>
              <strong>Candidate nodes:</strong>{" "}
              {route.candidateCoolingNodeNotes}
            </p>
          ) : null}
        </div>
      ) : null}
      <p className="heat-note">{route.description}</p>
      {route.timeConstraintNote ? (
        <p className="prototype-note">{route.timeConstraintNote}</p>
      ) : null}
      <p className="prototype-note">{route.disclaimer}</p>
    </section>
  );
};
