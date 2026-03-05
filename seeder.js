const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bootcamp = require("./models/bootcamp");
const Course = require("./models/course");
const User = require("./models/user");
const Review = require("./models/review");
dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_URI);

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"),
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"),
);
const review = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8"),
);

const importData = async () => {
  try {
    process.env.SEEDING = "true";

    await Bootcamp.insertMany(bootcamps);
    await Course.insertMany(courses);
    await Promise.all(users.map((user) => User.create(user)));
    await Review.insertMany(review);

    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
