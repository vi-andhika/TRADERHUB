const { getQuery, allQuery, runQuery } = require("../config/database");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, user_id } = req.query;

    let sql = "SELECT * FROM orders WHERE 1=1";
    let params = [];

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    if (user_id) {
      sql += " AND user_id = ?";
      params.push(user_id);
    }

    sql += " ORDER BY created_at DESC";

    const orders = await allQuery(sql, params);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await getQuery("SELECT * FROM orders WHERE id = ?", [id]);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const items = await allQuery(
      "SELECT * FROM order_items WHERE order_id = ?",
      [id],
    );

    res.json({ success: true, data: { ...order, items } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const {
      user_id,
      total_amount,
      status,
      payment_method,
      shipping_address,
      items,
    } = req.body;

    if (!user_id || !total_amount || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Generate order number
    const orderNumber = "ORD" + Date.now();

    // Create order
    const orderSql = `
            INSERT INTO orders (order_number, user_id, total_amount, status, payment_method, shipping_address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    const result = await runQuery(orderSql, [
      orderNumber,
      user_id,
      total_amount,
      status || "pending",
      payment_method,
      shipping_address,
    ]);

    const orderId = result.lastID;

    // Add order items
    const itemSql = `
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
            VALUES (?, ?, ?, ?, ?)
        `;

    for (const item of items) {
      await runQuery(itemSql, [
        orderId,
        item.product_id,
        item.quantity,
        item.unit_price,
        item.subtotal,
      ]);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { id: orderId, orderNumber },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: "Status required" });
    }

    await runQuery(
      "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id],
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await runQuery(
      "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      ["cancelled", id],
    );

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
