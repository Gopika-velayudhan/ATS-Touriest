export const tryCatchMiddleware = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      switch (err.name) {
        case "ValidationError":
          return res.status(400).json({
            statusCode: 400,
            error: err.message,
            details: err.details,
          });
        case "NotFound":
          return res.status(404).json({ statusCode: 404, error: err.message });
        case "Unauthorized":
          return res.status(401).json({ statusCode: 401, error: err.message });
        default:
          return res
            .status(500)
            .json({ statusCode: 500, error: "Internal server error" });
      }
    }
  };
};
