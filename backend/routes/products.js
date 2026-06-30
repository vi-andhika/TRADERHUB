const express = require("express");
const router = express.Router();
const { getQuery, allQuery, runQuery } = require("../config/database");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, min_price, max_price, search } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    let params = [];

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }

    if (min_price) {
      sql += " AND price >= ?";
      params.push(min_price);
    }

    if (max_price) {
      sql += " AND price <= ?";
      params.push(max_price);
    }

    if (search) {
      sql += " AND name LIKE ?";
      params.push(`%${search}%`);
    }

    sql += " ORDER BY created_at DESC";

    const products = await allQuery(sql, params);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getQuery("SELECT * FROM products WHERE id = ?", [id]);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, seller_id, image_url } =
      req.body;

    if (!name || !category || !price || !seller_id) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const sql = `
            INSERT INTO products (name, category, description, price, stock, seller_id, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

    const result = await runQuery(sql, [
      name,
      category,
      description,
      price,
      stock || 0,
      seller_id,
      image_url || "",
    ]);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { id: result.lastID },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, stock } = req.body;

    const sql = `
            UPDATE products 
            SET name = ?, category = ?, description = ?, price = ?, stock = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

    await runQuery(sql, [name, category, description, price, stock, id]);

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await runQuery("DELETE FROM products WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ success: false, error: "Search query required" });
    }

    const sql = `
            SELECT * FROM products 
            WHERE name LIKE ? OR description LIKE ? 
            ORDER BY rating DESC
        `;

    const products = await allQuery(sql, [`%${q}%`, `%${q}%`]);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

router.get("/search", exports.searchProducts);
router.get("/", exports.getAllProducts);
router.get("/:id", exports.getProductById);
router.post("/", exports.createProduct);
router.put("/:id", exports.updateProduct);
router.delete("/:id", exports.deleteProduct);

module.exports = router;
