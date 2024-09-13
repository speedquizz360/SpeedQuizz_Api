const mongoose = require("mongoose");

const SignupImages = mongoose.model(
  "Signup-Images",
  new mongoose.Schema(
    {
      position: { type: Number, required: true },
      type: { type: String, required: true},
      image: { type: String, required: true},
    },
    { timestamps: true }
  )
);

module.exports = SignupImages;
