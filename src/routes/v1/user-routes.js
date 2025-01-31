const express = require('express');
const { UserController } = require("../../controllers");

const router = express.Router();

/*== route: POST: /api/v1/singup ==*/
router.post("/",
    UserController.singup
)

module.exports = router;