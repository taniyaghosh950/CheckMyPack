const multer = require("multer");
const path = require("path");

const MAX_IMAGE_SIZE = Number(process.env.MAX_IMAGE_SIZE_BYTES) || 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: MAX_IMAGE_SIZE,
		files: 3,
	},
	fileFilter: (req, file, callback) => {
		const extension = path.extname(file.originalname).toLowerCase();
		if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
			return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
		}

		return callback(null, true);
	},
});

function uploadScanImages(req, res, next) {
	upload.fields([
		{ name: "frontImage", maxCount: 1 },
		{ name: "backImage", maxCount: 1 },
		{ name: "sideImage", maxCount: 1 },
	])(req, res, (error) => {
		if (!error) {
			return next();
		}

		if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
			return res.status(413).json({
				success: false,
				message: `Each image must be ${MAX_IMAGE_SIZE / (1024 * 1024)} MB or smaller`,
			});
		}

		return res.status(400).json({
			success: false,
			message: "Only one JPG, JPEG, PNG, or WEBP image is allowed for each frontImage, backImage, or sideImage field",
		});
	});
}

module.exports = {
	MAX_IMAGE_SIZE,
	uploadScanImages,
};