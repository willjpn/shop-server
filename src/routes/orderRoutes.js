import express from "express"
import {isAdmin, validateAccessToken} from "../middleware/authMiddleware.js";
import {
    createOrder,
    deleteOrder,
    editOrder,
    getAdminOrders,
    getOrder, getUserOrders,
    payOrder
} from "../controllers/orderController.js";

const router = express.Router()

router.get('/', validateAccessToken, isAdmin, getAdminOrders)

// TODO - get orders belonging to a particular user

router.post('/', validateAccessToken, createOrder)

router.post('/:id/pay', validateAccessToken, payOrder)

router.get('/user-orders', validateAccessToken, getUserOrders)

router.put('/:id', validateAccessToken, editOrder)

router.get('/:id', validateAccessToken, getOrder)

router.delete('/:id', validateAccessToken, isAdmin, deleteOrder)

export default router
