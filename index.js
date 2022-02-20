import express from "express"
import cors from "cors"
import userRoutes from "./src/routes/userRoutes.js"
import adminRoutes from "./src/routes/adminRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import {connectToDatabase} from "./src/db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import orderRoutes from "./src/routes/orderRoutes.js";
import helmet from "helmet";


dotenv.config()

// TODO - NEED TO ADD ISADMIN MIDDLEWARE - CRUCIAL!!!!!!

// TODO - look at stripe-sample-code project to see proxy setup

// TODO - write backend in both typescript and go
const app = express()

// TODO - research OWASP and check for string on password as they could inject an object which is simply code

// TODO - single page apps ie react aren't good for seo
// TODO - if product removed from product list, needs to be removed from basket and anywhere else

// TODO - set up proxy
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

app.use(express.json())
app.use(cookieParser())
app.use(helmet())

app.use("/uploads", express.static('uploads'));

await connectToDatabase()


app.use("/user", userRoutes)
app.use("/admin", adminRoutes)
app.use("/product", productRoutes)
app.use("/order", orderRoutes)

app.get('/paypal', (req, res) => {
    const id = process.env.PAYPAL_ID
    res.json(id)
})

app.get("/test", (req, res) => {
    res.send("test endpoint")
})

app.use((req, res, next) => {
    const error = new Error(`Invalid endpoint: ${req.originalUrl}`)
    res.status(404)
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message)
})

const port = process.env.PORT

app.listen(port, () => {
    console.log("Listening on port", port)
})
