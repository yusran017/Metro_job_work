import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WorkApp } from "./components/work-app";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WorkApp />
  </StrictMode>,
);
