const express = require('express');

const userRouter = require("./user-routes");
const infoRouter = require("./info-route");
const router = express.Router();


router.use("/user", userRouter);
router.use("/info", infoRouter);

module.exports = router;