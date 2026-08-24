import { json } from "node:stream/consumers";

import { randomUUID } from "node:crypto"; // Es buena practica importarlo del módulo en el que sabemos que existe. Si usamos solo `crypyo.randomUUID` corremos riesgo de que no sea de `node:crypto` si usamos otras librerías
import { users } from "./db/user.js";
import { handler } from "./src/handler.js";

/* Muy bien, pero si no tenemos un .env en el directorio dará error y no continuará el flujo de trabajo. Lo agregamos en un try/catch y solucionado */
let port = 3000
try {
  process.loadEnvFile();
  port = process.env.PORT || port
} catch {}
// const port = process.env.PORT || 3000;

handler.start(port);

handler.get("/users", (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const queryParameters = Object.fromEntries(searchParams);

  const { name } = queryParameters;
  const { limit, offset } = queryParameters;
  const { minAge, maxAge } = queryParameters;

  /* Buenísimo, antes de utilizar los valores de las searchParams, estaría bueno hacer validaciones: */
  const safeName = name ? name.toLowerCase() : "";

  const limitValue = Number(limit);
  const offsetValue = Number(offset);

  
  /* Con `isInteger` evitamos que pasen `NaN`, `Infinity`, `-Infinity` y/o números decimales. También evitamos que se pase un número negativo */
  const safeLimit = Number.isInteger(limitValue) && limitValue >= 0
    ? limitValue
    : Infinity;

  const safeOffset = Number.isInteger(offsetValue) && offsetValue >= 0
    ? offsetValue
    : 0;

  const safeMinAge = Number.isInteger(minAge) && minAge >= 0
    ? minAge
    : 0;

  const safeMaxAge = Number.isInteger(maxAge) && maxAge >= 0
    ? maxAge
    : Infinity;

  const filters = {
    name: safeName,
    limit: safeLimit,
    offset: safeOffset,
    minAge: safeMinAge,
    maxAge: safeMaxAge,
  };

  const compare = (str1, str2) =>
    str1.toLowerCase().includes(str2.toLowerCase());

  const filteredUsers = users
    .filter((user) => !filters.name || compare(user.name, filters.name))
    .filter((user) => user.age >= filters.minAge)
    .filter((user) => user.age <= filters.maxAge)
    .slice(filters.offset, filters.offset + filters.limit);

  const data = { users: filteredUsers };

  res.status(200).json(data);
});

handler.post("/users", async (req, res) => {
  /* Podemos hacer esto un poco más robusto: */
  try {
    const body = await json(req);

    const newUser = {
      id: randomUUID(),
      name: body.name,
      age: body.age,
    };

    users.push(newUser);
    res.status(201).json(newUser);
  } catch {
    res.status(400).json({
      error: "El body debe contener un JSON válido",
    });
  }
  users.push(newUser);
  res.status(201).json(newUser);
});

handler.get("/health", (req, res) => {
  const data = {
    status: "ok",
    uptime: process.uptime(),
  };

  res.status(200).json(data);
});
