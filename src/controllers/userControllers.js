import User from "../models/User.js";
import bcrypt from "bcrypt";
import {generateRefreshToken, generateAccessToken} from "../../utils/generateTokens.js";
import Token from "../models/Token.js";
import jwt from "jsonwebtoken";
import {CustomError} from "../../utils/errorHandler.js";

export const registerUser = async (req, res, next) => {
    try {
        const payload = req.body

        const user = await User.findOne({email: payload.email})

        if (user) {
            return next(new CustomError("A user with this email already exists. Please use a different email.", 400))
        }

        // password hashing gets done pre-save

        const newUser = new User(payload)

        await newUser.save()

        res.json({
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        })

    } catch (err) {
        next(err)
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (err) {
        res.json({
            message: err
        })
    }
}

export const updateUser = async (req, res, next) => {
    const id = req.params.id
    const payload = req.body

    try {

        const user = await User.findOne({_id: id})

        if (!user) {
            return next(new CustomError("User with specified id not found", 404))
        }

        user.firstName = payload.firstName
        user.lastName = payload.lastName
        user.isAdmin = payload.isAdmin

        await user.save()

        res.json({
            success: true
        })

    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        await User.findOneAndDelete({_id: id})
        res.json({
            message: "Successfully deleted user"
        })
    } catch (err) {
        res.json({
            message: err
        })
    }
}


export const validateUser = async (req, res, next) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email: email})
        if (!user) {
            return next(new CustomError("Incorrect email or password", 409))
        } else {
            const match = await bcrypt.compare(password, user.password)
            if (match) {
                const refreshToken = generateRefreshToken(user._id)
                if (refreshToken) {
                    const token = new Token({
                        userId: user._id,
                        token: refreshToken
                    })
                    await token.save()
                }
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                });

                res.cookie("li", true, {
                    httpOnly: false
                })

                const userInfo = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                }

                const accessToken = generateAccessToken(user._id)

                res.json({
                    userInfo,
                    accessToken
                })

            } else {
                return next(new CustomError("Incorrect email or password", 409))
            }
        }
    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
        let accessToken
        if (bearerToken && bearerToken.startsWith("Bearer")) {
            // bearer token exists and correct format
            accessToken = bearerToken.split(" ")[1]
            if (!accessToken) {
                res.statusCode = 500
                return next(new Error("Access token not found"))
            }
        } else {
            res.status(506)
            return next(new Error("Token doesn't exist or incorrect format"))
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findOne({_id: decoded.id})
        res.json(user)
    } catch (err) {
        next(err)
    }
}

export const getUserInformation = async (req, res) => {
    res.json(req.user)
}

export const getEditUser = async (req, res, next) => {
    const id = req.params.id
    try {
        const user = await User.findOne({_id: id}).select("-password")
        if (!user) {
            return next(new CustomError("Incorrect email or password", 409))
        }
        res.json(user)
    } catch (err) {
        next(err)
    }
}

export const fetchUserByAccessToken = async (req, res, next) => {
    try {
        const accessToken = req.params.accessToken
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findOne({_id: decoded.id}).select("-password")
        res.json(user)
    } catch (err) {
        next(err)
    }
}

export const changePassword = async (req, res, next) => {

    try {
        const {originalPassword, newPassword, repeatPassword} = req.body

        // even though we have req.user, need to find user again as req.user doesn't have password
        const user = await User.findOne({_id: req.user._id})


        // check if current password is correct
        const match = await user.validatePassword(originalPassword)

        if (!match) {
            return next(new CustomError("The current password entered in incorrect", 400))
        }

        // check if newPassword and resetPassword are the same
        if (newPassword !== repeatPassword) {
            return next(new CustomError("The passwords entered are not the same", 400))
        }

        if (newPassword === originalPassword) {
            return next(new CustomError("Please make sure you choose a password you've not used before", 400))
        }

        user.password = newPassword

        // password gets hashed pre-save
        await user.save()

        res.json({
            message: "Successfully saved new password"
        })

    } catch (err) {
        next(err)
    }
}

export const editShippingDetails = async (req, res, next) => {
    try {
        const user = req.user
        await user.addShippingDetails(req.body)
        res.json({
            message: "success"
        })
    } catch (err) {
        next(err)
    }
}
