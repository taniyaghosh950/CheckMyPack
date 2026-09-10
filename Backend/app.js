const path = require("path");
const express = require("express");
const cors = require("cors");
const complianceRoutes = require("./routes/complianceRoutes");
const productRoutes = require("./routes/productRoutes");
const scanRoutes = require("./routes/scanRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/processed-uploads", express.static(path.join(__dirname, "processed-uploads")));
app.use("/api", complianceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/scans", scanRoutes);

app.get("/api/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Compliance Checker Backend is Running",
	});
});

module.exports = app;