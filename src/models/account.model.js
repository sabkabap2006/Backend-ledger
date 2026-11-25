const mongoose = require("mongoose")

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

const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel