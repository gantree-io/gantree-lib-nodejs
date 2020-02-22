const winston = require('winston') // used for logging
const { combine, timestamp, label, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, label, timestamp, service }) => {
    return `${timestamp} [${label}] (${service}) ${level}: ${message}`;
});

function returnLogger(service_name) {
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: service_name },
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' })
        ]
    })
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: combine(
                colorize(),
                label({ label: 'Gantree' }),
                timestamp(),
                myFormat
            )
        }));
    }
    return logger
}

module.exports = {
    returnLogger
}
