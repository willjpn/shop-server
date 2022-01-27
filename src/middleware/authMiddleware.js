import jwt from "jsonwebtoken"
import User from "../models/User.js"
import {CustomError} from "../../utils/errorHandler.js";

export const validateAccessToken = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization

        if (!bearer) {
            return next(new CustomError("No bearer token provided", 401))
        }

        let accessToken

        if (!bearer.startsWith("Bearer")) {
            return next(new CustomError("Invalid bearer token provided", 401))
        }

        accessToken = bearer.split(" ")[1]

        if (!accessToken) {
            return next(new CustomError("No access token provided", 401))
        }

        let decoded

        try {
            decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        } catch (err) {
            return next(new CustomError("Unable to verify the access token", 401))
        }

        req.user = await User.findOne({_id: decoded.id}).select("-password")
        next()

    } catch (err) {
        next(err)
    }
}

export const isAdmin = async (req, res, next) => {
    const user = req.user
    if (!user.isAdmin) {
        return next(new CustomError("You don't have permission to do this", 403))
    }
    next()
}
