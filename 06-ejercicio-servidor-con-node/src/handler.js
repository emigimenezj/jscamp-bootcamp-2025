import { createServer } from "node:http";

const routes = [];

export function handler(req, res) {
  const response = {
    raw: res,
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(data) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(data));
    },
  };

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  const isMethodMatch = (r) => r.method === req.method;
  const isPathMatch = (r) => r.path === pathname;
  const byPathAndMethod = (r) => isMethodMatch(r) && isPathMatch(r);
  const route = routes.find(byPathAndMethod);

  if (!route) return handleRouteNotFound(req, response);

  route.callback(req, response);
}

handler.get = (path, callback) => {
  routes.push({ method: "GET", path, callback });
};

handler.post = (path, callback) => {
  routes.push({ method: "POST", path, callback });
};

handler.start = (port) => {
  createServer(handler).listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
};

function handleRouteNotFound(req, res) {
  return res.status(404).json({
    error: "404: Route Not Found",
    message: `Cannot ${req.method} ${req.url}`,
  });
}
