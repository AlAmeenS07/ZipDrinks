import winston from "winston";
import fs from "fs";
import path from "path";

// Create logs folder if it doesn't exist
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
  )
);

// logger instance
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Console logs
    // new winston.transports.Console(),

    // Log all info and higher levels
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),

    // Log only errors
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
  ],
});

export default logger;
