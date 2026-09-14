import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

process.env.NODE_ENV = "test";

const { default: app } = await import("./app.js");

const TEST_PORT = 5678;
const API_URL = `http://localhost:${TEST_PORT}`;
const INVALID_ID = "invalid-id";

const http = {
  get: request.bind(null, "GET"),
  post: request.bind(null, "POST"),
  put: request.bind(null, "PUT"),
  patch: request.bind(null, "PATCH"),
  delete: request.bind(null, "DELETE"),
};

const api = {
  jobs: {
    list: (params) => http.get("/jobs", { params }),
    get: (id) => http.get(`/jobs/${encodeURIComponent(id)}`),
    create: (job) => http.post("/jobs", { body: job }),
    replace: (id, job) =>
      http.put(`/jobs/${encodeURIComponent(id)}`, { body: job }),
    update: (id, changes) =>
      http.patch(`/jobs/${encodeURIComponent(id)}`, { body: changes }),
    remove: (id) => http.delete(`/jobs/${encodeURIComponent(id)}`),
  },
};

const factory = { job };

const verify = {
  invalid: {
    async title(job) {
      const result = await api.jobs.create(job);

      check.status(result, 400);
      assert.equal(result.body.error, "Invalid Request");
      assert.ok(
        result.body.details.some((issue) => issue.path.includes("titulo")),
        "La respuesta debe identificar el campo titulo como inválido",
      );
    },
  },
};

const check = {
  status(result, expected) {
    assert.equal(result.response.status, expected);
  },

  error(result) {
    assert.equal(typeof result.body.error, "string");
    assert.ok(result.body.error.length > 0);
  },
};

let instance;

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

before(server.start);
after(server.stop);

describe("GET /jobs", () => {
  describe("Respuesta base", () => {
    it("devuelve 200 y un array de trabajos", async () => {
      const result = await api.jobs.list();

      check.status(result, 200);
      assert.ok(Array.isArray(result.body.data));
    });
  });

  describe("Filtros", () => {
    it("devuelve únicamente trabajos con la tecnología solicitada", async () => {
      const result = await api.jobs.list({ technology: "react" });

      check.status(result, 200);
      assert.ok(result.body.data.length > 0);
      assert.ok(
        result.body.data.every((job) => job.data.technology.includes("react")),
      );
    });

    it("ignora los query parameters no soportados", async () => {
      const [baseline, unsupported] = await Promise.all([
        api.jobs.list(),
        api.jobs.list({ unsupportedFilter: "value" }),
      ]);

      check.status(unsupported, 200);
      assert.deepEqual(unsupported.body, baseline.body);
    });

    it("combina múltiples filtros mediante un AND lógico", async () => {
      const [byTech, byLevel, combined] = await Promise.all([
        api.jobs.list({ technology: "react", limit: 1000 }),
        api.jobs.list({ level: "mid-level", limit: 1000 }),
        api.jobs.list({
          technology: "react",
          level: "mid-level",
          limit: 1000,
        }),
      ]);

      const createIdsSet = ({ body }) =>
        new Set(body.data.map((job) => job.id));

      const techIdsSet = createIdsSet(byTech);
      const levelIdsSet = createIdsSet(byLevel);
      const expectedIds = [...techIdsSet.intersection(levelIdsSet)];

      const actualIds = combined.body.data.map((job) => job.id);

      check.status(combined, 200);
      assert.ok(actualIds.length > 0);
      assert.deepEqual(actualIds, expectedIds);

      const isReactMidLevel = ({ data }) =>
        data.technology.includes("react") && data.nivel === "mid-level";
      assert.ok(combined.body.data.every(isReactMidLevel));
    });
  });

  describe("Paginación", () => {
    it("respeta el límite de resultados solicitado", async () => {
      const result = await api.jobs.list({ limit: 2 });

      check.status(result, 200);
      assert.equal(result.body.limit, 2);
      assert.equal(result.body.data.length, 2);
    });

    it("aplica el offset desde el resultado indicado", async () => {
      const [baseline, shifted] = await Promise.all([
        api.jobs.list(),
        api.jobs.list({ offset: 1 }),
      ]);

      const expected = baseline.body.data[1]?.id;

      check.status(shifted, 200);
      assert.equal(shifted.body.offset, 1);
      assert.ok(
        expected,
        "Se necesitan al menos 2 jobs para verificar el offset",
      );
      assert.equal(shifted.body.data[0].id, expected);
    });

    it("combina el límite y el offset sobre los resultados indicados", async () => {
      const [baseline, page] = await Promise.all([
        api.jobs.list(),
        api.jobs.list({ offset: 1, limit: 2 }),
      ]);

      const expected = baseline.body.data.slice(1, 3).map((job) => job.id);

      check.status(page, 200);
      assert.equal(page.body.offset, 1);
      assert.equal(page.body.limit, 2);
      assert.ok(
        expected.length === 2,
        "Se necesitan al menos 3 jobs para verificar el límite y el offset",
      );
      assert.deepEqual(
        page.body.data.map((job) => job.id),
        expected,
      );
    });

    it("documenta el comportamiento actual ante un límite negativo", async () => {
      const [all, negative] = await Promise.all([
        api.jobs.list({ limit: 1000 }),
        api.jobs.list({ limit: -1 }),
      ]);

      check.status(negative, 200);
      assert.equal(negative.body.limit, -1);
      assert.equal(negative.body.data.length, all.body.data.length - 1);
    });

    it("devuelve un array vacío cuando el offset supera los resultados disponibles", async () => {
      const TARGET_OFFSET = 10_000;
      const result = await api.jobs.list({
        offset: TARGET_OFFSET,
      });

      check.status(result, 200);
      assert.equal(result.body.offset, TARGET_OFFSET);
      assert.deepEqual(result.body.data, []);
    });
  });
});

describe("GET /jobs/:id", () => {
  describe("Recurso existente", () => {
    it("devuelve 200 y el trabajo solicitado", async () => {
      const list = await api.jobs.list({ limit: 1 });
      const [expected] = list.body.data;

      check.status(list, 200);
      assert.ok(expected, "Se necesita al menos un job para realizar el test");

      const result = await api.jobs.get(expected.id);

      check.status(result, 200);
      assert.equal(result.body.id, expected.id);
      assert.deepEqual(result.body, expected);
    });
  });

  describe("Recurso inexistente", () => {
    it("devuelve 404 y un error para un id que no existe", async () => {
      const result = await api.jobs.get(INVALID_ID);

      check.status(result, 404);
      check.error(result);
    });
  });
});

describe("POST /jobs", () => {
  describe("Creación", () => {
    it("devuelve 201, genera un id y conserva los datos enviados", async () => {
      const job = factory.job();
      const result = await api.jobs.create(job);
      const { body } = result;

      check.status(result, 201);
      assert.equal(typeof body.id, "string");
      assert.ok(body.id.length > 0);

      const { id, ...created } = body;
      assert.deepEqual(created, job);

      const persisted = await api.jobs.get(id);

      check.status(persisted, 200);
      assert.deepEqual(persisted.body, body);
    });
  });

  describe("Validación del título", () => {
    it("rechaza un título con menos de 3 caracteres", async () => {
      await verify.invalid.title(factory.job({ titulo: "JS" }));
    });

    it("rechaza un título con más de 100 caracteres", async () => {
      await verify.invalid.title(factory.job({ titulo: "a".repeat(101) }));
    });

    it("rechaza una petición sin título", async () => {
      await verify.invalid.title(factory.job({ titulo: undefined }));
    });

    it("rechaza un título que no sea un string", async () => {
      await verify.invalid.title(factory.job({ titulo: 123 }));
    });
  });

  describe("Campos opcionales", () => {
    it("permite crear un trabajo sin descripción", async () => {
      const job = factory.job({ descripcion: undefined });
      const result = await api.jobs.create(job);
      const { body } = result;

      check.status(result, 201);
      assert.equal(typeof body.id, "string");
      assert.ok(body.id.length > 0);
      assert.equal(Object.hasOwn(body, "descripcion"), false);
    });
  });
});

describe("PUT /jobs/:id", () => {
  describe("Actualización completa", () => {
    it("devuelve 204 y reemplaza todos los datos del trabajo", async () => {
      const created = await api.jobs.create(factory.job());
      const replacement = factory.job.alternative();

      check.status(created, 201);
      assert.ok(created.body.id);

      const replaced = await api.jobs.replace(created.body.id, replacement);

      check.status(replaced, 204);

      const updated = await api.jobs.get(created.body.id);

      check.status(updated, 200);
      assert.deepEqual(updated.body, {
        ...replacement,
        id: created.body.id,
      });
    });
  });

  describe("Recurso inexistente", () => {
    it("devuelve 404 cuando el id no existe", async () => {
      const result = await api.jobs.replace(INVALID_ID, factory.job());

      check.status(result, 404);
    });
  });
});

describe("PATCH /jobs/:id", () => {
  describe("Actualización parcial", () => {
    it("devuelve 204, actualiza los campos enviados y conserva el resto", async () => {
      const created = await api.jobs.create(factory.job());
      const original = created.body;
      const changes = {
        titulo: "Backend Engineer",
        ubicacion: "Buenos Aires",
      };

      check.status(created, 201);
      assert.ok(original.id);

      const result = await api.jobs.update(original.id, changes);

      check.status(result, 204);

      const updated = await api.jobs.get(original.id);

      check.status(updated, 200);
      assert.deepEqual(updated.body, {
        ...original,
        ...changes,
      });
    });
  });

  describe("Recurso inexistente", () => {
    it("devuelve 404 cuando el id no existe", async () => {
      const result = await api.jobs.update(INVALID_ID, {
        titulo: "Updated Job",
      });

      check.status(result, 404);
    });
  });
});

describe("DELETE /jobs/:id", () => {
  describe("Eliminación", () => {
    it("devuelve 204 y elimina el trabajo", async () => {
      const created = await api.jobs.create(factory.job());

      check.status(created, 201);
      assert.ok(created.body.id);

      const removed = await api.jobs.remove(created.body.id);

      check.status(removed, 204);

      const deleted = await api.jobs.get(created.body.id);

      check.status(deleted, 404);
      check.error(deleted);
    });
  });

  describe("Recurso inexistente", () => {
    it("devuelve 404 cuando el id no existe", async () => {
      const result = await api.jobs.remove(INVALID_ID);

      check.status(result, 404);
    });
  });
});

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

function job(overrides = {}) {
  return {
    titulo: "Backend Developer",
    empresa: "Test Company",
    ubicacion: "Remoto",
    descripcion: "Desarrollo y mantenimiento de servicios con Node.js.",
    data: {
      technology: ["node", "javascript"],
      modalidad: "remoto",
      nivel: "mid-level",
    },
    ...overrides,
  };
}

job.alternative = function () {
  return job({
    titulo: "Frontend Developer",
    empresa: "Updated Company",
    ubicacion: "Híbrido",
    descripcion: "Desarrollo de interfaces web accesibles.",
    data: {
      technology: ["react", "typescript"],
      modalidad: "hibrido",
      nivel: "senior",
    },
  });
};
