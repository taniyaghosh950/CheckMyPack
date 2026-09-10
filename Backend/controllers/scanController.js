const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const Scan = require("../models/Scan");
const { preprocessImage, processedImageDirectory } = require("../services/imagePreprocessingService");

const uploadDirectory = path.join(__dirname, "..", "uploads");
const imageFields = {
	frontImage: "front",
	backImage: "back",
	sideImage: "side",
};
const supportedFormats = new Set(["jpeg", "png", "webp"]);
const formatMimeTypes = {
	jpeg: "image/jpeg",
	png: "image/png",
	webp: "image/webp",
};

function sanitizeOriginalFilename(filename) {
	return path
		.basename(filename)
		.replace(/[^a-zA-Z0-9._-]/g, "_")
		.slice(0, 255);
}

async function removeFiles(files) {
	await Promise.all(files.map((filePath) => fs.unlink(filePath).catch(() => undefined)));
}

async function uploadScanImages(req, res) {
	const requiredFields = Object.keys(imageFields);
	const missingField = requiredFields.find((field) => !req.files?.[field]?.[0]);
	if (missingField) {
		return res.status(400).json({
			success: false,
			message: `Missing required file field: ${missingField}`,
		});
	}

	if (!/^[a-f\d]{24}$/i.test(req.params.scanId)) {
		return res.status(400).json({ success: false, message: "scanId must be a valid MongoDB ObjectId" });
	}

	const storedFiles = [];
	try {
		await fs.mkdir(uploadDirectory, { recursive: true });
		await fs.mkdir(processedImageDirectory, { recursive: true });
		const imageMetadata = [];

		for (const [fieldName, position] of Object.entries(imageFields)) {
			const file = req.files[fieldName][0];
			const imageInfo = await sharp(file.buffer).metadata();
			if (!supportedFormats.has(imageInfo.format) || formatMimeTypes[imageInfo.format] !== file.mimetype) {
				const invalidImageError = new Error(`${fieldName} is not a valid JPG, PNG, or WEBP image`);
				invalidImageError.status = 400;
				throw invalidImageError;
			}

			const imageId = crypto.randomUUID();
			const extension = imageInfo.format === "jpeg" ? "jpg" : imageInfo.format;
			const storedFilename = `${imageId}.${extension}`;
			const storedPath = path.join(uploadDirectory, storedFilename);
			await fs.writeFile(storedPath, file.buffer, { flag: "wx" });
			storedFiles.push(storedPath);
			const processedImage = await preprocessImage(file.buffer, imageId);
			storedFiles.push(path.join(processedImageDirectory, processedImage.processedFilename));

			imageMetadata.push({
				imageId,
				position,
				originalFilename: sanitizeOriginalFilename(file.originalname),
				storedFilename,
				storedPath: `/uploads/${storedFilename}`,
				mimeType: file.mimetype,
				fileSize: file.size,
				uploadedAt: new Date(),
				...processedImage,
				processedAt: new Date(),
			});
		}

		const scan = await Scan.findByIdAndUpdate(
			req.params.scanId,
			{ $set: { images: imageMetadata } },
			{ new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
		);

		return res.status(201).json({ success: true, scan });
	} catch (error) {
		await removeFiles(storedFiles);
		if (error.status === 400) {
			return res.status(400).json({ success: false, message: error.message });
		}
		if (error.status === 422) {
			return res.status(422).json({ success: false, message: error.message });
		}
		if (error.name === "ValidationError" || error.name === "MongoServerError") {
			return res.status(400).json({ success: false, message: error.message });
		}

		if (error.message?.includes("Input buffer contains unsupported image format")) {
			return res.status(400).json({ success: false, message: "Uploaded files must contain valid image data" });
		}
		if (error.message?.includes("Input buffer") || error.message?.includes("unsupported image")) {
			return res.status(422).json({
				success: false,
				message: "Unable to process the uploaded image. Please upload a valid, readable image and try again.",
			});
		}

		console.error(error);
		return res.status(500).json({ success: false, message: "Unable to store scan images" });
	}
}

module.exports = {
	uploadScanImages,
};