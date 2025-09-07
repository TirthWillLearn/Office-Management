// src/seed.js
require("dotenv").config();
const connectDB = require("./config/db");
const Department = require("./models/Department");
const Employee = require("./models/Employee");

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Seeding DB...");

    await Employee.deleteMany({});
    await Department.deleteMany({});

    const d1 = await Department.create({
      name: "Engineering",
      description: "Dev & QA",
    });
    const d2 = await Department.create({
      name: "HR",
      description: "People ops",
    });
    const d3 = await Department.create({
      name: "Sales",
      description: "Sales team",
    });

    const e1 = await Employee.create({
      first_name: "Alice",
      last_name: "Brown",
      email: "alice@example.com",
      department: d1._id,
      role: "Manager",
      country: "United States",
      state: "California",
      city: "San Francisco",
    });
    const e2 = await Employee.create({
      first_name: "Bob",
      last_name: "Smith",
      email: "bob@example.com",
      department: d1._id,
      supervisor: e1._id,
      role: "Developer",
      country: "United States",
      state: "California",
      city: "San Jose",
    });
    const e3 = await Employee.create({
      first_name: "Carol",
      last_name: "Lee",
      email: "carol@example.com",
      department: d2._id,
      role: "Recruiter",
      country: "United Kingdom",
      state: "",
      city: "London",
    });

    console.log("Seed done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
