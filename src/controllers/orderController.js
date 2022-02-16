import Order from "../models/Order.js";
import {CustomError} from "../../utils/errorHandler.js";

export const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user', '-password').populate('items.product')
        res.json(orders)
    } catch (err) {
        next(err)
    }
}


export const createOrder = async (req, res, next) => {
    // TODO: add shipping cost on frontend
    const user = req.user
    const payload = req.body
    console.log("payload.shippingAddress", payload.shippingAddress)
    try {
        payload.user = user._id

        const count = await Order.countDocuments({isPaid: false, user: req.user._id})

        console.log("count", count)

        if (count >= 5) {
            return next(new CustomError("You can not have more than five outstanding orders at any one time.", 500))
        }

        const order = new Order(payload)

        await order.save()

        res.json(order)
    } catch (err) {
        next(err)
    }
}

export const editOrder = async (req, res, next) => {
    const user = req.user
    const id = req.params.id
    try {

    } catch (err) {
        next(err)
    }
}

export const getUserOrders = async (req, res, next) => {
    console.log("endpoint reached")
    try {
        const user = req.user
        console.log("user", user)
        const orders = await Order.find({user: user._id})

        console.log("orders, orders", orders)

        if (!orders) {
            return next(new CustomError("Unable to find orders with the id provided.", 404))
        }

        res.json(orders)
    } catch (err) {
        next(err)
    }
}

export const getOrder = async (req, res, next) => {
    // TODO - need to make access denied to 401 across board, need to adjust on front end by adding token on frontend to differentiate between token and other authorization errors
    try {
        const id = req.params.id

        // find order where its id is equal to id provided && where order's user id === req.user._id
        // populate user field excluding password
        // populate items.product objects
        const order = await Order.findOne({_id: id, user: req.user._id}).populate('user', '-password').populate('items.product')

        if (!order) {
            return next(new CustomError("Unable to find order with the id provided.", 404))
        }

        res.json(order)

    } catch (err) {
        next(err)
    }
}

export const deleteOrder = async (req, res) => {
    const id = req.params.id
    try {
        await Order.findOneAndDelete({_id: id})
        res.json({
            message: "Successfully deleted order"
        })
    } catch (err) {
        res.json({
            message: err
        })
    }
}

export const payOrder = async (req, res, next) => {
    try {
        const userId = req.user._id
        const orderId = req.params.id

        const order = await Order.findOne({_id: orderId, user: userId})

        if (!order) {
            return next(new CustomError("Unable to find order with the id provided.", 404))
        }

        order.isPaid = true

        await order.save()

        res.json({
            success: true
        })

    } catch (err) {
        next(err)
    }

}
