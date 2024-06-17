const express = require("express");
const apiRouter = require("./routes/api-router");
const cors = require("cors");
const {
  handleInvalidEndpoint,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./errors/index");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

//ERROR HANDLING
app.all("/*", handleInvalidEndpoint);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
