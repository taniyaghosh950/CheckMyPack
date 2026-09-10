const mongoose = require("mongoose");

const scanImageSchema = new mongoose.Schema(
	{
		imageId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		position: {
			type: String,
			required: true,
			enum: ["front", "back", "side"],
		},
		originalFilename: {
			type: String,
			required: true,
		},
		storedFilename: {
			type: String,
			required: true,
		},
		storedPath: {
			type: String,
			required: true,
		},
		processedFilename: {
			type: String,
			required: true,
		},
		processedPath: {
			type: String,
			required: true,
		},
		processedMimeType: {
			type: String,
			required: true,
			enum: ["image/webp"],
		},
		processedFileSize: {
			type: Number,
			required: true,
			min: 1,
		},
		processedWidth: {
			type: Number,
			required: true,
		},
		processedHeight: {
			type: Number,
			required: true,
		},
		processedAt: {
			type: Date,
			required: true,
		},
		mimeType: {
			type: String,
			required: true,
			enum: ["image/jpeg", "image/png", "image/webp"],
		},
		fileSize: {
			type: Number,
			required: true,
			min: 1,
		},
		uploadedAt: {
			type: Date,
			required: true,
		},
	},
	{ _id: false }
);

const scanSchema = new mongoose.Schema(
	{
		images: {
			type: [scanImageSchema],
			validate: {
				validator: (images) => images.length === 3,
				message: "A scan must contain front, back, and side images",
			},
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Scan", scanSchema);