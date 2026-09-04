import { pendingVerification } from "../data/locations";
import type { CoolRouteLocation } from "../types/location";

interface CoolingStopCardProps {
  location?: CoolRouteLocation;
  onClose?: () => void;
}

const statusText = (value?: boolean | null, trueLabel = "Available") => {
  if (value === true) {
    return trueLabel;
  }

  if (value === false) {
    return "Not documented";
  }

  return pendingVerification;
};

export const CoolingStopCard = ({ location, onClose }: CoolingStopCardProps) => {
  if (!location) {
    return null;
  }

  return (
    <aside className="card cooling-stop-card" aria-label="Cooling stop details">
      <div className="card-title-row">
        <div>
          <p className="eyebrow">Candidate CoolRoute Stop</p>
          <h2>{location.name}</h2>
        </div>
        {onClose ? (
          <button
            type="button"
            className="icon-button"
            aria-label="Close cooling stop details"
            onClick={onClose}
          >
            x
          </button>
        ) : null}
      </div>
      <dl className="detail-grid">
        {location.address ? (
          <div>
            <dt>Address</dt>
            <dd>{location.address}</dd>
          </div>
        ) : null}
        <div>
          <dt>Cooling level</dt>
          <dd>Level {location.coolingLevel ?? "?"} - provisional</dd>
        </div>
        <div>
          <dt>A/C</dt>
          <dd>{statusText(location.airConditioned)}</dd>
        </div>
        <div>
          <dt>Water</dt>
          <dd>{statusText(location.waterAvailable)}</dd>
        </div>
        <div>
          <dt>Seating</dt>
          <dd>{statusText(location.seatingAvailable)}</dd>
        </div>
        <div>
          <dt>Wi-Fi</dt>
          <dd>{statusText(location.wifiAvailable)}</dd>
        </div>
        <div>
          <dt>Remote class suitable</dt>
          <dd>
            {location.remoteClassSuitabilityNote ??
              statusText(location.remoteClassSuitable, "Potentially")}
          </dd>
        </div>
        <div>
          <dt>Public access</dt>
          <dd>{location.publicAccessDescription ?? pendingVerification}</dd>
        </div>
        <div>
          <dt>Staffing</dt>
          <dd>{location.staffingNotes ?? pendingVerification}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>Candidate only</dd>
        </div>
      </dl>
      <p className="prototype-note">
        Requires UT approval before designation as an official CoolRoute stop.
      </p>
    </aside>
  );
};
