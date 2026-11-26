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
    const toUserAccount = await AccountModel.findOne({
        _id: toAccount,
        type: 'USER_ACCOUNT',
        status: 'ACTIVE'
    })
    if (!toUserAccount) {
        return res.status(404).json({ message: "To account not found" });
    }



}