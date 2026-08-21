import { createServer } from "node:http";
import { json } from "node:stream/consumers";

import { handler } from "./src/handler.js";
import { users } from "./db/user.js";

process.loadEnvFile();
const port = process.env.PORT || 3000;

handler.start(port);

handler.get("/users", (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const queryParameters = Object.fromEntries(searchParams);

  const { name } = queryParameters;
  const { limit, offset } = queryParameters;
  const { minAge, maxAge } = queryParameters;

  const filters = {
    name,
    limit: limit ? Number(limit) : Infinity,
    offset: offset ? Number(offset) : 0,
    minAge: minAge ? Number(minAge) : 0,
    maxAge: maxAge ? Number(maxAge) : Infinity,
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
  const body = await json(req);

  const newUser = {
    id: crypto.randomUUID(),
    name: body.name,
    age: body.age,
  };

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
