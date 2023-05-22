"use strict";

const dotenv = require('dotenv');
dotenv.config();

const Server = require('./src/Server');
const server = new Server();
server.start();