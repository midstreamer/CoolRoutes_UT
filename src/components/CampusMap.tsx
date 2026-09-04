import { useEffect, useRef, useState } from "react";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import ArcGISMap from "@arcgis/core/Map";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
import PortalItem from "@arcgis/core/portal/PortalItem";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import {
  campusCenter,
  classifyArcgisItemType,
  UT_ARCGIS_ITEM_ID
} from "../services/arcgisService";
import type { CoolRouteLocation } from "../types/location";
import type { RouteOption } from "../types/route";

interface CampusMapProps {
  origin?: CoolRouteLocation;
  destination?: CoolRouteLocation;
  coolingStops: CoolRouteLocation[];
  selectedRoute: RouteOption;
  selectedCoolingStopId?: string;
  onSelectCoolingStop: (location: CoolRouteLocation) => void;
}

const getRouteSymbol = (route: RouteOption) => {
  if (route.mode === "fastest" && route.isLiveRoute) {
    return new SimpleLineSymbol({
      color: "#bf5700",
      width: 4,
      style: "solid"
    });
  }

  return new SimpleLineSymbol({
    color: route.mode === "fastest" ? "#bf5700" : "#2563eb",
    width: 3,
    style: route.mode === "fastest" ? "short-dash" : "solid"
  });
};

const makePoint = (location: CoolRouteLocation) =>
  new Point({
    longitude: location.longitude,
    latitude: location.latitude,
    spatialReference: { wkid: 4326 }
  });

const makeMarkerSymbol = (location: CoolRouteLocation, selected: boolean) => {
  if (location.type === "cooling-stop") {
    return new SimpleMarkerSymbol({
      style: "diamond",
      color: selected ? "#1d4ed8" : "#60a5fa",
      size: selected ? 16 : 13,
      outline: {
        color: "#0f172a",
        width: selected ? 2 : 1
      }
    });
  }

  if (location.type === "residence") {
    return new SimpleMarkerSymbol({
      style: "square",
      color: "#15803d",
      size: 13,
      outline: { color: "#ffffff", width: 2 }
    });
  }

  return new SimpleMarkerSymbol({
    style: "circle",
    color: "#bf5700",
    size: selected ? 15 : 13,
    outline: { color: "#ffffff", width: 2 }
  });
};

const makeLabelGraphic = (location: CoolRouteLocation) =>
  new Graphic({
    geometry: makePoint(location),
    symbol: new TextSymbol({
      text:
        location.type === "cooling-stop"
          ? ""
          : location.abbreviation,
      color: "#111827",
      haloColor: "#ffffff",
      haloSize: 1,
      yoffset: 18,
      font: {
        size: 11,
        weight: "bold"
      }
    })
  });

const makeLocationGraphic = (
  location: CoolRouteLocation,
  selectedCoolingStopId?: string
) => {
  const selected = selectedCoolingStopId === location.id;
  const amenitiesSummary =
    "A/C: Pending verification. Water: Pending verification. Seating: " +
    (location.seatingAvailable ? "Available. " : "Pending verification. ") +
    "Wi-Fi: Pending verification.";

  return new Graphic({
    geometry: makePoint(location),
    symbol: makeMarkerSymbol(location, selected),
    attributes: {
      id: location.id,
      abbreviation: location.abbreviation,
      type: location.type
    },
    popupTemplate: {
      title: location.name,
      content:
        location.type === "cooling-stop"
          ? `<strong>Candidate CoolRoute Stop</strong><br />Cooling level: Level ${location.coolingLevel} - provisional<br />${amenitiesSummary}<br /><small>Requires UT approval before designation as an official CoolRoute stop.</small>`
          : `<strong>${location.abbreviation}</strong><br />${location.type === "residence" ? "Residence origin" : "Class building"}`
    }
  });
};

const makeRouteGraphic = (route: RouteOption) =>
  new Graphic({
    geometry: new Polyline({
      paths: [route.routeCoordinates ?? []],
      spatialReference: { wkid: route.routeSpatialReferenceWkid ?? 4326 }
    }),
    symbol: getRouteSymbol(route),
    attributes: {
      id: route.id,
      mode: route.mode
    },
    popupTemplate: {
      title:
        route.mode === "fastest" && route.isLiveRoute
          ? "ArcGIS walking route"
          : "Demo route geometry",
      content:
        route.mode === "fastest" && route.isLiveRoute
          ? "Walking time and distance are calculated from ArcGIS pedestrian routing. Heat exposure is not yet incorporated."
          : "These route lines are conceptual MVP connectors and are not pedestrian navigation routes."
    }
  });

export const CampusMap = ({
  origin,
  destination,
  coolingStops,
  selectedRoute,
  selectedCoolingStopId,
  onSelectCoolingStop
}: CampusMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<MapView | null>(null);
  const routeLayerRef = useRef<GraphicsLayer | null>(null);
  const locationLayerRef = useRef<GraphicsLayer | null>(null);
  const coolingStopsRef = useRef(coolingStops);
  const onSelectCoolingStopRef = useRef(onSelectCoolingStop);
  const [warning, setWarning] = useState<string>();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    coolingStopsRef.current = coolingStops;
    onSelectCoolingStopRef.current = onSelectCoolingStop;
  }, [coolingStops, onSelectCoolingStop]);

  useEffect(() => {
    const container = mapContainerRef.current;

    if (!container) {
      return;
    }

    let cancelled = false;
    let clickHandle: __esri.Handle | undefined;
    const routeLayer = new GraphicsLayer({ title: "CoolRoute demo routes" });
    const locationLayer = new GraphicsLayer({
      title: "CoolRoute pilot locations"
    });

    const initializeMap = async () => {
      let map: ArcGISMap | WebMap;

      try {
        const portalItem = new PortalItem({ id: UT_ARCGIS_ITEM_ID });
        await portalItem.load();
        const kind = classifyArcgisItemType(portalItem.type);

        if (kind === "web-map") {
          map = new WebMap({ portalItem });
        } else {
          map = new ArcGISMap({ basemap: "streets-vector" });

          if (kind === "feature-layer" || kind === "feature-service") {
            const campusLayer = new FeatureLayer({
              portalItem,
              title: "UT Austin campus layer"
            });
            map.add(campusLayer);
          } else {
            setWarning(
              "UT campus layer could not be loaded. Displaying fallback basemap."
            );
          }
        }
      } catch {
        map = new ArcGISMap({ basemap: "streets-vector" });
        setWarning(
          "UT campus layer could not be loaded. Displaying fallback basemap."
        );
      }

      if (cancelled) {
        return;
      }

      map.addMany([routeLayer, locationLayer]);

      const view = new MapView({
        container,
        map,
        center: [campusCenter.longitude, campusCenter.latitude],
        zoom: campusCenter.zoom,
        constraints: {
          snapToZoom: false
        },
        popup: {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: false,
            position: "bottom-center"
          }
        }
      });

      await view.when();
      viewRef.current = view;
      routeLayerRef.current = routeLayer;
      locationLayerRef.current = locationLayer;
      setMapReady(true);

      clickHandle = view.on("click", async (event) => {
        const response = await view.hitTest(event);
        const graphic = response.results
          .map((result) => (result as { graphic?: Graphic }).graphic)
          .find((hitGraphic) => hitGraphic?.attributes?.type === "cooling-stop");
        const location = coolingStopsRef.current.find(
          (stop) => stop.id === graphic?.attributes?.id
        );

        if (location) {
          onSelectCoolingStopRef.current(location);
        }
      });
    };

    void initializeMap();

    return () => {
      cancelled = true;
      clickHandle?.remove();
      viewRef.current?.destroy();
      viewRef.current = null;
      routeLayerRef.current = null;
      locationLayerRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const routeLayer = routeLayerRef.current;
    const locationLayer = locationLayerRef.current;
    const view = viewRef.current;

    if (!mapReady || !routeLayer || !locationLayer || !view) {
      return;
    }

    routeLayer.removeAll();
    locationLayer.removeAll();

    // These route lines are conceptual MVP connectors and are not pedestrian navigation routes.
    const currentRouteGraphic = makeRouteGraphic(selectedRoute);
    routeLayer.add(currentRouteGraphic);

    const visibleLocations = [
      origin,
      destination,
      ...coolingStops
    ].filter((location): location is CoolRouteLocation => Boolean(location));
    const locationGraphics = visibleLocations.flatMap((location) => {
      const graphics = [makeLocationGraphic(location, selectedCoolingStopId)];

      if (location.type !== "cooling-stop") {
        graphics.push(makeLabelGraphic(location));
      }

      return graphics;
    });

    locationLayer.addMany(locationGraphics);

    const extent = currentRouteGraphic.geometry?.extent;
    if (extent) {
      void view.goTo(extent.expand(1.8), { duration: 600 }).catch(() => {
        view.center = [campusCenter.longitude, campusCenter.latitude];
      });
    }
  }, [
    origin,
    destination,
    coolingStops,
    selectedRoute,
    selectedCoolingStopId,
    mapReady
  ]);

  return (
    <section className="map-card" aria-label="Interactive ArcGIS campus map">
      {warning ? <div className="map-warning">{warning}</div> : null}
      <div className="map-mode-pills" aria-label="Map layers">
        <button type="button" className="active">
          Best Route
        </button>
        <button type="button">Cooling Stops</button>
        <button type="button">Shade</button>
      </div>
      <div className="map-legend" aria-label="Map legend">
        <span>
          <i className="legend-dot cooling" /> Cooling Stop
        </span>
        <span>
          <i
            className={`legend-line fastest ${
              selectedRoute.mode === "fastest" && selectedRoute.isLiveRoute
                ? "live"
                : ""
            }`}
          />{" "}
          Fastest Route{" "}
          {selectedRoute.mode === "fastest" && selectedRoute.isLiveRoute
            ? "Live pedestrian"
            : "Prototype fallback"}
        </span>
        <span>
          <i className="legend-line selected" /> Coolest Route Concept
        </span>
        <span>
          <i className="legend-line alternate" /> Cooling Stop Concept
        </span>
      </div>
      <div ref={mapContainerRef} className="campus-map" />
      <button type="button" className="locate-button" aria-label="Center map">
        near
      </button>
    </section>
  );
};
