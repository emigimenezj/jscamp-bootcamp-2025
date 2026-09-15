import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";

// Comentario completamente artificial para probar CI/CD. 😁

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
