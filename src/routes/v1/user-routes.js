const express = require('express');
const { UserController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

const router = express.Router();

/*== route: POST: /api/v1/user/signup ==*/
router.post("/singup",
    AuthMiddleware.validateAuthRequest,
    UserController.signup);

/*== route: POST: /api/v1/user/signin==*/
router.post("/signin",
    AuthMiddleware.validateAuthRequest,
    UserController.signin);

module.exports = router;