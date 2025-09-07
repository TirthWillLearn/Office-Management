// src/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/departments", require("./routes/departments"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/countries", require("./routes/countries"));

app.get("/", (req, res) =>
  res.json({ ok: true, message: "OfficeMgmt API (MongoDB)" })
);

app.use(errorHandler);

module.exports = app;
