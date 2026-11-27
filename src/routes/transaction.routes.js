const { Router } = require("express");
const transactionRouter = Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { createTransaction } = require("../controllers/transaction.controller");

transactionRouter.post("/create", authMiddleware, createTransaction);

module.exports = transactionRouter;
