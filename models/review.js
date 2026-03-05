const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a  title for the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // this is the field that will hold the reference to the bootcamp model
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "bootcamps", // this is the name of the model we want to reference
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users", // this is the name of the model we want to reference
    required: true,
  },
});
// prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// static method to get avg of course tuitions and save it to bootcamp
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        getAverageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await this.model("bootcamps").findByIdAndUpdate(bootcampId, {
      // over here bootcamps is the model name
      averageRating: Math.ceil(obj[0].getAverageRating / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call Average code after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call Average code before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
