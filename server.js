const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamp");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const morgan = require("morgan"); //  for logging
const connectDB = require("./config/db"); //  for connecting to the database
dotenv.config({ path: "./config/config.env" });
const colors = require("colors");
const cookies = require("cookie-parser");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");

const app = express();
app.use(express.json()); //  for parsing the body of the request
app.set("query parser", "extended"); // for parsing the query string of the request
// Connect to database
connectDB();
app.use(cookies());
//  Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// File uploading
app.use(fileupload());
app.use(express.static(path.join(__dirname, "public")));
// Call to the route files
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
