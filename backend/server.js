const express = require("express");
const dotenv = require("dotenv").config(); // Load environment variables early
const connectDb = require("./config/dbconfig.js");
const cors = require("cors");
const router = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const foodRouter = require("./routes/foodRoute.js");


connectDb();
require("dotenv").config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
