import winston from "winston";
import fs from "fs";
import path from "path";

const logLevel = process.env.LOG_LEVEL || "info";

// Function to create a logger with error handling
export const createLogger = (fileName) => {
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const logDir = path.join("logs", currentDate);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFilePath = path.join(logDir, `${fileName}.log`);

  return winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(
        ({ timestamp, level, message, stack }) =>
          `${timestamp} [${level.toUpperCase()}]: ${message}${
            stack ? `\nStacktrace: ${stack}` : ""
          }`
      )
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({ filename: logFilePath }),
    ],
  });
};

// Function to log errors
const logError = (fileName, error) => {
  const logger = createLogger(fileName);

  // Check if error is an instance of Error or a plain message
  if (error instanceof Error) {
    logger.error(error.message, { stack: error.stack });
  } else {
    logger.error(error);
  }
};

// // ✅ Usage Example
// const logger = createLogger("server");

// try {
//   throw new Error("Something went wrong!");
// } catch (error) {
//   logError("error-log", error);
// }

// logger.info("Server started successfully");
// logger.warn("This is a warning");
