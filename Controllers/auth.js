const bcrypt = require("bcrypt");
const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");

const { sendVerificationEmail } = require("../utils/emailservice");

//register
const registerUser = async (req, res) => {
  const { name, email, password ,role} = req.body;
  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email is valid
    const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailValid.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Save user 
    const newUser = await User.create({
      name,
      role,
      email,
      password: hashedPassword,
    });
    console.log(newUser);
    

    // Create Email verification token
    const verificationToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECERET, {
      expiresIn: "1d",
    });

    // Update user with verification token
    newUser.verificationToken = verificationToken;
    await newUser.save();
    
    // Send verification email
    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const emailSent = await sendVerificationEmail(newUser, baseUrl);
    // not sent
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
    }res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify email
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECERET);
    console.log('decoded',decoded);
    
    
    // Find user by ID from token
    const user = await User.findById(decoded.id);
    // user exites
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // Update user verification status
    user.isVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is  not verified Please verify your email",
      });
    }

    // create tokem
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECERET, {
      expiresIn: "1d",
    });
    console.log('token',token);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get cirrrent user
const getCurrentUser = async (req, res) => {
  const user = req.user;
  try {
    if (user) {
      return res.status(200).json({
        success: true,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }   
    console.log('current user is',user);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }
};
module.exports = {
  registerUser,
  verifyEmail,
  login,
  getCurrentUser
};