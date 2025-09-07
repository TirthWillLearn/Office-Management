// src/routes/employees.js
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Create employee
router.post(
  "/",
  [body("first_name").notEmpty().withMessage("First name required")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      if (
        req.body.department &&
        !mongoose.isValidObjectId(req.body.department)
      ) {
        return res.status(422).json({ message: "Invalid department id" });
      }
      if (req.body.department) {
        const exists = await Department.findById(req.body.department);
        if (!exists)
          return res.status(422).json({ message: "Department not found" });
      }

      if (
        req.body.supervisor &&
        !mongoose.isValidObjectId(req.body.supervisor)
      ) {
        return res.status(422).json({ message: "Invalid supervisor id" });
      }

      const e = new Employee(req.body);
      await e.save();
      res.status(201).json(e);
    } catch (err) {
      if (err.code === 11000)
        return res.status(422).json({ message: "Duplicate email" });
      next(err);
    }
  }
);

// List employees with pagination/search/filters
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const q = req.query.q ? req.query.q.trim() : "";
    const department = req.query.department;
    const role = req.query.role;

    const filter = {};
    if (q) {
      filter.$or = [
        { first_name: { $regex: q, $options: "i" } },
        { last_name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }
    if (department && mongoose.isValidObjectId(department))
      filter.department = department;
    if (role) filter.role = role;

    const total = await Employee.countDocuments(filter);
    const data = await Employee.find(filter)
      .populate("department", "name")
      .populate("supervisor", "first_name last_name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ total, page, limit, data });
  } catch (err) {
    next(err);
  }
});

// Get employee by id populated
router.get("/:id", async (req, res, next) => {
  try {
    const e = await Employee.findById(req.params.id)
      .populate("department")
      .populate("supervisor");
    if (!e) return res.status(404).json({ message: "Not found" });
    res.json(e);
  } catch (err) {
    next(err);
  }
});

// Update
router.put("/:id", async (req, res, next) => {
  try {
    if (req.body.department && !mongoose.isValidObjectId(req.body.department)) {
      return res.status(422).json({ message: "Invalid department id" });
    }
    const e = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!e) return res.status(404).json({ message: "Not found" });
    res.json(e);
  } catch (err) {
    if (err.code === 11000)
      return res.status(422).json({ message: "Duplicate email" });
    next(err);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const e = await Employee.findByIdAndDelete(req.params.id);
    if (!e) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
