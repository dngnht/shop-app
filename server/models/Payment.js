const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    creditNumber: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: String, required: true }
    }],
    price: { type: Number, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("Payment", PaymentSchema);