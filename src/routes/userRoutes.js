import express from "express"
import {
    validateUser,
    registerUser,
    getUsers,
    updateUser,
    deleteUser,
    fetchUserByAccessToken,
    changePassword,
    editShippingDetails,
    getUserInformation,
    getEditUser
} from "../controllers/userControllers.js";
import {isAdmin, validateAccessToken} from "../middleware/authMiddleware.js";

const router = express.Router()

// TODO - add userAdmin and mainAdmin middleware

// create a user
router.post("/", validateAccessToken, isAdmin, registerUser)

// get all users
router.get("/", validateAccessToken, isAdmin, getUsers)

// get user information
router.get("/get-user", validateAccessToken, getUserInformation)

// get user information for edit user screen
router.get('/get-edit-user/:id', validateAccessToken, isAdmin, getEditUser)

// // get a user
// router.get("/:id", getUser)

// update a user
router.put("/:id", updateUser)

// delete a user
router.delete("/:id", validateAccessToken, isAdmin, deleteUser)

// login a user
router.post("/login", validateUser)

// change password for specific user
router.post("/change-password", validateAccessToken, changePassword)

// add/change shipping address for specific user
router.post("/add-shipping-address", validateAccessToken, editShippingDetails)

// get user using access token
router.get("/authenticate/:accessToken", fetchUserByAccessToken)

export default router
