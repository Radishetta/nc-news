const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { handleInvalidEndpoint } = require("./errors/index");

const app = express();
// GET
app.get("/api/topics", getTopics);

//ERROR HANDLING
app.all("/*", handleInvalidEndpoint);

module.exports = app;
