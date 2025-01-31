const express = require('express');
const { UserController } = require("../../controllers");

const router = express.Router();

/*== route: POST: /api/v1/user/signup ==*/
router.post("/singup", UserController.signup);

/*== route: POST: /api/v1/user/signin==*/
router.post("/signin", UserController.signin);

module.exports = router;