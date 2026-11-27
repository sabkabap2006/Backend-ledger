const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = Router();
const { createTransaction } = require("../controllers/transaction.controller");
const transactionRouter = require("../controllers/transaction.controller");
router.post("/create", authMiddleware, createTransaction);
/**
 * -POST /api/transactions/create
 */
transactionRouter.get("/", authMiddleware.authMiddleware, transactionController.getTransactionHistory);
module.exports = router;
