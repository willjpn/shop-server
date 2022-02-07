import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    shippingAddress: {
        address: {type: String, required: true},
        postCode: {type: String, required: true},
        city: {type: String, required: true},
        county: {type: String, required: true},
        country: {type: String, required: true}
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidDate: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredDate: {
        type: Date
    }
})

const Order = mongoose.model("Order", OrderSchema)

export default Order
