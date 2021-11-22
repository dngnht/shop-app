const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJwt");
const adminController = require("../controllers/AdminController");
router.post("/createProduct", authJwt.verifyToken, authJwt.isAdmin, adminController.createProduct);
router.patch("/restore-all", authJwt.verifyToken, authJwt.isAdmin, adminController.restoreAll);
router.put("/:id", authJwt.verifyToken, authJwt.isAdmin, adminController.updateProduct);
router.patch("/:id", authJwt.verifyToken, authJwt.isAdmin, adminController.restore);
router.delete("/delete-all", authJwt.verifyToken, authJwt.isAdmin, adminController.deleteAll);
router.delete(
    "/force-delete-all",
    authJwt.verifyToken,
    authJwt.isAdmin,
    adminController.forceDeleteAll
);
router.delete("/:id", authJwt.verifyToken, authJwt.isAdmin, adminController.delete);
router.delete("/:id/force", authJwt.verifyToken, authJwt.isAdmin, adminController.forceDelete);

module.exports = router;