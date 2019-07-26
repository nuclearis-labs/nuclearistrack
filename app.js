const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  logger = require("./services/winston");

require("./services/mongoose_connect");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use("/", require("./routes/index"));
app.use("/doc", require("./routes/documents"));
app.use("/user", require("./routes/user"));

app.listen(process.env.PORT, () =>
  console.log("Server started working on port " + process.env.PORT)
);
