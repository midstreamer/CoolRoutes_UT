import type { CoolRouteLocation } from "../types/location";

export const pendingVerification = "Pending verification";

export const locations: CoolRouteLocation[] = [
  {
    id: "home",
    sourceId: "HOME01",
    name: "Rise at West Campus",
    abbreviation: "HOME",
    type: "residence",
    latitude: 30.28587,
    longitude: -97.74414,
    address: "2206 Nueces St, Austin, TX 78705",
    publicAccessDescription: "Resident access",
    airConditioned: true,
    waterAvailable: null,
    seatingAvailable: true,
    wifiAvailable: true,
    accessible: null,
    remoteClassSuitable: true,
    staffed: false,
    hours: "Resident building access",
    verificationStatus:
      "Residence location; amenities not part of UT cooling-station approval",
    sourceUrl: "https://www.riseatwestcampus.com/"
  },
  {
    id: "bur",
    sourceId: "CLS01",
    name: "Burdine Hall",
    abbreviation: "BUR",
    type: "class-building",
    latitude: 30.28887,
    longitude: -97.73851,
    address: "2505 University Ave, Austin, TX 78712",
    publicAccessDescription: "Campus academic building",
    verificationStatus:
      "Location verified; cooling amenities require UT validation",
    sourceUrl:
      "https://utdirect.utexas.edu/apps/campus/buildings/information/nlogon/maps/UTM/BUR/"
  },
  {
    id: "mez",
    sourceId: "CLS02",
    name: "Mezes Hall",
    abbreviation: "MEZ",
    type: "class-building",
    latitude: 30.28437,
    longitude: -97.73896,
    address: "154 W 21st St, Austin, TX 78712",
    publicAccessDescription: "Campus academic building",
    verificationStatus:
      "Location verified; cooling amenities require UT validation",
    sourceUrl:
      "https://utdirect.utexas.edu/apps/campus/buildings/information/nlogon/maps/UTM/MEZ/"
  },
  {
    id: "gdc",
    sourceId: "CLS03",
    name: "Gates Dell Complex",
    abbreviation: "GDC",
    type: "class-building",
    latitude: 30.28625,
    longitude: -97.73645,
    address: "2317 Speedway, Austin, TX 78712",
    publicAccessDescription: "Campus academic building",
    verificationStatus:
      "Location verified; cooling amenities require UT validation",
    sourceUrl:
      "https://utdirect.utexas.edu/apps/campus/buildings/information/nlogon/maps/UTM/GDC/"
  },
  {
    id: "gar",
    sourceId: "CLS04",
    name: "Garrison Hall",
    abbreviation: "GAR",
    type: "class-building",
    latitude: 30.28514,
    longitude: -97.7385,
    address: "128 Inner Campus Dr, Austin, TX 78712",
    publicAccessDescription: "Campus academic building",
    verificationStatus:
      "Location verified; cooling amenities require UT validation",
    sourceUrl:
      "https://utdirect.utexas.edu/apps/campus/buildings/information/nlogon/maps/UTM/GAR/"
  },
  {
    id: "unb",
    sourceId: "CR001",
    name: "Texas Union",
    abbreviation: "UNB",
    type: "cooling-stop",
    status: "candidate",
    coolingLevel: 3,
    latitude: 30.28663,
    longitude: -97.74116,
    address: "2308 Whitis Ave, Austin, TX 78712",
    airConditioned: null,
    waterAvailable: null,
    seatingAvailable: null,
    wifiAvailable: null,
    accessible: null,
    publicAccess: true,
    publicAccessDescription: "Yes during posted hours",
    hours: pendingVerification,
    staffed: null,
    staffingNotes: "Building staff; CoolRoute staffing not assigned",
    remoteClassSuitable: true,
    remoteClassSuitabilityNote: "Potentially",
    verificationStatus:
      "Candidate only - requires UT approval and amenity validation",
    sourceUrl: "https://universityunions.utexas.edu/"
  },
  {
    id: "fac",
    sourceId: "CR002",
    name: "Peter T. Flawn Academic Center",
    abbreviation: "FAC",
    type: "cooling-stop",
    status: "candidate",
    coolingLevel: 2,
    latitude: 30.28629,
    longitude: -97.74043,
    address: "2304 Whitis Ave, Austin, TX 78712",
    airConditioned: null,
    waterAvailable: null,
    seatingAvailable: null,
    wifiAvailable: null,
    accessible: null,
    publicAccess: null,
    publicAccessDescription: "Campus facility",
    hours: pendingVerification,
    staffed: false,
    staffingNotes: "No CoolRoute staffing assigned",
    remoteClassSuitable: true,
    remoteClassSuitabilityNote: "Potentially",
    verificationStatus:
      "Candidate only - requires UT approval and amenity validation",
    sourceUrl: "https://www.utexas.edu/"
  },
  {
    id: "pcl",
    sourceId: "CR003",
    name: "Perry-Castañeda Library",
    abbreviation: "PCL",
    type: "cooling-stop",
    status: "candidate",
    coolingLevel: 3,
    latitude: 30.2824,
    longitude: -97.73788,
    address: "101 E 21st St, Austin, TX 78712",
    airConditioned: null,
    waterAvailable: null,
    seatingAvailable: true,
    wifiAvailable: null,
    accessible: null,
    publicAccess: true,
    publicAccessDescription: "Yes during posted library hours",
    hours: pendingVerification,
    staffed: null,
    staffingNotes: "Library staff; CoolRoute staffing not assigned",
    remoteClassSuitable: true,
    remoteClassSuitabilityNote: "Potentially strong",
    verificationStatus:
      "Candidate only - requires UT approval and amenity validation",
    sourceUrl: "https://www.lib.utexas.edu/"
  },
  {
    id: "wcp",
    sourceId: "CR004",
    name: "William C. Powers, Jr. Student Activity Center",
    abbreviation: "WCP",
    type: "cooling-stop",
    status: "candidate",
    coolingLevel: 3,
    latitude: 30.2849,
    longitude: -97.73645,
    address: "2201 Speedway, Austin, TX 78712",
    airConditioned: null,
    waterAvailable: null,
    seatingAvailable: true,
    wifiAvailable: null,
    accessible: null,
    publicAccess: true,
    publicAccessDescription: "Yes during posted hours",
    hours: pendingVerification,
    staffed: null,
    staffingNotes: "Building staff; CoolRoute staffing not assigned",
    remoteClassSuitable: true,
    remoteClassSuitabilityNote: "Potentially strong",
    verificationStatus:
      "Candidate only - requires UT approval and amenity validation",
    sourceUrl: "https://universityunions.utexas.edu/"
  }
];

export const locationsByAbbreviation = new Map(
  locations.map((location) => [location.abbreviation, location])
);

export const coolingStops = locations.filter(
  (location) => location.type === "cooling-stop"
);

export const getLocationByAbbreviation = (abbreviation?: string) =>
  abbreviation ? locationsByAbbreviation.get(abbreviation) : undefined;
