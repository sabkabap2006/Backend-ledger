const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with a from account"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
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
        default: "Pending",
        required: true
    },
    type: {
        type: String
    },
    transactionId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
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
