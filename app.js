const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
const { handleInvalidEndpoint } = require("./errors/index");

const app = express();
app.use(express.json());

// GET
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);

//ERROR HANDLING
app.all("/*", handleInvalidEndpoint);

module.exports = app;
