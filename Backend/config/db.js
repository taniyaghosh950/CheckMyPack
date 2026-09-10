// Connects the backend to MongoDB using the environment configuration.
const mongoose = require("mongoose");

async function connectDB() {
	const mongodbUri = process.env.MONGODB_URI;

	if (!mongodbUri) {
		throw new Error("MONGODB_URI is not configured");
	}

	await mongoose.connect(mongodbUri);
	console.log("MongoDB connected successfully");
}

module.exports = connectDB;
