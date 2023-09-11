const express = require("express");
const itemController = require("../controllers/item.controller");
const router = express.Router();

// Get all item
router.get("/card/:cardId", itemController.getAll);

// Get item
router.get("/:id", itemController.get);

// Update item
router.put("/:id", itemController.update);

// Add item
router.post("/card/:cardId", itemController.add);

// Delete item
router.delete("/:id", itemController.delete);

module.exports = router;
