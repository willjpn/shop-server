import jwt from "jsonwebtoken"
import User from "../models/User.js"
import {CustomError} from "../../utils/errorHandler.js";
import e from "express";


export const protect = async (req, res, next) => {
    try {
        let bearerToken = req.headers.authorization

        if (bearerToken && bearerToken.startsWith("Bearer")) {

            const accessToken = bearerToken.split(" ")[1]
            if (!accessToken) {
                res.status(401)
                return next(new Error("No valid token prov"))
            }
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, id) => {
                if (err) {
                    res.status(403)
                    return next(new Error("Sorry, but you are not authorized to access this route."))
                } else {
                    req.user = await User.findOne({_id: id}).select("-password")
                    res.status(200)
                }
            })
        }
        next()
    } catch (err) {
        next(err)
    }
}

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
