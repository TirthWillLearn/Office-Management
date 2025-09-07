// src/models/Department.js
const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
