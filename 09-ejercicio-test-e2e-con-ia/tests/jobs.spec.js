import { expect, test } from "@playwright/test";

const locator = {
  job: {
    results(page) {
      return page.getByRole("article").filter({
        has: page.getByRole("link", { name: "Ver detalle" }),
      });
    },

    filter(page, placeholder) {
      return page.getByRole("combobox").filter({
        has: page.getByRole("option", { name: placeholder, exact: true }),
      });
    },
  },
};

const behavior = {
  job: {
    async search(page, text) {
      await page.getByRole("searchbox").fill(text);
      await page.getByRole("button", { name: "Buscar" }).click();
    },

    async open(job) {
      await expect(job).toBeVisible();

      const title = await job.getByRole("heading").innerText();

      await job.getByRole("link", { name: "Ver detalle" }).click();

      return title;
    },

    async apply(page) {
      await page.getByRole("button", { name: "Iniciar sesión" }).click();
      await page.getByRole("button", { name: "Aplicar ahora" }).first().click();
    },
  },
};

const check = {
  job: {
    async open(page, title) {
      await expect(page).toHaveURL(/\/job\/[^/]+$/);
      await expect(
        page.getByRole("heading", { level: 1, name: title }),
      ).toBeVisible();
    },

    async applied(page) {
      await expect(
        page.getByRole("button", { name: "Aplicado" }).first(),
      ).toBeVisible();
    },
  },

  // Usar un locator negativo con toHaveCount(0) reintenta automáticamente hasta que la UI refleja el filtro, así que no hay necesidad de expect.poll + evaluateAll ni de waitForResponse manual.
  jobs: {
    async allMatch(page, attribute, value) {
      await expect(
        page.locator(`[${attribute}]:not([${attribute}="${value}"])`),
      ).toHaveCount(0);
    },
  },

  /* Implementación anterior, reemplazada por allMatch: duplicaba el mecanismo
     de reintento que Playwright ya provee con sus aserciones auto-esperadas.
  jobs: {
    async attribute(results, attribute, expected) {
      // Comprueba que todos los resultados visibles coincidan con el filtro aplicado.
      await expect
        .poll(async () => {
          const values = await results.evaluateAll(
            (elements, name) =>
              elements.map((element) => element.getAttribute(name)),
            attribute,
          );

          return (
            values.length > 0 && values.every((value) => value === expected)
          );
        })
        .toBe(true);
    },
  },
  */

  search: {
    async results(page, text) {
      await expect(page).toHaveURL(
        new RegExp(`/search\\?text=${encodeURIComponent(text)}$`),
      );

      const results = locator.job.results(page);

      await expect(results).not.toHaveCount(0);
      await expect(results.first()).toBeVisible();
    },
  },

  page: {
    async changed(page, jobs, previous) {
      await expect(page).toHaveURL(/[?&]page=2(?:&|$)/);
      await expect
        .poll(() => jobs.getByRole("heading").allInnerTexts())
        .not.toEqual(previous);
    },
  },
};

test.describe("Búsqueda de empleos", () => {
  test("la aplicación carga correctamente y muestra el buscador", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("searchbox")).toBeVisible();
  });

  test("muestra resultados al buscar empleos por tecnología", async ({
    page,
  }) => {
    await page.goto("/");

    await behavior.job.search(page, "React");
    await check.search.results(page, "React");
  });
});

test.describe("Flujo de aplicación", () => {
  test("permite buscar un empleo, abrirlo y aplicar", async ({ page }) => {
    await page.goto("/");

    await behavior.job.search(page, "JavaScript");
    await check.search.results(page, "JavaScript");

    const first = locator.job.results(page).first();
    const title = await behavior.job.open(first);

    await check.job.open(page, title);

    await behavior.job.apply(page);
    await check.job.applied(page);
  });
});

test.describe("Filtros de empleos", () => {
  // Podemos parametrizar los filtros para no duplicar el mismo test cambiando solo los datos
  const filtros = [
    {
      name: "ubicación",
      placeholder: "Ubicación",
      label: "Remoto",
      attribute: "data-modalidad",
      value: "remoto",
    },
    {
      name: "nivel",
      placeholder: "Nivel de experiencia",
      label: "Senior",
      attribute: "data-nivel",
      value: "senior",
    },
  ];

  for (const filtro of filtros) {
    test(`muestra únicamente empleos correctos al filtrar por ${filtro.name}`, async ({
      page,
    }) => {
      await page.goto("/search");

      await locator.job
        .filter(page, filtro.placeholder)
        .selectOption({ label: filtro.label });

      // Con esto confirmamos que la búsqueda filtrada devolvió al menos un resultado
      await expect(locator.job.results(page).first()).toBeVisible();

      await check.jobs.allMatch(page, filtro.attribute, filtro.value);
    });
  }

  /* test("muestra únicamente empleos remotos al filtrar por ubicación", async ({
    page,
  }) => {
    await page.goto("/search");
    await expect(locator.job.results(page).first()).toBeVisible();

    // Se empieza a esperar la petición de empleos remotos.
    const response = page.waitForResponse((response) =>
      response.url().includes("type=remoto"),
    );

    // Se produce la petición de empleos remotos.
    await locator.job
      .filter(page, "Ubicación")
      .selectOption({ label: "Remoto" });

    // Se espera que el servidor responda con los empleos remotos.
    await response;

    // Comprobación de que la UI refleja el filtro aplicado.
    const results = locator.job.results(page);
    await check.jobs.attribute(results, "data-modalidad", "remoto");
  });

  test("muestra únicamente empleos senior al filtrar por nivel", async ({
    page,
  }) => {
    await page.goto("/search");
    await expect(locator.job.results(page).first()).toBeVisible();

    // Se empieza a esperar la petición de empleos senior.
    const response = page.waitForResponse((response) =>
      response.url().includes("level=senior"),
    );

    // Se produce la petición de empleos senior.
    await locator.job
      .filter(page, "Nivel de experiencia")
      .selectOption({ label: "Senior" });

    // Se espera que el servidor responda con los empleos senior.
    await response;

    // Comprobación de que la UI refleja el filtro aplicado.
    const results = locator.job.results(page);
    await check.jobs.attribute(results, "data-nivel", "senior");
  });
  */
});

test.describe("Paginación de empleos", () => {
  test("muestra la paginación y cambia los resultados al avanzar", async ({
    page,
  }) => {
    await page.goto("/");

    await behavior.job.search(page, "Desarroll");
    await check.search.results(page, "Desarroll");

    const results = locator.job.results(page);

    const initial = await results.getByRole("heading").allInnerTexts();

    const pagination = page.getByRole("navigation").filter({
      has: page.getByRole("link", { name: "2", exact: true }),
    });

    const secondPage = pagination.getByRole("link", {
      name: "2",
      exact: true,
    });

    await expect(pagination).toBeVisible();
    await expect(secondPage).toBeVisible();

    await secondPage.click();
    await check.page.changed(page, results, initial);
  });
});

test.describe("Detalle de empleo", () => {
  test("muestra el detalle y permite aplicar al empleo", async ({ page }) => {
    await page.goto("/search");

    const first = locator.job.results(page).first();
    const title = await behavior.job.open(first);

    await check.job.open(page, title);

    const applyBtn = page
      .getByRole("button", { name: "Aplicar ahora" })
      .first();

    await expect(applyBtn).toBeVisible();
    await behavior.job.apply(page);
    await check.job.applied(page);
  });
});
