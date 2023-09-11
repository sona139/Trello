const express = require("express");
const router = express.Router();

router.use("/card", require("./card.route"));
router.use("/item", require("./item.route"));

module.exports = router;
