const { Router } = require("express");

// Require all routes
const headlines = require("./headlines");

const router = Router();

// Use every required route

router.use("/headlines", headlines);

module.exports = router;
