const path = require("path");

require("dotenv").config({
	path: path.join(__dirname, ".env"),
});

const app = require("./app");
const connectDB = require("./config/db");

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
