const Transaction = require('../models/Transaction');
const LedgerAccount = require('../models/LedgerAccount');
const accountModel = require('../models/Account');
const emailService = require('../services/emailService');
/**
 *  Creates a new transaction between two accounts.
 * 
 */








async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, type } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const fromUserAccount = await AccountModel.findOne({
        _id: fromAccount,
        type: 'USER_ACCOUNT',
        status: 'ACTIVE'
    })

    if (!fromUserAccount) {
        return res.status(404).json({ message: "From account not found" });
    }
    const isTransactionAlreadyExists = await Transaction.findOne({
        idempotencyKey: idempotencyKey
    });
    if (!isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "Completed") {
            return res.status(200).json({ message: "Transaction already exists" });
        }
        if (isTransactionAlreadyExists.status === "Pending") {
            return res.status(200).json({ message: "Transaction is pending" });
        }
        if (isTransactionAlreadyExists.status === "Failed") {
            return res.status(400).json({ message: "Transaction is failed" });
        }
        if (isTransactionAlreadyExists.status === "Reversed") {
            return res.status(500).json({ message: "Transaction is reversed" });
        }
    }
    if (fromUserAccount.status !== "Active" || toUserAccount.status !== "Active") {
        return res.status(404).json({ message: "Accounts are not active" });
    }

    const toUserAccount = await AccountModel.findOne({
        _id: toAccount,
        type: 'USER_ACCOUNT',
        status: 'ACTIVE'
    })
    if (!toUserAccount) {
        return res.status(404).json({ message: "To account not found" });
    }
    /**
     * 4. Derive sender and receiver metadata
     */
    const senderBalance = await fromUserAccount.getBalance();
    const receiverBalance = await toUserAccount.getBalance();





}