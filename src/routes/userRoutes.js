import express from "express"
import {
    validateUser,
    registerUser,
    getUsers,
    updateUser,
    deleteUser,
    getUser, fetchUserByAccessToken, changePassword, editShippingDetails, getUserInformation
} from "../controllers/userControllers.js";
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import {validateAccessToken} from "../middleware/authMiddleware.js";

const router = express.Router()

// TODO - add userAdmin and mainAdmin middleware

// create a user
router.post("/", registerUser)

// get all users
router.get("/", getUsers)

// get user information
router.get("/get-user", validateAccessToken, getUserInformation)

// get a user
router.get("/:id", getUser)

// update a user
router.put("/:id", updateUser)

// delete a user
router.delete("/:id", deleteUser)

// login a user
router.post("/login", validateUser)

// change password for specific user
router.post("/change-password", validateAccessToken, changePassword)

// add/change shipping address for specific user
router.post("/add-shipping-address", validateAccessToken, editShippingDetails)

// get user using access token
router.get("/authenticate/:accessToken", fetchUserByAccessToken)

export default router
