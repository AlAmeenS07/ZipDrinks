import logger from "../utils/logger.js";

export const requestResponseLogger = (req, res, next) => {

  // Log incoming request
  logger.info(
      `Request - ${req.method} ${req.originalUrl} | Body: ${JSON.stringify(
        req.body
      )} | Params: ${JSON.stringify(req.params)} | Query: ${JSON.stringify(
        req.query
      )}`
  );

  // Capture response body
  const oldJson = res.json;

  res.json = function (data) {
    logger.info(
        `Response - ${req.method} ${req.originalUrl} | Status: ${
          res.statusCode
        } | Response: ${JSON.stringify(data)}`
    );

    return oldJson.call(this, data);
  };

  next();
};
