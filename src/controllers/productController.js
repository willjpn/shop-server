import {v4} from "uuid";
import sharp from "sharp";
import Product from "../models/Product.js";

export const createProduct = async (req, res, next) => {
    try {

        const fileName = `uploads/${v4()}.png`
        // TODO - add sharp to resize images
        if (req.file) {
            await sharp(req.file.path).png().resize({
                // width: 384,
                // height: 225,
                height: 200,
                fit: 'contain',
                background: {r: 0, g: 0, b: 0, alpha: 0}
            }).toFile(fileName)
        }

        const payload = req.body

        // TODO - this can't be the correct way of doing this
        payload.image = `http://localhost:8000/${fileName}`

        const product = new Product(payload)
        await product.save()
        res.json(product)
    } catch (err) {
        res.status(500)
        return next(err)
    }

}

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.status(404)
        next(err)
    }

}

export const getProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const product = await Product.findOne({_id: id})
        if (product) {
            res.json(product)
        } else {
            res.status(404)
            return next(new Error("Product not found"))
        }
    } catch (err) {
        next(err)
    }
}

export const updateProduct = async (req, res, next) => {
    const payload = req.body
    const id = req.params.id
    try {
        const product = await Product.findOne({_id: id})
        if (!product) {
            return next(new Error("Unable to update product"))
        }
        product.name = payload.name
        product.price = payload.price
        await product.save()
        res.json(product)
    } catch (err) {
        next(err)
    }

}

export const deleteProduct = async (req, res, next) => {
    const id = req.params.id
    try {
        // TODO - remove image from uploads folder
        await Product.findOneAndDelete({_id: id})
        res.json({
            message: "Successfully deleted product."
        })
    } catch (err) {
        next(err)
    }
}
