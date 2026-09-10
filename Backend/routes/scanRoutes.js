const express = require("express");
const { uploadScanImages } = require("../controllers/scanController");
const { uploadScanImages: parseScanImages } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/:scanId/images", parseScanImages, uploadScanImages);

module.exports = router;