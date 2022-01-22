import express from "express"
import {createProduct, getProducts, updateProduct, getProduct, deleteProduct} from "../controllers/productController.js";
import {upload} from "../middleware/productMiddleware.js";

const router = express.Router()

// create a product
router.post("/", upload.single("image"), createProduct)

// get all products
router.get("/", getProducts)

// get a product
router.get("/:id", getProduct)

// update a product
router.put("/:id", updateProduct)

// delete a product
router.delete("/:id", deleteProduct)

export default router
