const { Router } = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = Router();
const { createTransaction } = require("../controllers/transaction.controllers");

router.post("/create", authMiddleware, createTransaction);

module.exports = router;