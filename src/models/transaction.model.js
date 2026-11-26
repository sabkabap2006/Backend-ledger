const mongoose = require("mongoose")
const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: String,
        ref: "account",
        required: [true, "Transaction must be associated with a from account"],
        index: true
    },
    toAccount: {
        type: String,
        ref: "account",
        required: [true, "Transaction must be associated with a to account"],
        index: true
    },
    amount: {
        type: Number,
        required: [true, "Amount must be provided"],
        min: [0, "Amount can't be negative"],
    },
    status: {
        type: String,
        enum: ["Completed", "Pending", "Failed", "Reversed"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    transactionId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required"],
        unique: true,
        index: true
    }
}, {
    timestamps: true

})
const Transaction = mongoose.model("transaction", transactionSchema)
module.exports = Transaction