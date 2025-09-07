// src/routes/countries.js
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// GET /api/countries
router.get("/", async (req, res, next) => {
  try {
    const r = await fetch("https://restcountries.com/v3.1/all");
    const data = await r.json();
    const simplified = data
      .map((c) => ({
        name: c.name?.common || c.name,
        code: c.cca2 || c.ccn3 || null,
      }))
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json(simplified);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
