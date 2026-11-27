const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Account ID is required"],
        index: true,
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Transaction ID is required"],
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        immutable: true
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: [true, "Type is required"],
        immutable: true
    }
})

function preventLedgerModification() {
    throw new Error("Ledger can not be modified")
}

ledgerSchema.pre("save", function () {
    if (!this.isNew) {
        throw new Error("Ledger can not be modified")
    }
})

ledgerSchema.pre([
    "updateOne",
    "findOneAndUpdate",
    "deleteMany",
    "deleteOne",
    "updateMany",
    "findByIdAndDelete",
    "findByIdAndUpdate",
    "findOneAndDelete",
    "findOneAndReplace"
], preventLedgerModification)

const ledgerModel = mongoose.model("ledger", ledgerSchema)

module.exports = ledgerModel
