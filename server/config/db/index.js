const mongoose = require("mongoose");
const Role = require("../../models/Role");

const connections = async() => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@se2a.ids0t.mongodb.net/SE2A?retryWrites=true&w=majority`, {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        );
        console.log("connect Sucessfully");

        //権限をユーザーに与える
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await new Role({ name: "user" }).save();
            console.log("「user」を役割コレクションに追加された");
            await new Role({ name: "admin" }).save();
            console.log("「admin」を役割コレクションに追加された");
        }
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
module.exports = { connections };