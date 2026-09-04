import { pendingVerification } from "../data/locations";
import type { CoolRouteLocation } from "../types/location";

interface CoolingStopListProps {
  coolingStops: CoolRouteLocation[];
  highlightedRemoteSuitable?: boolean;
  selectedId?: string;
  onSelectStop: (location: CoolRouteLocation) => void;
}

const amenitySummary = (location: CoolRouteLocation) => {
  const seating =
    location.seatingAvailable === true
      ? "Seating documented"
      : "Seating pending verification";
  const ac =
    location.airConditioned === true
      ? "A/C documented"
      : "A/C pending verification";
  const water =
    location.waterAvailable === true
      ? "Water documented"
      : "Water pending verification";

  return `${seating}. ${ac}. ${water}.`;
};

export const CoolingStopList = ({
  coolingStops,
  highlightedRemoteSuitable,
  selectedId,
  onSelectStop
}: CoolingStopListProps) => (
  <section className="stack" aria-label="Candidate cooling stops">
    <div className="section-heading">
      <p className="eyebrow">Cooling</p>
      <h2>Candidate CoolRoute Stops</h2>
      <p>
        These locations are candidates only and require verification before any
        official designation.
      </p>
    </div>
    <div className="cooling-list">
      {coolingStops.map((location) => {
        const highlighted =
          highlightedRemoteSuitable && location.remoteClassSuitable === true;

        return (
          <button
            key={location.id}
            type="button"
            className={`cooling-list-card ${
              selectedId === location.id ? "selected" : ""
            } ${highlighted ? "highlighted" : ""}`}
            onClick={() => onSelectStop(location)}
          >
            <span className="eyebrow">Candidate CoolRoute Stop</span>
            <strong>{location.name}</strong>
            <span>{location.abbreviation}</span>
            <span>{location.address}</span>
            <span>Cooling level: {location.coolingLevel} - provisional</span>
            <span>
              Study suitability:{" "}
              {location.remoteClassSuitabilityNote ??
                (location.remoteClassSuitable
                  ? "Potentially"
                  : pendingVerification)}
            </span>
            <span>Amenities: {amenitySummary(location)}</span>
            <span>Verification: {location.verificationStatus}</span>
          </button>
        );
      })}
    </div>
  </section>
);
