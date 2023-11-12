import express  from "express";
import { logger } from "../utils/logger";

const app= express();


app.get('/loggerTest', (req, res) => {
    try {
        // Example high-value log points
        logger.error('This is an error log.');
        logger.warn('This is a warning log.');
        logger.info('This is an info log.');
        logger.debug('This is a debug log.');

        // Simulate an error
        throw new Error('This is a simulated error.');
    } catch (error) {
        logger.error(error.message);
    }
    res.send('Check the logs for /loggerTest in the console or logs files.');
});

export {app as testLogger}