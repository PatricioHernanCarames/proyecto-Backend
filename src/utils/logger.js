import winston from 'winston';

const logFormat = winston.format.printf(({level,message,timestamp})=>{
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
});


const logLevels = {
    debug:0,
    http:1,
    info:3,
    warn:3,
    error:4,
    fatal:5,
};


export const logger = winston.createLogger({
    levels: logLevels,
    format:winston.format.combine(
        winston.format.timestamp(),
        logFormat,
    ),

    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename:'error.log', level:'error'}),
        new winston.transports.File({filename:'combined.log'})
    ]
});



    