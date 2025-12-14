const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    gender:{
      type: String,
      trim: true,
      required: true,
    },


    emp_id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },

    department: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    otp: {
      type: Number,
      trim: true,
      default: null,
    },
    description:{
      type:String,
      default:"registered",
        },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
