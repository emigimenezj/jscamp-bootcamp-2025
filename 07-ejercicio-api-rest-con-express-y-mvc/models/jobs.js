import jobs from "../jobs.json" with { type: "json" };

export class JobModel {
  static getAll(search) {
    // Podemos simplificar la destructuración de search en una sola linea
    const { text, title, level, technology, limit, offset } = search;

    const matches = {
      text: ({ titulo, descripcion }) =>
        !text || includesText(titulo, text) || includesText(descripcion, text),

      title: ({ titulo }) => !title || includesText(titulo, title),

      level: ({ data: { nivel } }) => !level || equalsText(nivel, level),

      technology: ({ data: { technology: stack } }) =>
        !technology || stack.some((tech) => equalsText(tech, technology)),
    };

    const byCriteria = (job) =>
      Object.values(matches).every((match) => match(job));

    const filtered = jobs.filter(byCriteria);

    const total = filtered.length;
    const data = filtered.slice(offset, offset + limit);

    return {
      data,
      total,
      limit,
      offset,
    };
  }

  static getById(id) {
    return locate(id)?.job;
  }

  static create(input) {
    const { titulo, empresa, ubicacion, descripcion } = input;
    const { data, content } = input;

    const job = {
      id: crypto.randomUUID(),
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    };

    jobs.push(job);

    return job;
  }

  static update(target, input) {
    const { titulo, empresa, ubicacion, descripcion } = input;
    const { data, content } = input;

    const found = locate(target);
    if (!found) return null;

    const { idx } = found;

    const job = {
      id: target,
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    };

    jobs[idx] = job;

    return job;
  }

  static partialUpdate(id, input) {
    const found = locate(id);
    if (!found) return null;

    const { idx, job: current } = found;

    const job = {
      ...current,
      ...input,
      id,
    };

    jobs[idx] = job;

    return job;
  }

  static delete(id) {
    const found = locate(id);
    if (!found) return null;

    const { idx } = found;

    return jobs.splice(idx, 1).at(0);
  }
}

function locate(id) {
  const idx = jobs.findIndex(({ id: target }) => target === id);
  if (idx === -1) return null;

  return {
    idx,
    job: jobs[idx],
  };
}

// tuviste una muy buena idea. En aplicaciones chicas/medianas implica una complejidad de código alta. Lo mejor es tener funciones que tengan claro su propósito.
// true si value contiene search (ignora mayúsculas/minúsculas)
function includesText(value, search) {
  return value.toLowerCase().includes(search.toLowerCase());
}

// true si value es igual a search (ignora mayúsculas/minúsculas)
function equalsText(value, search) {
  return value.toLowerCase() === search.toLowerCase();
}
