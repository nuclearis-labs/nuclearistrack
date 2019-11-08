"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf } = winston_1.format;
const myFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
});
const logger = winston_1.createLogger({
    level: 'info',
    format: combine(timestamp(), myFormat),
    transports: [
        new winston_1.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'info.log', level: 'info' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: combine(timestamp(), myFormat)
    }));
}
exports.default = logger;
//# sourceMappingURL=winston.js.map