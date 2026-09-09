import cors from "cors";

const origins = [
  "http://localhost:3000",
  "http://localhost:1234",
  "https://midu.dev",
  "http://jscamp.dev",
  "http://localhost:5173",
];

export const middleware = {
  cors: cors({
    origin: origins,
  }),
};
