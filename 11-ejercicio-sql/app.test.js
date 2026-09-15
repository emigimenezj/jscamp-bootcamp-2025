import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

process.env.NODE_ENV = "test";

const { default: app } = await import("./app.ts");

const TEST_PORT = 5678;
const API_URL = `http://localhost:${TEST_PORT}`;

// ============================================================================
// OBS: REIMPLEMENTACIÓN IDÉNTICA DE 08-ejercicio-testing-con-node-y-zod.
// ============================================================================
const http = {
  get: request.bind(null, "GET"),
  post: request.bind(null, "POST"),
  put: request.bind(null, "PUT"),
  patch: request.bind(null, "PATCH"),
  delete: request.bind(null, "DELETE"),
};
// ============================================================================

// Misma interfaz del ejercicio 08, pero con algunos ajustes para los endpoints de este ejercicio.
const api = {
  jobs: {
    list: (params) => http.get("/jobs", { params }),
    get: (id) => http.get(`/jobs/${encodeURIComponent(id)}`),
    create: (job) => http.post("/jobs", { body: job }),
    update: (id, changes) =>
      http.patch(`/jobs/${encodeURIComponent(id)}`, { body: changes }),
    remove: (id) => http.delete(`/jobs/${encodeURIComponent(id)}`),
  },
};

const factory = { job };

const check = {
  status(result, expected) {
    assert.equal(result.response.status, expected);
  },
};

let instance;

// ============================================================================
// OBS: REIMPLEMENTACIÓN IDÉNTICA DE 08-ejercicio-testing-con-node-y-zod.
// ============================================================================
const server = {
  start() {
    return new Promise((resolve, reject) => {
      instance = app.listen(TEST_PORT, resolve);
      instance.once("error", reject);
    });
  },

  stop() {
    return new Promise((resolve, reject) => {
      instance.close((error) => (error ? reject(error) : resolve()));
    });
  },
};
// ============================================================================

before(server.start);
after(server.stop);

describe("GET /jobs", () => {
  it("lista los jobs y permite filtrarlos", async () => {
    const result = await api.jobs.list();

    check.status(result, 200);
    assert.ok(Array.isArray(result.body));
    assert.ok(result.body.length > 0);

    const filtered = await api.jobs.list({ tech: "react" });

    check.status(filtered, 200);
    assert.ok(filtered.body.length > 0);
    assert.ok(
      filtered.body.every((item) => item.data.technology.includes("react")),
    );
  });
});

describe("GET /jobs/:id", () => {
  it("devuelve el job solicitado", async () => {
    const list = await api.jobs.list();
    const expected = list.body[0];
    const result = await api.jobs.get(expected.id);

    check.status(result, 200);
    assert.deepEqual(result.body, expected);
  });
});

describe("POST /jobs", () => {
  it("crea y guarda un job", async () => {
    const input = factory.job();
    const created = await api.jobs.create(input);

    check.status(created, 201);
    assert.ok(created.body.id);

    const { id, ...savedJob } = created.body;
    assert.deepEqual(savedJob, input);

    const persisted = await api.jobs.get(id);

    check.status(persisted, 200);
    assert.deepEqual(persisted.body, created.body);

    await api.jobs.remove(id);
  });
});

describe("PATCH /jobs/:id", () => {
  it("actualiza solo los campos enviados", async () => {
    const created = await api.jobs.create(factory.job());
    const changes = {
      title: "Senior Backend Developer",
      data: {
        technology: ["typescript", "sqlite"],
        modality: "hybrid",
        level: "senior",
      },
    };

    const updated = await api.jobs.update(created.body.id, changes);

    check.status(updated, 200);
    assert.deepEqual(updated.body, {
      ...created.body,
      ...changes,
    });

    await api.jobs.remove(created.body.id);
  });
});

describe("DELETE /jobs/:id", () => {
  it("elimina un job existente", async () => {
    const created = await api.jobs.create(factory.job());
    const removed = await api.jobs.remove(created.body.id);

    check.status(removed, 204);

    const deleted = await api.jobs.get(created.body.id);

    check.status(deleted, 404);
  });
});

describe("Persistencia SQLite", () => {
  it("conserva un job después de detener y reiniciar el servidor", async () => {
    const created = await api.jobs.create(
      factory.job({ title: "Persistence Test Engineer" }),
    );

    check.status(created, 201);

    await server.stop();
    await new Promise((resolve) => setTimeout(resolve, 50)); // Espera a que el cliente HTTP descarte la conexión keep-alive del servidor cerrado.
    await server.start();

    const persisted = await api.jobs.get(created.body.id);

    check.status(persisted, 200);
    assert.deepEqual(persisted.body, created.body);

    await api.jobs.remove(created.body.id);
  });
});

// ============================================================================
// OBS: REIMPLEMENTACIÓN IDÉNTICA DE 08-ejercicio-testing-con-node-y-zod.
// ============================================================================
async function request(method, path, options = {}) {
  const url = new URL(path, API_URL);

  for (const [name, value] of Object.entries(options.params ?? {})) {
    url.searchParams.set(name, value);
  }

  const response = await fetch(url, {
    method,
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return { response };
  }

  const body = await response.json();

  return { response, body };
}
// ============================================================================

function job(overrides = {}) {
  return {
    title: "Backend Developer",
    company: "Test Company",
    location: "Remote",
    description: "Development and maintenance of Node.js services.",
    data: {
      technology: ["node", "javascript"],
      modality: "remote",
      level: "mid",
    },
    content: {
      description: "Backend position.",
      responsibilities: "Develop and maintain services.",
      requirements: "Node.js and JavaScript.",
      about: "Technology company.",
    },
    ...overrides,
  };
}
