const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const connectDB = require("./config/db");

// Route files
const bootcamps = require("./routes/bootcamp");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/user");
const reviews = require("./routes/review");

const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

// 🔐 1️⃣ Security Headers FIRST
app.use(helmet());
// Prevent XSS attacks
app.use(xss());
// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// 📦 2️⃣ Body parser
app.use(express.json());

// 🍪 3️⃣ Cookie parser
app.use(cookieParser());

// 🧼 4️⃣ Sanitize data (AFTER body parser)
app.use(
  mongoSanitize({
    replaceWith: "_",
  }),
);

// 📁 5️⃣ File upload (after sanitize)
app.use(fileUpload());

// 📊 6️⃣ Dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 📂 7️⃣ Static folder
app.use(express.static(path.join(__dirname, "public")));

// 🚀 8️⃣ Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

// ❗ 9️⃣ Error handler (ALWAYS LAST)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  );
});

// 🔥 Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
