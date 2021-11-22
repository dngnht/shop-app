const Product = require("../models/Product");

class AdminController {
    async createProduct(req, res) {
        const { name, image, category, description, price } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "商品名が必要です"
            });
        }
        try {
            const newProduct = new Product({
                name,
                image,
                description,
                category,
                price,
                user: req.userId
            });

            await newProduct.save();
            res.json({
                success: true,
                message: "商品登録完了",
                product: newProduct
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しまた" });
        }
    }
    async updateProduct(req, res) {
        const { name, image, category, description, price } = req.body;
        try {
            const updateProduct = {
                name,
                image,
                description,
                category,
                price
            };

            const productId = { _id: req.params.id };
            updateProduct = await Product.findOneAndUpdate(productId, updateProduct, { new: true });
            res.json({
                success: true,
                message: "商品更新完了",
                product: updateProduct
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しまた" });
        }
    }
    async delete(req, res) {
        try {
            const productDeleteCondition = { _id: req.params.id };
            await Product.delete(productDeleteCondition);
            const deleteProduct = await Product.findOneDeleted(productDeleteCondition);
            if (!deleteProduct) {
                return res.status(401).json({ success: false, message: "商品が存在していません。" });
            }
            res.json({ success: true, message: "商品が削除されました!", product: deleteProduct });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しました" });
        }
    }

    async deleteAll(req, res) {
        try {
            const productDeleteCondition = { _id: req.body.productIds };
            console.log(productDeleteCondition);
            await Product.delete({ _id: { $in: productDeleteCondition._id } });
            const deletedProducts = await Product.findDeleted(productDeleteCondition);
            if (!deletedProducts) {
                return res.status(401).json({ success: false, message: "商品が存在していません。" });
            }

            const products = await Product.find({});
            res.json({ success: true, message: "商品が削除されました!", products });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しました" });
        }
    }

    //[PATCH] /api/admin/:id/restore
    async restore(req, res) {
        try {
            const productRestoreCondition = { _id: req.params.id };
            await Product.restore(productRestoreCondition);
            const restoredProduct = await Product.findOne(productRestoreCondition);

            if (!restoredProduct) {
                return res.status(401).json({
                    success: false,
                    message: "商品が存在していません又は権限を与えられないユーザー！"
                });
            }

            res.json({ success: true, message: "商品が復元されました!", product: restoredProduct });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しました" });
        }
    }

    //[PATCH] /api/admin/restore-all
    async restoreAll(req, res) {
        try {
            const productRestoreConditions = { _id: req.body.productIds };
            await Product.restore({ _id: { $in: productRestoreConditions._id } });
            const restoredProducts = await Product.find(productRestoreConditions);
            console.log(productRestoreConditions);

            if (!restoredProducts) {
                return res.status(401).json({ success: false, message: "商品が存在していません" });
            }

            res.json({ success: true, message: "商品が復元されました!", products: restoredProducts });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しました" });
        }
    }

    //[DELETE] /api/admin/:id/force
    async forceDelete(req, res) {
        try {
            const productDeleteCondition = { _id: req.params.id };
            const deletedProduct = await Product.findOneDeleted(productDeleteCondition);
            if (!deletedProduct) {
                return res.status(401).json({ success: false, message: "商品が存在していません!" });
            }

            await Product.deleteOne(productDeleteCondition);
            res.json({ success: true, message: "商品が削除されました!", product: deletedProduct });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しました" });
        }
    }

    //[DELETE] /api/admin/force-delete-all
    async forceDeleteAll(req, res) {
        try {
            const productDeleteConditions = { _id: req.body.productIds };
            const deletedProducts = await Product.findDeleted(productDeleteConditions);
            if (!deletedProducts) {
                return res.status(401).json({ success: false, message: "商品が存在していません!" });
            }

            await Product.deleteMany({ _id: { $in: productDeleteConditions._id } });
            res.json({ success: true, message: "商品が削除されました!", products: deletedProducts });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しました" });
        }
    }
}
module.exports = new AdminController();