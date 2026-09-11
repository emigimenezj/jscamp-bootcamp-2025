export function logger(req, res, next) {
  const start = performance.now();

  res.on("finish", () => {
    const time = `${Math.round(performance.now() - start)}ms`;

    const log = [
      new Date().toISOString().slice(11, 19).padEnd(10),
      req.method.padEnd(7),
      String(res.statusCode).padEnd(6),
      time.padEnd(8),
      req.originalUrl.padEnd(40),
      (res.locals.error ?? "").toString(),
    ];

    console.log(log.join(" | "));
  });

  next();
}

export function error(err, req, res, next) {
  res.locals.error = err.message;

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status ?? 500).json({
    error: err.message ?? "Internal server error",
  });
}
