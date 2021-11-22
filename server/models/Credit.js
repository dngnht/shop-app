const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CreditSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    cardNumber: { type: String, required: true },
    cvCode: { type: String, required: true },
    expiry: { type: String, required: true }
});

module.exports = mongoose.model("Credit", CreditSchema);