const express = require("express");
const router = express.Router();
const dashboardController = require("../middlewares/dashboardController");
const Customer = require("../models/Customer");


//Sales and Profits
router.get("/sales-profit", dashboardController.getSalesAndProfit);

// Top debtors
router.get("/top-debtors", dashboardController.getTopDebtors);

// Top customers
router.get("/top-customers", dashboardController.getTopCustomers);

//Sales and Profits for Charts
router.get("/sales-trends", dashboardController.getSalesTrends);




module.exports = router;
