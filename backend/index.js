const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const UserRoutes = require("./routes/Users");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,authorization,email,page,username',
}));

app.use(express.urlencoded({ extended: true }));

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
});

app.use(express.json());

const limiter = rateLimit({
  windowMs: 10000,
  limit: 40,
  message: "You have been rate-limited :), please try again later",
});

app.get("/", (req, res) => {
  res.send("YOOO BOIII");
});

app.use("/api/auth", UserRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
