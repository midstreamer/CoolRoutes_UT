# CoolRoute UT

Cooler paths. A healthier campus.

CoolRoute UT is a mobile-first student impact prototype for the University of Texas at Austin. It explores how campus navigation could consider walking time, heat exposure, cooling access, class schedules, and student wellness during extreme heat.

This is not an official University of Texas application. Candidate cooling locations are not approved official cooling stations.

## Tech Stack

- React
- Vite
- TypeScript
- ArcGIS Maps SDK for JavaScript
- `@arcgis/core`
- `@arcgis/map-components`
- `@esri/calcite-components`
- CSS with lightweight component-level classes
- Vitest for lightweight service tests

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Environment Variables

Copy `.env.example` to `.env` if you want to change local demo behavior.

```bash
VITE_UT_ARCGIS_ITEM_ID=4a4dcdffa48c45be82d2db03d73f587c
VITE_USE_DEMO_TIME=true
VITE_DEMO_DAY=Monday
VITE_DEMO_TIME=09:30
```

No ArcGIS credentials are required for the MVP because the UT item is public. Do not place secrets in source code.

## Project Structure

```text
src/
  components/      UI cards, navigation, map, schedule, cooling, about views
  data/            Pilot schedule, location metadata, prototype route options
  hooks/           Small React hooks for schedule and route selection
  services/        Schedule, route, and ArcGIS configuration helpers
  styles/          Global mobile-first CSS
  types/           Shared TypeScript models
public/data/       Starter GeoJSON for pilot locations and conceptual routes
```

## ArcGIS Layer Configuration

The app uses this public UT Austin ArcGIS item by default:

`4a4dcdffa48c45be82d2db03d73f587c`

At runtime, `CampusMap` loads the portal item and classifies whether it is a Web Map, Feature Layer, Feature Service, or another item type. Web Maps are loaded directly. Feature Layer and Feature Service items are added to a new map with an Esri basemap. If the item cannot be loaded, the app displays:

`UT campus layer could not be loaded. Displaying fallback basemap.`

CoolRoute origin, destination, candidate cooling stops, and selected route graphics are rendered above the campus layer.

## Data Files

The root pilot GIS package files are treated as source inputs for v0.1 data:

- `coolroute_ut_pilot_locations.csv`
- `coolroute_ut_monday_route_sequence.csv`
- `coolroute_ut_README.txt`

`public/data/coolroute_ut_pilot_locations.geojson` contains starter editable coordinates for:

- Rise at West Campus
- Burdine Hall
- Mezes Hall
- Gates Dell Complex
- Garrison Hall
- Texas Union
- Peter T. Flawn Academic Center
- Perry-Castañeda Library
- William C. Powers, Jr. Student Activity Center

`public/data/coolroute_ut_monday_conceptual_sequence.geojson` contains conceptual route lines and sequence metadata for MVP visualization. These route lines are not pedestrian navigation routes.

## Demo Mode

Demo mode defaults to Monday at 09:30 so the flagship handoff is always visible:

- Current origin: Burdine Hall
- Next class: SPN 601D
- Destination: Mezes Hall
- Minutes until class: 30

Disable demo mode by setting:

```bash
VITE_USE_DEMO_TIME=false
```

## Current Limitations

- Route times, exposure levels, and cooling scores are prototype estimates.
- Demo route geometry is conceptual and should not be treated as walkable routing.
- Weather is mock demo weather, not live weather.
- Candidate cooling stops have pending verification fields unless explicitly marked in local data.
- There is no backend, database, authentication, reservation system, or schedule integration.

## Future Roadmap

v0.2:
- Full schedule logic
- Remote-class recommendations
- More pilot routes

v0.3:
- ArcGIS route service
- Pedestrian network routing
- Actual route distance and travel time

v0.4:
- Weather API
- Heat index
- Heat alerts

v0.5:
- Shade / tree canopy layer
- Indoor pathways
- Heat exposure scoring

v0.6:
- UT-approved cooling station layer
- Verified amenities and hours

v0.7:
- Schedule integration
- MyUT / Canvas if permitted

v1.0:
- Campus pilot
- Analytics
- Student feedback
- Accessibility enhancements

## Testing

```bash
npm run test
npm run build
```

The service tests cover Monday demo time at 09:30 and the Tuesday remote-class case.

## Disclaimer

Prototype concept - not an official University of Texas application. Candidate cooling locations require UT approval before designation as official CoolRoute stops.
