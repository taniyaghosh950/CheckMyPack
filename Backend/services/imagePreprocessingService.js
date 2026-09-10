const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const processedImageDirectory = path.join(__dirname, "..", "processed-uploads");
const MIN_IMAGE_WIDTH = Number(process.env.MIN_IMAGE_WIDTH) || 300;
const MIN_IMAGE_HEIGHT = Number(process.env.MIN_IMAGE_HEIGHT) || 300;
const MAX_IMAGE_DIMENSION = Number(process.env.MAX_IMAGE_DIMENSION) || 2000;
const PROCESSED_IMAGE_QUALITY = Number(process.env.PROCESSED_IMAGE_QUALITY) || 85;

function createProcessingError(message) {
	const error = new Error(message);
	error.status = 422;
	return error;
}

async function preprocessImage(buffer, imageId) {
	const sourceImage = sharp(buffer, { failOn: "error" });
	const metadata = await sourceImage.metadata();

	if (!metadata.width || !metadata.height || metadata.width < MIN_IMAGE_WIDTH || metadata.height < MIN_IMAGE_HEIGHT) {
		throw createProcessingError(
			`Image quality is too low. Upload an image at least ${MIN_IMAGE_WIDTH} x ${MIN_IMAGE_HEIGHT} pixels.`,
		);
	}

	await fs.mkdir(processedImageDirectory, { recursive: true });
	const processedFilename = `${imageId}.webp`;
	const processedFilePath = path.join(processedImageDirectory, processedFilename);

	await sourceImage
		.rotate()
		.resize({ width: MAX_IMAGE_DIMENSION, height: MAX_IMAGE_DIMENSION, fit: "inside", withoutEnlargement: true })
		.webp({ quality: PROCESSED_IMAGE_QUALITY })
		.toFile(processedFilePath);

	const processedMetadata = await sharp(processedFilePath).metadata();
	return {
		processedFilename,
		processedPath: `/processed-uploads/${processedFilename}`,
		processedMimeType: "image/webp",
		processedFileSize: (await fs.stat(processedFilePath)).size,
		processedWidth: processedMetadata.width,
		processedHeight: processedMetadata.height,
	};
}

module.exports = {
	MAX_IMAGE_DIMENSION,
	MIN_IMAGE_HEIGHT,
	MIN_IMAGE_WIDTH,
	PROCESSED_IMAGE_QUALITY,
	processedImageDirectory,
	preprocessImage,
};