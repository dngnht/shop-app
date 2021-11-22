// Using Node.js `require()`
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role" },
    cart: { type: Schema.Types.ObjectId, ref: "Cart" },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);