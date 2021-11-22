const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const trashController = require("../controllers/TrashController");

router.get("/home", productController.show);
router.get("/trash", trashController.show);

module.exports = router;