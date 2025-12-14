const userModells =require("../../Modells/user/user");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const getSystemIdentifier = require("../../utils/generateSystemIdentifier");
const getEmailTemplate = require("../../utils/emailTemplate");
const session = require("../../Modells/user/session");
const getSessionVerfication = require("../../utils/sessionverification");

const bcrypt = require("bcryptjs")


const userRegister = async function (req, res) {
  try {
    let { name, emp_id, email, phone, department,gender, role, password,description } = req.body;

    if (!name || !emp_id || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check for existing user with same emp_id or email
    const existingUser = await userModells.findOne({
      $or: [{ emp_id }, { email }, { emp_id }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "Employee ID, Email, emp_id already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser = new userModells({
      name,
      emp_id,
      gender,
      email,
      phone,
      department,
      role,
      gender,
      description,
      password: hashedPassword,
    });

    await newuser.save();

    res.status(200).json({ msg: "User registered successfully", userID: newuser._id });
  } catch (error) {
    res.status(500).json({ msg: "Server error: " + error.message });
  }
};



//user-Deleted
const deleteUser = async function (req, res) {
  const userId = req.params._id;

  try {
    const deletedUser = await userModells.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

const login = async function (req, res) {
  try {
    const { name, emp_id, email, password, latitude, longitude, fullAddress } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    const identity = name || emp_id || email;
    if (!identity) {
      return res.status(400).json({ msg: "Enter any of username, emp_id, or email" });
    }

    const user = await userModells.findOne({
      $or: [{ name: identity }, { emp_id: identity }, { email: identity }],
    });

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    
    if (user.department === "imp") {
      const { device_id, ip } = await getSystemIdentifier(req, res);
      const registeredDevice = await session.findOne({
        user_id: user._id,
        "device_info.device_id": device_id,
      });

      if (!registeredDevice) {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = Date.now() + 5 * 60 * 1000; 

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const transport = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT),
          secure: process.env.EMAIL_SECURE === "true",
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transport.sendMail({
          from: `"tracker pvt ltd  Alert" <${process.env.EMAIL_USER}>`,
          to: `${process.env.EMAIL_ADMIN}`,
          subject: `Unauthorized Device Login Attempt for ${user.name}`,
          html: getSessionVerfication(otp, user.emp_id,user.name,device_id, ip, latitude, longitude, fullAddress),
        });

        return res.status(403).json({
          message: "Unrecognized device. OTP has been sent for verification.",
          email: user.email,
        });
      }

      await session.create({
        user_id: user._id,
        device_info: {
          device_id,
          ip,
          latitude,
          longitude,
        },
        login_time: new Date(),
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.PASSKEY);
    return res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error", error: error.message });
  }
};

const getuser = async function (req,res) {
    let data = await userModells.find();
    res.status(200).json(data)
    
}



  module.exports={
    userRegister,
    deleteUser,
    login,
    getuser


  }