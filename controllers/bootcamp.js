const bootcamps = require("../models/bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  // Defining fields to remove from the query string
  const removeFields = ["select", "sort", "limit", "page"];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  // code for ADVANCE FILTERING STARTS
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );
  query = bootcamps.find(JSON.parse(queryStr)).populate("courses");

  // code for ADVANCE FILTERING ENDS

  // code for ADVANCE SELECT starts
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
    console.log(fields);
  }
  // code for ADVANCE SELECT ends

  // code for ADVANCE SORTING starts
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
    console.log(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // code for ADVANCE SORTING ends

  // Pagination
  console.log(req.query);
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const starIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await bootcamps.countDocuments();

  query = query.skip(starIndex).limit(limit);

  const bootcampData = await query;

  // Pagination result starts
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (starIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  // Pagination result ends

  console.log(bootcampData);
  res.status(200).json({
    success: true,
    count: bootcampData.length,
    data: bootcampData,
    pagination,
  });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await bootcamps.create(req.body);
  res.status(201).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await bootcamps.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await bootcamps.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    returnDocument: "after",
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await bootcamps.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }
  // this will trigger the pre remove middleware in the bootcamp model which will delete all the courses that belong to this bootcamp <-- this will delete the courses as well for the bootcamps which are getting deleted -->
  bootcamps.remove();

  res.status(200).json({ success: true, data: {} });
});
