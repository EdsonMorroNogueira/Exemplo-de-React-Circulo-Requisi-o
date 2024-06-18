const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL || "http://localhost:3000"}/files/${this.key}`;
  }
});

PostSchema.pre("remove", function () {
  // Since we're using in-memory database, no need to handle file deletion for now
});

module.exports = mongoose.model("Post", PostSchema);