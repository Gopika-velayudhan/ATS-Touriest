export const tryCatchMiddleware = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch((err) => {
        switch (err.name) {
          case "ValidationError":
            res.status(400).json({
              statusCode: 400,
              error: err.message,
              details: err.details,
            });
            break;
          case "NotFound":
            res.status(404).json({ statusCode: 404, error: err.message });
            break;
          case "Unauthorized":
            res.status(401).json({ statusCode: 401, error: err.message });
            break;
          default:
            res.status(500).json({ statusCode: 500, error: "Internal server error" });
            break;
        }
      });
    };
  };
  

  