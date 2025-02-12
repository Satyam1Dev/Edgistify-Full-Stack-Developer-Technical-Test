const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [{ productId: String, quantity: Number }],
    totalPrice: Number,
    shippingAddress: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderStatus: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Unpaid" },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
