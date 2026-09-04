import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@arcgis/core/assets/esri/themes/light/main.css";
import "@esri/calcite-components/dist/calcite/calcite.css";
import "./styles/globals.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
