const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/errorHandler.js");

const app = express();
dotenv.config();
connectDB();

app.use(bodyParser.json()); // application/json

app.get("/", (req, res) => {
  res.send("App is working");
});

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));
