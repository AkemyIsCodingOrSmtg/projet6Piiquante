const { Router } = require('express');

const upload  = require('../helpers/multer');
const SauceController = require("../controllers/SauceController");
const jwtMiddleware = require('../middlewares/jwt.middleware');


class SauceRoutes {
    router;
    sauceController = new SauceController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('', jwtMiddleware,  this.sauceController.getSauces);
        this.router.get('/:id', jwtMiddleware,  this.sauceController.getSauce);
        this.router.post('', jwtMiddleware, upload.single("image"), this.sauceController.createSauce);
        this.router.put('/:id', jwtMiddleware,  upload.single("image"), this.sauceController.updateSauce);
        this.router.delete('/:id', jwtMiddleware,  this.sauceController.deleteSauce);
        this.router.post('/:id/like', jwtMiddleware,  this.sauceController.ManageLike);

    }
}

module.exports = SauceRoutes;