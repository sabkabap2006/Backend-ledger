const Transaction = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');

/**
 * Creates a new transaction between two accounts.
 */
async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, type, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "All fields (fromAccount, toAccount, amount, idempotencyKey) are required" });
    }

    const fromUserAccount = await accountModel.findById(fromAccount).populate("user");
    if (!fromUserAccount) {
        return res.status(404).json({ message: "From account not found" });
    }

    const toUserAccount = await accountModel.findById(toAccount).populate("user");
    if (!toUserAccount) {
        return res.status(404).json({ message: "To account not found" });
    }

    if (fromUserAccount.status !== "active" || toUserAccount.status !== "active") {
        return res.status(400).json({ message: "Both accounts must be active to perform a transaction" });
    }

    const isTransactionAlreadyExists = await Transaction.findOne({
        idempotencyKey: idempotencyKey
    });

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "Completed") {
            return res.status(200).json({ message: "Transaction already exists", transaction: isTransactionAlreadyExists });
        }
        if (isTransactionAlreadyExists.status === "Pending") {
            return res.status(200).json({ message: "Transaction is pending", transaction: isTransactionAlreadyExists });
        }
        if (isTransactionAlreadyExists.status === "Failed") {
            return res.status(400).json({ message: "Transaction has failed", transaction: isTransactionAlreadyExists });
        }
        if (isTransactionAlreadyExists.status === "Reversed") {
            return res.status(500).json({ message: "Transaction was reversed", transaction: isTransactionAlreadyExists });
        }
    }

    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
        return res.status(400).json({ message: `Insufficient balance. Current balance (${balance}) is less than requested amount (${amount})` });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transactionDocs = await Transaction.create([{
            fromAccount: fromAccount,
            toAccount: toAccount,
            amount: amount,
            type: type || "transfer",
            idempotencyKey: idempotencyKey,
            userId: req.user?._id || fromUserAccount.user?._id,
            status: "Pending"
        }], { session });

        const transaction = transactionDocs[0];

        await ledgerModel.create([{
            account: fromAccount,
            type: 'debit',
            transaction: transaction._id,
            amount: amount
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            type: 'credit',
            transaction: transaction._id,
            amount: amount
        }], { session });

        transaction.status = "Completed";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Send email notification asynchronously
        emailService.sendTransactionNotification(
            fromUserAccount.user?.email,
            toUserAccount.user?.email,
            amount,
            type
        ).catch(err => console.error("Email notification error:", err));

        return res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: error.message || "Transaction failed" });
    }
}
async function createInitialfundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "All fields (toAccount, amount, idempotencyKey) are required" });
    }

    const toUserAccount = await accountModel.findById(toAccount).populate("user");
    if (!toUserAccount) {
        return res.status(404).json({ message: "To account not found" });
    }


}


module.exports = {
    createTransaction
};