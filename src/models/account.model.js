const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User ID is required"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["active", "inactive", "pending"],
            message: "Status must be either active, inactive, or pending",
        },
        default: "pending"
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "INR"
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
    const balance = await ledgerModel.aggregate([
        {
            $match: {
                account: this._id
            }
        },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$type", "debit"] },
                            then: "$amount",
                            else: 0
                        }
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$type", "credit"] },
                            then: "$amount",
                            else: 0
                        }
                    }
                },

                $project: {
                    _id: 0,
                    balance: { $subtract: ["$totalCredit", "$totalDebit"] }
                }
            }
        }
    ]);

    if (!balance || balance.length === 0) {
        return 0;
    }

    return balance[0].totalCredit - balance[0].totalDebit;
};

const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel
