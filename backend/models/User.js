const { getQuery, allQuery, runQuery } = require("../config/database");
const bcrypt = require("bcryptjs");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await allQuery(
      "SELECT id, name, email, phone, address, city, role, created_at FROM users ORDER BY created_at DESC",
    );
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getQuery(
      "SELECT id, name, email, phone, address, city, province, postal_code, role, created_at FROM users WHERE id = ?",
      [id],
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      province,
      postal_code,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Check if email already exists
    const existing = await getQuery("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
            INSERT INTO users (name, email, password, phone, address, city, province, postal_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const result = await runQuery(sql, [
      name,
      email,
      hashedPassword,
      phone,
      address,
      city,
      province,
      postal_code,
    ]);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id: result.lastID },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, city, province, postal_code } = req.body;

    const sql = `
            UPDATE users 
            SET name = ?, phone = ?, address = ?, city = ?, province = ?, postal_code = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

    await runQuery(sql, [
      name,
      phone,
      address,
      city,
      province,
      postal_code,
      id,
    ]);

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await runQuery("DELETE FROM users WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
