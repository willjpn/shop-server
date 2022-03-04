import express from "express"
import {isAdmin, validateAccessToken} from "../middleware/authMiddleware.js";
import {
    createOrder,
    deleteOrder,
    getAdminOrders,
    getOrder, getUserOrders,
    payOrder
} from "../controllers/orderController.js";

const router = express.Router()

router.get('/', validateAccessToken, isAdmin, getAdminOrders)

router.post('/', validateAccessToken, createOrder)

router.post('/:id/pay', validateAccessToken, payOrder)

router.get('/user-orders', validateAccessToken, getUserOrders)

router.get('/:id', validateAccessToken, getOrder)

router.delete('/:id', validateAccessToken, isAdmin, deleteOrder)

export default router
