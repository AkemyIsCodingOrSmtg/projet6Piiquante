"use strict"

const { configure, getLogger } = require('log4js');

// appenders
configure({
    appenders: {
        console: { type: 'stdout', layout: { type: 'colored' } },
        dateFile: {
            type: 'dateFile',
            filename: `${process.env.LOG_PATH_FILE}`,
            layout: { type: 'basic' },
            compress: true,
            numBackups: 3,
            maxLogSize: 10485760,
            keepFileExt: true
        }
    },
    categories: {
        default: { appenders: ['console', 'dateFile'], level: `${process.env.LOG_LEVEL}` }
    }
});

module.exports = {
    logger: getLogger("APP")
};