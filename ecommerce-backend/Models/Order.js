const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [{ productId: String, quantity: Number, price: Number }],
    totalPrice: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
