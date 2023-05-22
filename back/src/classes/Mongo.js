"use strict"

const mongoose = require('mongoose');
const { logger } = require('../helpers/log4js');

class Mongo {
    mongoose;

    constructor() {
        this.mongoose = mongoose;
        this.mongoose.set('strictQuery', false);
    }

    async connect() {
        await this.mongoose.connect(`mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`)
            .then( () => {
                logger.trace('Connect = true');
                logger.trace('Using mongoose version : ' + this.mongoose.version);
                return true;
            })
            .catch(error => {
                logger.trace('Connect = false');
                logger.fatal(error);
                return false;
            });
        return false;
    }

    async disconnect() {
        await this.mongoose.disconnect();
    }
}

module.exports = Mongo;