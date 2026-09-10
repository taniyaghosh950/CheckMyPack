// Handles HTTP requests for compliance checks.
const checkComplianceService = require("../services/complianceService");

function checkCompliance(req, res) {
	const productData = req.body;
	const result = checkComplianceService(productData);

	return res.status(200).json(result);
}

module.exports = {
	checkCompliance,
};
