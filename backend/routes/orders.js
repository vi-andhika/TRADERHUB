const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../models/Order");

// Routes
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", cancelOrder);

module.exports = router;
