const { createLogger, format, transports } = require("winston"),
  { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

module.exports = createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "info.log" })
  ]
});
