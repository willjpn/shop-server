import mongoose from "mongoose"

const Schema = mongoose.Schema

export const ItemSchema = new Schema({
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        total: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Item = mongoose.model("Item", ItemSchema)
