const { Router } = require("express");

// Require all routes
const headlines = require("./headlines");
const diff = require("./diff");

const router = Router();

// Use every required route

router.use("/headlines", headlines);
router.use("/diff", diff);

module.exports = router;
