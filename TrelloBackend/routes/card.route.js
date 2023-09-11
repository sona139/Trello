const express = require("express");
const cardController = require("../controllers/card.controller");
const router = express.Router();

// Get all card
router.get("/", cardController.getAll);

// Get card
router.get("/:id", cardController.get);

// Update card
router.put("/:id", cardController.update);

// Add card
router.post("/", cardController.add);

// Delete card
router.delete("/:id", cardController.delete);

module.exports = router;
