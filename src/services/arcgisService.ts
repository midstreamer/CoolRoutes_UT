export const UT_ARCGIS_ITEM_ID =
  import.meta.env.VITE_UT_ARCGIS_ITEM_ID ||
  "4a4dcdffa48c45be82d2db03d73f587c";

export const campusCenter = {
  latitude: 30.2849,
  longitude: -97.7394,
  zoom: 16
};

export type ArcgisItemKind =
  | "web-map"
  | "feature-layer"
  | "feature-service"
  | "other";

export interface ArcgisItemInfo {
  id: string;
  type?: string;
  kind: ArcgisItemKind;
}

export const classifyArcgisItemType = (
  type?: string | null
): ArcgisItemKind => {
  const normalizedType = type?.toLowerCase() ?? "";

  if (normalizedType === "web map") {
    return "web-map";
  }

  if (normalizedType === "feature layer") {
    return "feature-layer";
  }

  if (normalizedType === "feature service") {
    return "feature-service";
  }

  return "other";
};
