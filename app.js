const express = require("express"),
  app = express(),
  PORT = process.env.PORT || 5000,
  bodyParser = require("body-parser"),
  logger = require("./services/winston");

require("./services/mongoose_connect");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use(require("./routes/index"));
app.use(require("./routes/documents"));

app.listen(PORT, () => console.log("Server started working on port " + PORT));
