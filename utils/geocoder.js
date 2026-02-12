const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
  httpAdapter: "https",
  formatter: null,
  headers: {
    "User-Agent": "devcamper-app (your-email@example.com)",
  },
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
