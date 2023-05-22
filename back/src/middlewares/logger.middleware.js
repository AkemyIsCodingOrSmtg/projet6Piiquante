const { logger } = require('../helpers/log4js');


function loggerMiddleware(req, res, next) {
    logger.info(`REQUEST METHOD : ${req.method} | ${req.path}`);
    next();
}

module.exports = loggerMiddleware;