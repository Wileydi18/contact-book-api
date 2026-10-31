const requestTimer = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[timer] ${req.method} ${req.originalUrl} → ${ms}ms`);
  });

  next();
};

module.exports = requestTimer;