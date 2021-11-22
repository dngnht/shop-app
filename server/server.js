const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const route = require("./routes");
const app = express();

const corsOptions = {
  origin: "http://localhost:8080",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connections();
route(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
