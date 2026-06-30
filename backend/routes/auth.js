const express = require("express");
const router = express.Router();
const { getQuery, runQuery } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password required" });
    }

    const user = await getQuery("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const existing = await getQuery("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existing) {
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await runQuery(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, "user"],
    );

    const token = jwt.sign(
      { id: result.lastID, email, role: "user" },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        id: result.lastID,
        name,
        email,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify token
router.post("/verify", (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: "Token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      message: "Token valid",
      data: decoded,
    });
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

module.exports = router;
