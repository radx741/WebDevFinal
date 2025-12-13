import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true,
    },
    item: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    payment: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    itemNumber: {
        type: Number,
        default: 1,
    },
});

const OrderModel = mongoose.model("orders", OrderSchema);

export default OrderModel;
