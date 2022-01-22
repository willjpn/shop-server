import jwt from "jsonwebtoken";
import {generateAccessToken} from "../../utils/generateTokens.js";
import Token from "../models/Token.js";
import User from "../models/User.js";
import {CustomError} from "../../utils/errorHandler.js";

export const getNewAccessToken = async (req, res, next) => {
    try {

        if (!req.cookies.refreshToken) {
            return next(new CustomError("No refresh token provided", 400))
        }

        const refreshToken = await Token.findOne({token: req.cookies.refreshToken})

        if (!refreshToken) {
            return next(new CustomError("Invalid refresh token provided", 400))
        }

        let decoded

        try {
            decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET)
        } catch (err) {
            return next(new CustomError("Unable to verify refresh token", 400))
        }

        const accessToken = generateAccessToken(decoded.id)

        const user = await User.findOne({_id: decoded.id}).select("-password")

        if (!user) {
            return next(new CustomError("Unable to user with specified id", 400))
        }

        console.log("successfully fetched new access token")

        res.json({
            accessToken: accessToken,
            userInfo: user
        })

    } catch (err) {
        next(err)
    }
}

export const removeRefreshToken = async (req, res, next) => {
    try {
        res.clearCookie("refreshToken")
        res.json({
            message: "Refresh token removed"
        })
    } catch (err) {
        next(err)
    }

}
