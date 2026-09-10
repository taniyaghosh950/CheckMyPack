const express = require("express");
const {
	createProduct,
	getProducts,
	getProductByBarcode,
	getProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/barcode/:barcode", getProductByBarcode);
router.get("/:id", getProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;