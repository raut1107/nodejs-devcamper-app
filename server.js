const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamp");
const courses = require("./routes/courses");
const morgan = require("morgan"); //  for logging
const connectDB = require("./config/db"); //  for connecting to the database
dotenv.config({ path: "./config/config.env" });
const colors = require("colors");
const errorHandler = require("./middleware/error");
const app = express();
app.use(express.json()); //  for parsing the body of the request
app.set("query parser", "extended"); // for parsing the query string of the request
// Connect to database
connectDB();

//  Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Call to the route files
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

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
