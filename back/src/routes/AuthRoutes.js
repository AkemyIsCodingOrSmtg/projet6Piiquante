const { Router } = require('express');

const AuthController = require("../controllers/AuthController");
const authLoginValidator = require('../validators/AuthLogin.validator');


class AuthRoutes {
    router;
    authController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post('/login', this.authController.login);
        this.router.post('/signup', this.authController.signup);
    }
}

module.exports = AuthRoutes;