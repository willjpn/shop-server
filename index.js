import express from "express"
import cors from "cors"
import userRoutes from "./src/routes/userRoutes.js"
import adminRoutes from "./src/routes/adminRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import {connectToDatabase} from "./src/db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import orderRoutes from "./src/routes/orderRoutes.js";
import paypalRoutes from "./src/routes/paypalRoutes.js"

dotenv.config()

const app = express()

connectToDatabase();

app.set('trust proxy', 1)

app.use(cors({credentials: true, origin: 'https://will-webshop.com'}))

app.use(express.json())
app.use(cookieParser())

app.use("/uploads", express.static('uploads'));

app.use("/user", userRoutes)
app.use("/admin", adminRoutes)
app.use("/product", productRoutes)
app.use("/order", orderRoutes)
app.use("/paypal", paypalRoutes)

app.use((req, res, next) => {
    const error = new Error(`Invalid endpoint: ${req.originalUrl}`)
    res.status(404)
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message)
})

app.listen(process.env.PORT, () => {
    console.log("Listening on port", process.env.PORT)
})
