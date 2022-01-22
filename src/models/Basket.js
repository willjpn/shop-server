import {ItemSchema} from "./Item.js"
import mongoose from "mongoose"

const Schema = mongoose.Schema

const BasketSchema = new mongoose.Schema({
        userId: {
            type: Schema.ObjectId,
            ref: "User"
        },
        items: [ItemSchema],

        subTotal: {
            type: Number,
            default: 0,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Basket = mongoose.model("Basket", BasketSchema)

