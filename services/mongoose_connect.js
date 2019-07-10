const mongoose = require("mongoose");

// Connect to mongoose database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nrs", {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
