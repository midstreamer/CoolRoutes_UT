export type LocationType = "residence" | "class-building" | "cooling-stop";

export type CoolingStatus = "candidate" | "approved" | "inactive";

export interface CoolRouteLocation {
  id: string;
  sourceId?: string;
  name: string;
  abbreviation: string;
  type: LocationType;
  latitude: number;
  longitude: number;
  address?: string;
  status?: CoolingStatus;
  coolingLevel?: number;
  airConditioned?: boolean | null;
  waterAvailable?: boolean | null;
  seatingAvailable?: boolean | null;
  wifiAvailable?: boolean | null;
  accessible?: boolean | null;
  publicAccess?: boolean | null;
  publicAccessDescription?: string;
  hours?: string;
  staffed?: boolean | null;
  staffingNotes?: string;
  remoteClassSuitable?: boolean | null;
  remoteClassSuitabilityNote?: string;
  verificationStatus?: string;
  sourceUrl?: string;
}
