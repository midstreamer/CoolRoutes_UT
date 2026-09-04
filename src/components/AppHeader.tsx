import { WeatherBadge } from "./WeatherBadge";

export const AppHeader = () => (
  <header className="app-header">
    <div>
      <h1>
        CoolRoute <span>UT</span>
      </h1>
      <p className="tagline">Cooler paths. A healthier campus.</p>
    </div>
    <button type="button" className="header-search" aria-label="Search routes">
      search
    </button>
    <WeatherBadge />
  </header>
);
