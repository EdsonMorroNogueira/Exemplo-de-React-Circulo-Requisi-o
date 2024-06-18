const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = express();
const mongoServer = new MongoMemoryServer();
app.use(bodyParser.json({limit: '10mb'}));

/**
 * Database setup
 */
(async () => {
  await mongoServer.start(); // Inicie o MongoMemoryServer
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri);
    }
    console.log(e);
  });

  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "tmp", "uploads"))
);

app.use(require("./routes"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});