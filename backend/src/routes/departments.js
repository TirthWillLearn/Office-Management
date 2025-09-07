// src/routes/departments.js
const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const { body, validationResult } = require("express-validator");

// Create
router.post(
  "/",
  [body("name").notEmpty().withMessage("Name required")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      const d = new Department(req.body);
      await d.save();
      res.status(201).json(d);
    } catch (err) {
      if (err.code === 11000)
        return res.status(422).json({ message: "Department already exists" });
      next(err);
    }
  }
);

// List
router.get("/", async (req, res, next) => {
  try {
    const data = await Department.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get by id
router.get("/:id", async (req, res, next) => {
  try {
    const d = await Department.findById(req.params.id);
    if (!d) return res.status(404).json({ message: "Not found" });
    res.json(d);
  } catch (err) {
    next(err);
  }
});

// Update
router.put("/:id", async (req, res, next) => {
  try {
    const d = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!d) return res.status(404).json({ message: "Not found" });
    res.json(d);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const d = await Department.findByIdAndDelete(req.params.id);
    if (!d) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
