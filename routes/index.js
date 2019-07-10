const express = require("express"),
  router = express.Router({ mergeParams: true }),
  multer = require("multer");

router.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la NRS Blockchain API" });
});

module.exports = router;
