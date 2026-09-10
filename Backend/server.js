const path = require("path");

require("dotenv").config({
	path: path.join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const complianceRoutes = require("./routes/complianceRoutes");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./config/db");

// Create and configure the Express application.
const app = express();

// Add middleware for cross-origin requests and JSON request bodies.
app.use(cors());
app.use(express.json());

// Mount compliance-related API routes.
app.use("/api", complianceRoutes);
app.use("/api/products", productRoutes);

// Health check endpoint for confirming that the backend is running.
app.get("/api/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Compliance Checker Backend is Running",
	});
});

// Connect to MongoDB before accepting API requests.
const PORT = process.env.PORT || 5000;

async function startServer() {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Compliance Checker Backend is running at http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error(`MongoDB connection failed (${error.name}): ${error.message}`);
		process.exit(1);
	}
}

startServer();
