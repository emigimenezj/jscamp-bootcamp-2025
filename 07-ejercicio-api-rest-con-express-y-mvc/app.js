import express from "express";
import { DEFAULTS } from "./config.js";
import { middleware } from "./middlewares/cors.js";

import { jobsRouter } from "./routes/jobs.js";

const app = express();

app.use(middleware.cors);
app.use(express.json());

app.use("/jobs", jobsRouter);

app.listen(DEFAULTS.PORT, () => {
  console.log(`Servidor levantado en http://localhost:${DEFAULTS.PORT}`);
});

/*
TODO:
- Optimizar el código del Controller
  - ¿Trabajar las validaciones a través de un middleware? (pensar)
- Implementar un logger para registrar las peticiones y respuestas (improvisado)
- 
*/
