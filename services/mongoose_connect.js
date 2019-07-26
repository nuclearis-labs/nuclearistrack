const mongoose = require("mongoose");

// Connect to mongoose database

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nrs", {
    useNewUrlParser: true
  })
  .catch(e => console.error("Not able to connect to MongoDB"));
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
