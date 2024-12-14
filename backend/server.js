const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbconfig.js");
const router = require("./routes/index.js")

connectDb();
const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/api", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})