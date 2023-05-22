"use strict";

const express = require('express');
const cors = require('cors');
const path = require('path');

const Mongo = require('./classes/Mongo');
const { logger } = require('./helpers/log4js');
const loggerMiddleware = require('./middlewares/logger.middleware');
const AuthRoutes = require('./routes/AuthRoutes');
const SauceRoutes = require('./routes/SauceRoutes');

class Server {

    _app; // Express private member of class declaration
    _mongo; // Mongo private member of class declaration

    constructor() {
        this._app = express();
        this._mongo = new Mongo();
    }

    async addMiddlewares() {
        try {
            logger.warn("Begin to add middlewares to the router");
            this._app.use(express.json());
            this._app.use(express.urlencoded({ extended: true }));
            
            this._app.use(cors({origin: 'http://localhost:4200', credentials: true}));
            this._app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

            this._app.use(loggerMiddleware);
            logger.info("Middleware successfully added");
        } catch (ex) {
            logger.error("An error occurred trying to add the middlewares. Reason : " + ex);
            throw new Error(ex);
        }
    }

    async connectToMongo() {
        try {
            logger.warn("Attempt to connect to the mongo DB");
            await this._mongo.connect();
        } catch (ex) {
            logger.error("An error occurred trying to connect to the database. Reason : " + ex);
            throw new Error(ex);
        }
    }

    async addRoutes() {
        try {
            logger.warn("Begin routes setup");
            this._app.use('/api/auth', new AuthRoutes().router);
            this._app.use('/api/sauces', new SauceRoutes().router);
        } catch (ex) {
            throw new Error(ex);
        }
    }

    start() {
        try {
            Promise.all([this.addMiddlewares(), this.connectToMongo(), this.addRoutes()])
                .then(() => {
                    // Multer uploads dir creation
                    this._app.listen(process.env.PORT || 3000, () => {
                        logger.info(`API listening port ${process.env.PORT}`);
                    });
                })
                .catch((error) => {
                    logger.fatal('An error occured trying to start the server. Reason : ' + error);
                });
        } catch (e) {
            logger.fatal(e);
            throw e;
        }
    }
}

module.exports = Server;
