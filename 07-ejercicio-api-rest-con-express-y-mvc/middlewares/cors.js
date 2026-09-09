import cors from "cors";

// Hicimos un cambio de nombre a mayuscula para que quede claro que es una constante no mutable. Es un cambio que no afecta el antes/después pero me gusta hacerlo para diferenciar variables de escritura y de lectura.
const ACCEPTED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:1234",
  "https://midu.dev",
  "http://jscamp.dev",
  "http://localhost:5173",
];

// Muy buena idea crear un objeto middleware para luego exportar todos los middleware en formato key/value dentro.
// En estos casos en los que queremos responsabilizar un archivo a una sola tarea, lo mejor es exportarlo como lo que es, el middleware encargado de los cors.
export const corsMiddleware = cors({ origin: ACCEPTED_ORIGINS });
