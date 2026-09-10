// Defines API routes for compliance checks.
const express = require("express");
const { checkCompliance } = require("../controllers/complianceController");

const router = express.Router();

router.post("/compliance/check", checkCompliance);

module.exports = router;
