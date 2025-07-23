import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CustomerDetails from "../../models/db1/customer_details.js";
import CustomerProfile from "../../models/db1/customer_profile.js";
import CustomerParameters from "../../models/db1/customer_parameters.js";
import CustomerCountryMap from "../../models/db1/customer_country_MAP.js"
import reseller_profile from "../../models/db1/reseller_profile.js";
import axios from "axios";
import sequelize from '../../config/db1.js'; 

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
import crypto from "crypto";
import { createLogger } from "../../common/logger.js";
import {
  getFormattedEmailTemplate,
  sendOtpPhoneForgotPassword,
} from "../common/commonController.js";
function sha256Encrypt(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

const errorLog = createLogger("auth");

//************************Customer Login  ******************************* */
export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password) {
    return res.status(400).json({
      status: false,
      message: "Please provide username and password",
    });
  }

  try {
    const user = await CustomerDetails.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        status: false,
        message: "Your account is inactive. Please connect your administrator.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }
    if (!user.IS_PWDChanged) {
      const accessToken = jwt.sign(
        { userId: user.customer_id, username: user.username },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      return res.status(200).json({
        message: "Password change required",
        status: true,
        requirePasswordChange: true,
        accessToken,
      });
    }
    const customerProfile = await CustomerProfile.findOne({
      where: { customer_id: user.customer_id },
    });

    if (!customerProfile) {
      return res.status(400).json({
        status: false,
        message: "User profile not found",
      });
    }

    const customerParams = await CustomerParameters.findOne({
      where: { customer_id: user.customer_id },
    });

    if (!customerParams) {
      return res.status(409).json({
        message: "Not Found",
      });
    }

    if (!customerParams.is_loginOTP_active) {
      const accessToken = jwt.sign(
        { userId: user.customer_id, username: user.username },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      const refreshToken = jwt.sign(
        { userId: user.customer_id, username: user.username },
        JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
      );

      await CustomerDetails.update(
        { refresh_token: refreshToken },
        { where: { username } }
      );

      const isReseller = await reseller_profile.findOne({
        where: { customer_id: user.customer_id },
      });

      return res.status(200).json({
        message: "Login successful, no OTP required.",
        status: true,
        enableOtp: false,
        accessToken,
        refreshToken,
        reseller: isReseller ? true : false,
      });
    }
    //  else {
    //   const mobileNumber = customerProfile.customer_mobile;
    //   const email = customerProfile.customer_email;
    //   const otp = Math.floor(1000 + Math.random() * 9000);

    //   req.session.otpData = {
    //     username: username,
    //     otp: otp,
    //     generatedAt: Date.now(),
    //   };

    //   req.session.save((err) => {
    //     if (err) {
    //       console.error("Session save error:", err);
    //       return res.status(500).json({ message: "Internal Server Error" });
    //     }

    //     console.log(`OTP for ${username}: ${otp}`);

    //     Promise.allSettled([
    //       sendOtpSMS(
    //         mobileNumber,
    //         `Your account has been created with fabmediatech Pvt. Ltd. URL : https://sms.fabmediatech.com Userid : niraj@123 Password : ${otp} Credits :ZFFSD Team FABMEDIATECH`
    //       ),

    //       sendOtpEmailLogin(email, otp, username),
    //     ])
    //       .then((results) => {
    //         const smsResult = results[0];
    //         const emailResult = results[1];

    //         const smsSuccess = smsResult.status === "fulfilled";
    //         const emailSuccess = emailResult.status === "fulfilled";

    //         if (!smsSuccess && !emailSuccess) {
    //           console.error(
    //             "Both SMS and Email failed:",
    //             smsResult.reason,
    //             emailResult.reason
    //           );
    //           return res
    //             .status(500)
    //             .json({ message: "Failed to send OTP via both SMS and Email" });
    //         }
    //         let message = "OTP sent to your ";
    //         if (smsSuccess) message += "mobile";
    //         if (smsSuccess && emailSuccess) message += " and ";
    //         if (emailSuccess) message += "email";
    //         message += ". Please verify";

    //         res.status(200).json({
    //           status: true,
    //           enableOtp: true,
    //           message: message,
    //         });
    //       })
    //       .catch((error) => {
    //         console.error("Error sending OTP:", error);
    //         res.status(500).json({ message: "Error sending OTP" });
    //       });
    //   });
    // }
    else {
      const mobilesForOTP = customerProfile.get("mobilesForOTP") || [];

      if (mobilesForOTP.length === 0) {
        return res.status(400).json({
          status: false,
          message: "No registered mobile numbers found",
        });
      }
      return res.status(200).json({
        status: true,
        enableOtp: true,
        mobiles: mobilesForOTP,
        message: "Select mobile for OTP",
      });
    }
  } catch (error) {
    errorLog.info(error);

    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//*******************Genrate Otp For Phone****************//
export const generateOtp = async (req, res) => {
  const { username, mobile } = req.body;

  try {
    const user = await CustomerDetails.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    const profile = await CustomerProfile.findOne({
      where: { customer_id: user.customer_id },
    });

    const validMobiles = profile.get("mobilesForOTP") || [];

    if (!validMobiles.includes(mobile)) {
      return res.status(400).json({
        status: false,
        message: "Invalid mobile number selected",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const generatedAt = Date.now();
    const expiresAt = generatedAt + 60000; // 1 minute expiration

    req.session.otpData = {
      username,
      mobile,
      otp,
      generatedAt,
      expiresAt,
    };

    await Promise.allSettled([
      sendOtpSMS(
        mobile,
        `Your account has been created with fabmediatech Pvt. Ltd. URL : https://sms.fabmediatech.com Userid : niraj@123 Password : ${otp} Credits :ZFFSD Team FABMEDIATECH`
      ),
      // sendOtpEmailLogin(email, otp, username),
    ]);
    res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      expiresAt,
    });
  } catch (error) {
    errorLog.info(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

//**********************OTP verification **************************//
export const verifyOtp = async (req, res) => {
  const { username, otp, mobile } = req.body;

  if (!username || !otp || !mobile) {
    return res.status(400).json({
      status: false,
      message: "Username, OTP and mobile are required",
    });
  }

  try {
    // Check if OTP data exists in session
    if (
      !req.session.otpData ||
      req.session.otpData.username !== username ||
      req.session.otpData.mobile !== mobile
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP request",
      });
    }

    // Check if OTP is correct
    if (parseInt(otp) !== req.session.otpData.otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiration (1 minute)
    const currentTime = Date.now();
    if (currentTime > req.session.otpData.expiresAt) {
      delete req.session.otpData;
      return res.status(400).json({
        status: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Find user in database
    const user = await CustomerDetails.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid username",
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.customer_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.customer_id, username: user.username },
      JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    // Update refresh token in database
    await CustomerDetails.update(
      { refresh_token: refreshToken },
      { where: { username } }
    );

    // Check if user is a reseller
    const isReseller = await reseller_profile.findOne({
      where: { customer_id: user.customer_id },
    });

    // Clear OTP data from session
    delete req.session.otpData;
    req.session.save((err) => {
      if (err) console.error("Error clearing OTP session:", err);
    });

    // Successful response
    res.status(200).json({
      status: true,
      message: "OTP verified successfully",
      accessToken,
      refreshToken,
      reseller: isReseller ? true : false,
    });
  } catch (error) {
    errorLog.info(error);
    console.error("Error during OTP verification:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

//************************ Fetch Logged-in Customer Details ******************************* */
// export const getCustomerDetails = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) {
//       return res.status(401).json({
//         status: false,
//         message: "Unauthorized",
//       });
//     }

//     const customer = await CustomerProfile.findOne({
//       where: { customer_id: userId },
//       attributes: [
//         "customer_name",
//         "customer_email",
//         "customer_mobile",
//         "customer_add1",
//         "customer_add2",
//         "city",
//         "state",
//         "PIN",
//         "aadhar",
//         "PAN",
//       ],
//       include: [
//         {
//           model: CustomerParameters,
//           as: "parameter",
//           attributes: ["balance", "od_balance", "check_balance"],
//         },
//       ],
//     });

//     if (!customer) {
//       return res.status(404).json({
//         status: false,
//         message: "Customer not found",
//       });
//     }

//     // const customerParams = await CustomerParameters.findOne({
//     //   where: { customer_id: userId },
//     //   attributes: ["balance"],
//     // });

//     res.status(200).json({
//       status: true,
//       message: "Customer details fetched successfully",
//       data: customer,
//     });
//   } catch (error) {
//     errorLog.info(error);
//     console.error("Error fetching customer details:", error);
//     res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//     });
//   }
// };



export const getCustomerDetails = async (req, res) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const [results] = await sequelize.query(
      `
      SELECT 
        cp.customer_name,
        cp.customer_email,
        cp.customer_mobile,
        cp.customer_add1,
        cp.customer_add2,
        cp.city,
        cp.state,
        cp.PIN,
        cp.aadhar,
        cp.PAN,
        cparam.balance,
        cparam.od_balance,
        cparam.check_balance
      FROM 
        customer_profile cp
      LEFT JOIN 
        customer_parameters cparam 
      ON 
        cp.customer_id = cparam.customer_id
      WHERE 
        cp.customer_id = :userId
      `,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Customer details fetched successfully",
      data: results[0],
    });
  } catch (error) {
    errorLog.info(error);
    console.error("Error fetching customer details:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};


//************************Customer SignUp  ******************************* */
export const signup = async (req, res) => {
  const { username, password, customer_name, customer_mobile } = req.body;
  let message;
  let status;
  if (!username || !password || !customer_name || !customer_mobile) {
    return res
      .status(400)
      .json({ status: false, message: "Please provide all required fields" });
  }
  try {
    const existingUser = await CustomerDetails.findOne({ where: { username } });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Username is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const res0 = await CustomerProfile.create({
      customer_name,
      customer_mobile,
    });

    const res1 = await CustomerDetails.create({
      username,
      password: hashedPassword,
      is_active: true,
      customer_id: res0.dataValues.customer_id,
    });

    const res2 = await CustomerParameters.create({
      customer_id: res0.dataValues.customer_id,
      is_loginOTP_active: true,
    });

    const res3 = await CustomerCountryMap.create({
      customer_id: res0.dataValues.customer_id,
      country_id: 1,
      dlt_rates: 10,
      sms_rates: 2,
      route_id: 1,
    });

    res.status(201).json({
      message: "User Created Successfully",
      status: true,
    });
  } catch (error) {
    errorLog.info(error);
    console.error("Error during signup:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//************************Send OTP SMS using provided credentials ******************************* */
const SendMessage = async (data) => {
  console.log({ message: data.msg });

  try {
    const url = `http://${process.env.IP}:${process.env.routePORT}/cgi-bin/sendsms?smsc=${data.SMSCRouteName}&user=${process.env.SMPPlogin}&pass=${process.env.SMPPPWD}&meta-data=%3Fsmpp%3FPEID%3D${data.entityID}%26templateid%3D${data.templateID}%26TMID%3D${data.tmId}&to=${data.phno}&from=${data.senderID}&text=${data.msg}`;

    console.log({ url1: url.trim() });

    const res = await axios.get(url);
    console.log({ res });
    return { status: res.status, message: res.statusText };
  } catch (error) {
    errorLog.info(error);

    console.log({ error: error });
    throw error;
  }
};

//************************Send OTP SMS only ******************************* */
const sendOtpSMS = async (phoneNumber, message) => {
  try {
    let phno = `91${phoneNumber}`;
    const tmId = sha256Encrypt(`1501603740000052911,${process.env.TM_ID}`);
    const data = {
      SMSCRouteName: "XVOTP",
      entityID: "1501603740000052911",
      templateID: "1707173692440035378",
      tmId: tmId,
      phno: phno,
      senderID: "FMTSMS",
      msg: message,
    };

    const smsResponse = await SendMessage(data);
    console.log("SMS response:", smsResponse);
    return "OTP sent via SMS";
  } catch (error) {
    errorLog.info(error);

    console.error("Error sending OTP via SMS:", error.message);
    throw new Error("Failed to send OTP via SMS");
  }
};

//************************Rifresh Token  ******************************* */
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ status: false, message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await CustomerDetails.findOne({
      where: { customer_id: decoded.userId },
    });

    if (!user || user.refresh_token !== refreshToken) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: user.customer_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    errorLog.info(error);

    console.error("Error refreshing token:", error);
    res
      .status(403)
      .json({ status: false, message: "Invalid or expired refresh token" });
  }
};

// ************************ Forgot Password ****************************** //
export const forgotPassword = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      status: false,
      message: "Please provide your username",
    });
  }

  try {
    const user = await CustomerDetails.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Username not found",
      });
    }

    const customerProfile = await CustomerProfile.findOne({
      where: { customer_id: user.customer_id },
    });

    if (!customerProfile || !customerProfile.customer_email) {
      return res.status(404).json({
        status: false,
        message: "Email not found for this user",
      });
    }

    const email = customerProfile.customer_email;

    const resetToken = jwt.sign(
      { userId: user.customer_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    const { subject, text } = await getFormattedEmailTemplate(
      "forgot_password",
      {
        username: user.username,
        resetLink: resetLink,
      }
    );

    const maskedEmail = email.replace(
      /^(.{3})(.*)(@.*)$/,
      (_, first3, middle, domain) => {
        return `${first3}${"x".repeat(middle.length)}${domain}`;
      }
    );

    // Update your sendOtpEmailForgotPassword to accept subject & HTML text instead of OTP
    await sendOtpPhoneForgotPassword(email, text, user.username, subject);

    return res.status(200).json({
      status: true,
      message: `Reset password link sent to your ${maskedEmail}`,
    });
  } catch (error) {
    errorLog.info(error);
    console.error("Forgot password error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// ************************ Reset Password ****************************** //
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.userId;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      status: false,
      message:
        "Password must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character, 8+ length",
    });
  }

  try {
    const data = await CustomerDetails.findOne({
      where: {
        customer_id: userId,
      },
    });

    if (!data) {
      return res.status(400).json({
        status: false,
        message: "Customer Not Found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await data.update({
      password: hashedPassword,
    });

    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    errorLog.info(error);
    console.error("Reset password error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//************************Customer Logout******************************* */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: false,
        message: "Refresh token is required to log out",
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    if (!decoded || !decoded.userId) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid refresh token" });
    }

    const result = await CustomerDetails.update(
      { refresh_token: null },
      { where: { customer_id: decoded.userId } }
    );

    if (result[0] === 0) {
      return res.status(400).json({
        status: false,
        message: "User not found or already logged out",
      });
    }

    res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    errorLog.info(error);

    console.error("Error during logout:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ************************ Update Customer Profile ******************************* */
export const updateCustomerProfile = async (req, res) => {
  try {
    const { userId } = req;
    const {
      customer_name,
      customer_email,
      customer_mobile,
      customer_add1,
      customer_add2,
      city,
      state,
      PIN,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const [updatedRows] = await CustomerProfile.update(
      {
        customer_name,
        customer_email,
        customer_mobile,
        customer_add1,
        customer_add2,
        city,
        state,
        PIN,
      },
      {
        where: { customer_id: userId },
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "Customer not found or no changes made",
      });
    }

    res.status(200).json({
      status: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    errorLog.info(error);
    console.error("Error updating customer profile:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// ************************First Time Login Password Change********************//
export const initialChangePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.userId;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      status: false,
      message:
        "Password must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character, 8+ length",
    });
  }

  try {
    const user = await CustomerDetails.findOne({
      where: {
        customer_id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      IS_PWDChanged: true,
    });

    res.status(200).json({
      status: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ************************ Change Customer Password ******************************* //
export const changeCustomerPassword = async (req, res) => {
  try {
    const { userId } = req;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "New password and confirm password do not match",
      });
    }

    // Add password strength validation here
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        status: false,
        message:
          "Password must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long",
      });
    }

    const customerDetails = await CustomerDetails.findOne({
      where: { customer_id: userId },
    });

    if (!customerDetails) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, customerDetails.password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await CustomerDetails.update(
      { password: hashedPassword },
      { where: { customer_id: userId } }
    );

    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    errorLog.info(error);
    console.error("Error changing password:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
