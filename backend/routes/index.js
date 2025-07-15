const router = require("express").Router();

const apiUsers = require("./user.route");
const apiIGDB = require("./igdb.route");

router.use("/user", apiUsers);
router.use("/igdb", apiIGDB);

module.exports = router;

// localhost:3000
