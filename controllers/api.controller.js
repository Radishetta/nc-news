const { fetchEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res, next) => {
  const retrievedEndpoints = fetchEndpoints();

  res.status(200).send(retrievedEndpoints);
};
