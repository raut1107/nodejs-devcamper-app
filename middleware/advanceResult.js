const advanceResult = (model, populate) => async (req, res, next) => {
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
  query = model.find(JSON.parse(queryStr));

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
  const total = await model.countDocuments();

  query = query.skip(starIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const result = await query;

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

  res.advancedResult = {
    success: true,
    count: result.length,
    pagination,
    data: result,
  };
  next();
};

module.exports = advanceResult;
