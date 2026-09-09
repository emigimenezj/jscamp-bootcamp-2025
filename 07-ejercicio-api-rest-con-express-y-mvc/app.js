import express from "express";
import { DEFAULTS } from "./config.js";
import { middleware } from "./middlewares/cors.js";
import { logger, error } from "./middlewares/logger.js";

import { jobsRouter } from "./routes/jobs.js";

const app = express();

app.use(logger);
app.use(middleware.cors);
app.use(express.json());

app.use("/jobs", jobsRouter);

app.use(error);

app.listen(DEFAULTS.PORT, () => {
  console.log(`Servidor levantado en http://localhost:${DEFAULTS.PORT}`);
});
