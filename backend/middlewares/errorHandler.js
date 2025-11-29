import { SERVER_ERROR } from "../utils/constants.js";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  return res.status(SERVER_ERROR).json({
    success: false,
    message: err.message || "Server Error",
  });
};