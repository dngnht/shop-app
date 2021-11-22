// Using Node.js `require()`
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1, min: 1 }
    }
  ],
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Cart", CartSchema);
