import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stockCount: {
        type: Number,
        default: 0
    },
    productCode: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const Product = mongoose.model("Product", ProductSchema)

export default Product
