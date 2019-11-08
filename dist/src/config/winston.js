import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;
const myFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
});
const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'info.log', level: 'info' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(timestamp(), myFormat)
    }));
}
export default logger;
//# sourceMappingURL=winston.js.map