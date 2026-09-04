import type { RouteMode, RouteOption, RouteScenario } from "../types/route";

const disclaimer =
  "Prototype estimate — requires validation with actual pedestrian and shade data.";

const line = (...coordinates: [number, number][]) => coordinates;

const makeOption = (
  origin: string,
  destination: string,
  mode: RouteMode,
  estimatedMinutes: number,
  heatExposureLevel: RouteOption["heatExposureLevel"],
  outdoorExposurePercent: number,
  shadeIndoorPercent: number,
  coolingStopIds: string[],
  description: string,
  routeCoordinates: [number, number][],
  estimatedDistance?: number,
  guidance?: Pick<
    RouteOption,
    | "routingPriority"
    | "recommendedMode"
    | "candidateCoolingNodeNotes"
    | "timeConstraintNote"
  >
): RouteOption => ({
  id: `${origin}-${destination}-${mode}`,
  origin,
  destination,
  mode,
  estimatedMinutes,
  estimatedDistance,
  heatExposureLevel,
  outdoorExposurePercent,
  shadeIndoorPercent,
  coolingStopIds,
  description,
  ...guidance,
  routeCoordinates,
  disclaimer,
  prototypeEstimate: true
});

export const routeScenarios: RouteScenario[] = [
  {
    id: "HOME-BUR",
    origin: "HOME",
    destination: "BUR",
    options: {
      fastest: makeOption(
        "HOME",
        "BUR",
        "fastest",
        15,
        "high",
        86,
        14,
        [],
        "Direct West Campus approach with mostly outdoor exposure.",
        line([-97.74414, 30.28587], [-97.74116, 30.28663], [-97.73851, 30.28887]),
        0.7,
        {
          routingPriority: "Balanced / morning arrival",
          recommendedMode: "Fastest or Coolest",
          candidateCoolingNodeNotes: "Texas Union; FAC"
        }
      ),
      coolest: makeOption(
        "HOME",
        "BUR",
        "coolest",
        19,
        "moderate",
        62,
        38,
        ["unb"],
        "Adds a campus-center recovery opportunity near the Texas Union.",
        line(
          [-97.74414, 30.28587],
          [-97.74116, 30.28663],
          [-97.74043, 30.28629],
          [-97.73851, 30.28887]
        ),
        0.9,
        {
          routingPriority: "Balanced / morning arrival",
          recommendedMode: "Fastest or Coolest",
          candidateCoolingNodeNotes: "Texas Union; FAC"
        }
      ),
      "cooling-stops": makeOption(
        "HOME",
        "BUR",
        "cooling-stops",
        21,
        "moderate",
        58,
        42,
        ["unb", "fac"],
        "Includes candidate CoolRoute stops for short heat recovery breaks.",
        line(
          [-97.74414, 30.28587],
          [-97.74116, 30.28663],
          [-97.74043, 30.28629],
          [-97.73851, 30.28887]
        ),
        1,
        {
          routingPriority: "Balanced / morning arrival",
          recommendedMode: "Fastest or Coolest",
          candidateCoolingNodeNotes: "Texas Union; FAC"
        }
      )
    }
  },
  {
    id: "BUR-MEZ",
    origin: "BUR",
    destination: "MEZ",
    options: {
      fastest: makeOption(
        "BUR",
        "MEZ",
        "fastest",
        8,
        "high",
        82,
        18,
        [],
        "Shortest prototype connector with mostly outdoor exposure.",
        line([-97.73851, 30.28887], [-97.7387, 30.2865], [-97.73896, 30.28437]),
        0.35,
        {
          routingPriority: "Time constrained (30-minute transition)",
          recommendedMode: "Fastest or Coolest",
          candidateCoolingNodeNotes: "FAC; Texas Union if on-route",
          timeConstraintNote:
            "Do not recommend a cooling stop if detour threatens on-time arrival."
        }
      ),
      coolest: makeOption(
        "BUR",
        "MEZ",
        "coolest",
        11,
        "moderate",
        55,
        45,
        ["fac"],
        "Adds approximately 3 minutes compared with the fastest route but provides more shaded or indoor travel.",
        line(
          [-97.73851, 30.28887],
          [-97.74116, 30.28663],
          [-97.74043, 30.28629],
          [-97.73896, 30.28437]
        ),
        0.45,
        {
          routingPriority: "Time constrained (30-minute transition)",
          recommendedMode: "Fastest or Coolest",
          candidateCoolingNodeNotes: "FAC; Texas Union if on-route",
          timeConstraintNote:
            "Do not recommend a cooling stop if detour threatens on-time arrival."
        }
      ),
      "cooling-stops": makeOption(
        "BUR",
        "MEZ",
        "cooling-stops",
        13,
        "moderate",
        50,
        50,
        ["fac"],
        "Includes one candidate cooling stop for additional recovery opportunity.",
        line(
          [-97.73851, 30.28887],
          [-97.74043, 30.28629],
          [-97.73896, 30.28437]
        ),
        0.5,
        {
          routingPriority: "Time constrained (30-minute transition)",
          recommendedMode: "Fastest or Coolest",
          candidateCoolingNodeNotes: "FAC; Texas Union if on-route",
          timeConstraintNote:
            "Do not recommend a cooling stop if detour threatens on-time arrival."
        }
      )
    }
  },
  {
    id: "MEZ-GDC",
    origin: "MEZ",
    destination: "GDC",
    options: {
      fastest: makeOption(
        "MEZ",
        "GDC",
        "fastest",
        12,
        "high",
        78,
        22,
        [],
        "Direct eastbound connector toward Gates Dell Complex.",
        line([-97.73896, 30.28437], [-97.7375, 30.2852], [-97.73645, 30.28625]),
        0.55,
        {
          routingPriority: "Heat-aware midday route",
          recommendedMode: "Coolest or Cooling Stops",
          candidateCoolingNodeNotes: "PCL; WCP",
          timeConstraintNote:
            "Student has about 60 minutes, so midday heat exposure is more relevant."
        }
      ),
      coolest: makeOption(
        "MEZ",
        "GDC",
        "coolest",
        15,
        "moderate",
        60,
        40,
        ["wcp"],
        "Prioritizes a cooler campus-core segment before turning toward GDC.",
        line(
          [-97.73896, 30.28437],
          [-97.73788, 30.2824],
          [-97.73645, 30.2849],
          [-97.73645, 30.28625]
        ),
        0.65,
        {
          routingPriority: "Heat-aware midday route",
          recommendedMode: "Coolest or Cooling Stops",
          candidateCoolingNodeNotes: "PCL; WCP",
          timeConstraintNote:
            "Student has about 60 minutes, so midday heat exposure is more relevant."
        }
      ),
      "cooling-stops": makeOption(
        "MEZ",
        "GDC",
        "cooling-stops",
        17,
        "moderate",
        54,
        46,
        ["pcl", "wcp"],
        "Routes through candidate study and recovery points before the afternoon class.",
        line(
          [-97.73896, 30.28437],
          [-97.73788, 30.2824],
          [-97.73645, 30.2849],
          [-97.73645, 30.28625]
        ),
        0.8,
        {
          routingPriority: "Heat-aware midday route",
          recommendedMode: "Coolest or Cooling Stops",
          candidateCoolingNodeNotes: "PCL; WCP",
          timeConstraintNote:
            "Student has about 60 minutes, so midday heat exposure is more relevant."
        }
      )
    }
  },
  {
    id: "GDC-HOME",
    origin: "GDC",
    destination: "HOME",
    options: {
      fastest: makeOption(
        "GDC",
        "HOME",
        "fastest",
        20,
        "high",
        88,
        12,
        [],
        "Direct return to West Campus after the final Monday class.",
        line([-97.73645, 30.28625], [-97.7405, 30.286], [-97.74414, 30.28587]),
        1,
        {
          routingPriority: "Maximum heat reduction",
          recommendedMode: "Coolest or Maximum Cooling",
          candidateCoolingNodeNotes: "WCP; FAC; Texas Union",
          timeConstraintNote:
            "No next-class deadline; route can trade extra minutes for lower outdoor heat exposure."
        }
      ),
      coolest: makeOption(
        "GDC",
        "HOME",
        "coolest",
        24,
        "moderate",
        61,
        39,
        ["wcp", "unb"],
        "Adds a campus stop and reduces the longest uninterrupted outdoor segment.",
        line(
          [-97.73645, 30.28625],
          [-97.73645, 30.2849],
          [-97.74043, 30.28629],
          [-97.74116, 30.28663],
          [-97.74414, 30.28587]
        ),
        1.15,
        {
          routingPriority: "Maximum heat reduction",
          recommendedMode: "Coolest or Maximum Cooling",
          candidateCoolingNodeNotes: "WCP; FAC; Texas Union",
          timeConstraintNote:
            "No next-class deadline; route can trade extra minutes for lower outdoor heat exposure."
        }
      ),
      "cooling-stops": makeOption(
        "GDC",
        "HOME",
        "cooling-stops",
        27,
        "moderate",
        57,
        43,
        ["wcp", "fac", "unb"],
        "Adds candidate CoolRoute stops before the longer West Campus return.",
        line(
          [-97.73645, 30.28625],
          [-97.73645, 30.2849],
          [-97.74043, 30.28629],
          [-97.74116, 30.28663],
          [-97.74414, 30.28587]
        ),
        1.25,
        {
          routingPriority: "Maximum heat reduction",
          recommendedMode: "Coolest or Maximum Cooling",
          candidateCoolingNodeNotes: "WCP; FAC; Texas Union",
          timeConstraintNote:
            "No next-class deadline; route can trade extra minutes for lower outdoor heat exposure."
        }
      )
    }
  }
];

export const defaultRouteScenarioId = "BUR-MEZ";
