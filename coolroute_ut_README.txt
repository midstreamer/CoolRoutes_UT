# CoolRoute UT Pilot GIS Package

Files
- coolroute_ut_pilot_locations.csv — ArcGIS-ready point table with latitude/longitude.
- coolroute_ut_pilot_locations.geojson — same locations as GeoJSON points.
- coolroute_ut_monday_route_sequence.csv — Monday trip sequence and routing logic.
- coolroute_ut_monday_conceptual_sequence.geojson — straight-line conceptual connectors ONLY.

Important
The route LineStrings are not walking directions. They are visual sequence connectors for the MVP.
Before any navigation pilot, replace them with routes generated against a validated pedestrian network.

Cooling-stop records are candidate/provisional only. UT must validate access, hours, A/C,
water, seating, Wi-Fi, accessibility, staffing, and authorization before any location is presented
as an official cooling station.

Coordinate sources were drawn from UT Austin building/address pages, UT Parking & Transportation's
GPS coordinate page where available, and OpenStreetMap/Mapcarta building centroids for MVP mapping.
