import winston from "winston";

export const logger = winston.createLogger({
    level: "debug",
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`))
});
