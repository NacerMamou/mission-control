const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const api = require("./src/routes/api");

app.use(
  cors({
    origin: "*",
  })
);
//app.use(morgan('combined'))

app.use(express.json());

app.use(express.static(path.join(__dirname, "src", "build")));

app.use("/v1", api);
//app.use('/v2', v2Router);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "build", "index.html"));
  // res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;
