const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		brand: {
			type: String,
			trim: true,
			maxlength: 120,
		},
		category: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		barcode: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
			match: [/^[0-9A-Za-z-]{8,32}$/, "Barcode must contain 8 to 32 letters, numbers, or hyphens"],
		},
		manufacturer: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		quantity: {
			value: {
				type: Number,
				required: true,
				min: [0, "Quantity must be zero or greater"],
			},
			unit: {
				type: String,
				required: true,
				enum: ["g", "kg", "ml", "l", "mg", "pcs"],
			},
		},
		mrp: {
			type: Number,
			required: true,
			min: [0, "MRP must be zero or greater"],
		},
		manufacturingDate: Date,
		packingDate: Date,
		expiryDate: Date,
		bestBefore: String,
		origin: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);