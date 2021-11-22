// Using Node.js `require()`
const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, unique: true, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ["laptop", "PC", "soft", "equipment", "other"]
    },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" }
}, {
    timestamps: true
});
ProductSchema.plugin(mongooseDelete, {
    overrideMethods: "all",
    deleteAt: true
});

module.exports = mongoose.model("Product", ProductSchema);