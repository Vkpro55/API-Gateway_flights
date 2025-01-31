const express = require('express');

const { InfoController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

const router = express.Router();


router.get("/",
    AuthMiddleware.checkAuth,
    InfoController.info);

module.exports = router;