import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
    const id = process.env.PAYPAL_ID
    res.json(id)
})

export default router
