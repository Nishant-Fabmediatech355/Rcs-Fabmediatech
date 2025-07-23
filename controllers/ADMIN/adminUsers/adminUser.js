import { createLogger } from "../../../common/logger.js";
import {
  generateToken,
  generateTokenVerify,
} from "../../../middleware/ADMIN/authenticateRoute.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const logger = createLogger("user");
import {
  comparePassword,
  hashPassword,
} from "../../../middleware/ADMIN/bcrypt.js";
import AdminMaster from "../../../models/db1/admin_master.js";
import nodemailer from "nodemailer";
import { sendOtpEmail } from "../../../middleware/ADMIN/sendOtp.js";
import "dotenv/config";
import Role from "../../../models/db1/role.js";
import Permission from "../../../models/db1/permission.js";
import { Op } from "sequelize";
import dotenv from "dotenv";
import { sendOtpEmailCreateCustomer } from "../../common/commonController.js";
import { response } from "express";
import emailSender from "../../../middleware/EmailSender.js";
import OTP from "../../../models/db1/otp.js";
function sha256Encrypt(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

dotenv.config();

export const generateAdminOtp = async (req, res) => {
  const { admin_name, mobile } = req.body;

  try {
    const admin = await AdminMaster.findOne({ where: { admin_name } });
    if (!admin) {
      return res
        .status(400)
        .json({ status: false, message: "admin not found" });
    }
    if (!admin || admin.admin_mobile !== mobile) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or mobile number",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const generatedAt = Date.now();
    const expiresAt = generatedAt + 60000;

    req.session.adminOtpData = {
      name: admin_name,
      mobile,
      otp,
      generatedAt,
      expiresAt,
    };

    // 🪵 Log OTP for testing
    console.log(` Admin OTP for ${admin_name} (${mobile}): ${otp}`);

    // 📤 Send OTP via SMS
    await Promise.allSettled([
      sendOtpSMS(
        mobile,
        `Your account has been created with fabmediatech Pvt. Ltd. URL : https://sms.fabmediatech.com Userid : niraj@123 Password : ${otp} Credits :ZFFSD Team FABMEDIATECH`
      ),
    ]);

    res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      expiresAt,
    });
  } catch (error) {
    console.error("Generate OTP error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const verifyAdminOtp = async (req, res) => {
  const { admin_email, otp } = req.body;

  try {
    // const otpData = req.session.adminOtpData;
    if (!admin_email || !otp) {
      return res.status(400).json({
        status: false,
        message: "OTP OR Email is required",
      });
    }

    const admin = await AdminMaster.findOne({ where: { admin_email } });
    if (!admin) {
      return res
        .status(404)
        .json({ status: false, message: "Admin not found" });
    }

    const isOTP = await OTP.findOne({
      where: {
        userId: admin.dataValues.admin_id,
        otp: otp,
      },
    });

    if (!isOTP) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }

    const payload = {
      userId: admin.admin_id,
      email: admin.admin_email,
      role: admin.role_id,
    };

    const token = generateTokenVerify(payload);
    await admin.update({ access_token: token });

    // delete req.session.adminOtpData;
    await OTP.destroy({
      where: {
        userId: admin.dataValues.admin_id,
        otp: otp,
      },
    });
    res.status(200).json({
      status: true,
      message: "OTP verified. Login successful.",
      token,
    });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const Login = async (req, res) => {
  const { admin_email, admin_pwd } = req.body;
  try {
    if (!admin_email || !admin_pwd) {
      return res
        .status(400)
        .json({ status: false, message: "Email and password required" });
    }
    const admin = await AdminMaster.findOne({ where: { admin_email } });
    // console.log({ admin: admin.dataValues });

    if (!admin) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }
    const isValidPassword = await comparePassword(admin_pwd, admin.admin_pwd);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    if (!admin.admin_mobile) {
      return res
        .status(400)
        .json({ status: false, message: "No mobile number found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const generatedAt = Date.now();
    const expiresAt = generatedAt + 60000;
    await OTP.create({ otp: otp, userId: admin.dataValues.admin_id });
    // req.session.adminOtpData = {
    //   email: admin_email,
    //   mobile: admin.admin_mobile,
    //   otp,
    //   expiresAt,
    // };

    console.log(`OTP for ${admin_email}: ${otp}`);
    const template = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      color: #333;
      padding: 20px;
    }
    .otp-box {
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      max-width: 400px;
      margin: auto;
      text-align: center;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      margin: 20px 0;
      color: #2a9d8f;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="otp-box">
    <h2>Your One-Time Password (OTP)</h2>
    <p>Use the following code to complete your verification process:</p>
    <div class="otp-code">${otp}</div>
    <p>This code will expire in 5 minutes.</p>
    <p>If you did not request this code, you can safely ignore this message.</p>
    <div class="footer">
      &copy; 2025 Fab Media Tech Pvt. Ltd.. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
    const email = await emailSender(admin.dataValues.admin_email, template);
    console.log({ email });

    // await Promise.allSettled([
    //   emailSender(admin.dataValues.admin_email, template),
    // ]);
    // await Promise.allSettled([
    //   sendOtpSMS(
    //     admin.admin_mobile,
    //     `Your account has been created with fabmediatech Pvt. Ltd. URL : https://sms.fabmediatech.com Userid : niraj@123 Password : ${otp} Credits :ZFFSD Team FABMEDIATECH`
    //   ),
    // ]);

    // const payload = {
    //   userId: admin.admin_id,
    //   email: admin.admin_email,
    //   role: admin.role_id,
    // };

    // const token = generateToken(payload);

    res.status(200).json({
      status: true,
      message: "OTP sent to your registered email",
    });
  } catch (err) {
    console.error("Login OTP error:", err);
    res.status(500).json({ status: false, message: "Server error" });
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
//************************Send OTP SMS using provided credentials ******************************* */
const SendMessage = async (data) => {
  console.log({ message: data.msg });

  try {
    const url = `http://${process.env.IP}:${process.env.routePORT}/cgi-bin/sendsms?smsc=${data.SMSCRouteName}&user=${process.env.SMPPlogin}&pass=${process.env.SMPPPWD}&meta-data=%3Fsmpp%3FPEID%3D${data.entityID}%26templateid%3D${data.templateID}%26TMID%3D${data.tmId}&to=${data.phno}&from=${data.senderID}&text=${data.msg}`;

    console.log({ url1: url.trim() });

    const res = await axios.get(url);
    console.log(res, "resresresresresresresresresresres");
    return { status: res.status, message: res.statusText };
  } catch (error) {
    errorLog.info(error);

    console.log({ error: error });
    throw error;
  }
};

export const initialChangePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.authData.userId;

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
    const user = await AdminMaster.findOne({ where: { admin_id: userId } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Admin not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      admin_pwd: hashedPassword,
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

export const Logout = async (req, res) => {
  const userId = req.authData.userId;
  try {
    // Ensure userId is provided
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required to logout" });
    }

    // Find the admin by ID
    const admin = await AdminMaster.findOne({ where: { admin_id: userId } });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // Clear the access token from the database
    await admin.update({ access_token: null });

    logger.info(`Admin with ID ${userId} logged out successfully`);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log({ error });

    logger.error(`Logout failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const GetAdminDetailsById = async (req, res) => {
  const userId = req.authData.userId;
  // console.log({ userId });

  try {
    const Admin = await AdminMaster.findByPk(userId, {
      attributes: [
        "role_id",
        "is_Active",
        "admin_mobile",
        "admin_email",
        "admin_pic",
        "admin_name",
        "admin_pwd",
        "first_name",
        "last_name",
      ],
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["role_name"],
        },
      ],
    });
    // console.log({ Admin });

    if (!Admin) {
      return res.status(409).json({
        status: false,
        message: "Not Found",
      });
    }
    res.status(200).json({
      status: true,
      message: " Admin Details  Fetched",
      Data: Admin,
    });
  } catch (error) {
    console.log({ error });
    logger.info(`Failed due to ${error}`);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const UpdateAdmin = async (req, res) => {
  const { admin_name, admin_email, admin_mobile } = req.body;
  const userId = req.authData.userId;
  const admin_pic = req.file ? req.file.filename : null;
  console.log({ admin_pic: admin_pic });

  try {
    const data = await AdminMaster.findByPk(userId);
    if (!data) {
      return res.status(401).json({
        status: false,
        message: "Admin Not Found",
      });
    }
    let query = {};
    if (admin_name) {
      query.admin_name = admin_name;
    }

    const UpdateAdmin = await data.update({
      admin_name,
      admin_pic: `${process.env.backend_img_url}/uploads/${admin_pic}`,
      admin_email,
      admin_mobile,
    });
    logger.info(`Admin Details Updated in Successfully`);
    res.status(200).json({
      status: true,
      message: "Admin Details Updated Successfully",
      Data: UpdateAdmin,
    });
  } catch (error) {
    console.log({ error: error.message });

    logger.info(`Failed due to ${error}`);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const passwordMatched = async (req, res) => {
  const userId = req.authData.userId;
  const { admin_pwd } = req.body;
  try {
    const admin = await AdminMaster.findOne({ where: { admin_id: userId } });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found." });
    }
    const isPasswordValid = await comparePassword(
      admin_pwd,
      admin.dataValues.admin_pwd
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Password doesn't Matched!" });
    }
    res.status(200).json({
      status: true,
      message: "Password Matched !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  const userId = req.authData.userId;
  const { admin_pwd } = req.body;
  try {
    const admin = await AdminMaster.findOne({ where: { admin_id: userId } });

    if (!admin) {
      return res
        .status(404)
        .json({ status: false, message: "Admin not found" });
    }

    const hashedPassword = await hashPassword(admin_pwd);

    await admin.update({ admin_pwd: hashedPassword });

    res
      .status(200)
      .json({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export const getSubAdminDetails = async (req, res) => {
  const { admin_email } = req.body;

  if (!admin_email) {
    return res.status(400).json({
      status: false,
      message: "admin_email is required",
    });
  }

  try {
    const admin = await AdminMaster.findOne({
      where: { admin_email },
      attributes: [
        "admin_id",
        "first_name",
        "last_name",
        "admin_name",
        "admin_email",
        "admin_mobile",
        "admin_pic",
        "role_id",
        "is_Active",
      ],
    });

    if (!admin) {
      return res.status(404).json({
        status: false,
        message: "Sub Admin not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Sub Admin details fetched successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Get Sub Admin error:", error);
    res.status(500).json({
      status: false,
      message: `Failed to fetch sub admin details: ${error.message}`,
    });
  }
};

export const getAllAdminUser = async (req, res) => {
  try {
    const admin = await AdminMaster.findAll({
      where: {
        admin_email: { [Op.ne]: "superadmin@gmail.com" }, // Skip Super Admin
      },
      attributes: [
        "admin_id",
        "first_name",
        "last_name",
        "admin_name",
        "admin_email",
        "admin_mobile",
        "admin_pic",
        "role_id",
        "is_Active",
      ],
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["role_name"],
        },
      ],
    });
    // const perName = admin.map(item => item)
    // console.log({ s: perName.length });
    // let finalResult = [];
    // for (let item of perName) {
    //   let permissionName = [];
    //   try {
    //     permissionName = JSON.parse(item.dataValues.permission_id);
    //   } catch (err) {
    //     console.error('Invalid JSON in permission_id:', err);
    //   }
    //   let pNames = []
    //   for (let pname of permissionName) {
    //     const perName = await Permission.findOne({
    //       where: {
    //         permission_id: Number(pname)
    //       },
    //       attributes: ['permission_name', 'permission_id' ]
    //     })
    //     pNames.push( {permission_name:perName.dataValues.permission_name,
    //       permission_id: perName.dataValues.permission_id}
    //     )

    //   }
    //   finalResult.push({ ...item.dataValues, permissions: pNames })
    // }
    // console.log({ finalResult :finalResult[1]});

    return res.status(200).json({
      status: true,
      message: "Admin details fetched successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Failed to fetch all admin user details: ${error.message}`,
    });
  }
};
export const verifyAccount = async (req, res) => {
  const { admin_pwd, admin_name } = req.body;
  // const verifyToken = req.get('verifyToken')
  const admin_email = req.authData.email;
  try {
    // console.log({authToken});
    const data = await AdminMaster.findOne({
      where: {
        admin_email: admin_email,
      },
    });

    if (!data) {
      return res.status(409).json({
        status: false,
        message: "User Not Found",
      });
    }
    if (data.is_Active) {
      return res.status(400).json({ message: "User already verified." });
    }
    const hashedPassword = await hashPassword(admin_pwd);
    data.is_Active = true;
    await data.update({
      admin_pwd: hashedPassword,
      admin_name,
      is_Active: true,
    });
    res.status(201).json({
      status: true,
      message: "Account Verified Successfully",
    });
  } catch (error) {
    console.log({ error: error });

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const updateSubAdmin = async (req, res) => {
  const {
    first_name,
    last_name,
    admin_name,
    admin_email,
    admin_mobile,
    role_id,
  } = req.body;

  if (!admin_email) {
    return res.status(400).json({
      status: false,
      message: "admin_email is required",
    });
  }
  const admin_pic = req.file ? req.file.filename : null;

  try {
    const admin = await AdminMaster.findOne({ where: { admin_email } });

    if (!admin) {
      return res.status(404).json({
        status: false,
        message: "Sub Admin not found",
      });
    }

    const updateSubAdmin = await admin.update({
      first_name,
      last_name,
      admin_name,
      admin_email,
      admin_mobile,
      role_id,
      admin_pic,
    });

    res.status(200).json({
      status: true,
      message: "Sub Admin updated successfully",
      data: updateSubAdmin,
    });
  } catch (error) {
    console.error("Update Sub Admin error:", error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const deleteSubAdmin = async (req, res) => {
  const { admin_email } = req.body;

  if (!admin_email) {
    return res.status(400).json({
      status: false,
      message: "admin_email is required",
    });
  }

  try {
    const admin = await AdminMaster.findOne({ where: { admin_email } });

    if (!admin) {
      return res.status(404).json({
        status: false,
        message: "Sub Admin not found",
      });
    }

    await admin.destroy();

    res.status(200).json({
      status: true,
      message: "Sub Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete Sub Admin error:", error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

//-------------- PASSWORD --------------------------------
export const forgetPassword = async (req, res) => {
  try {
    const admin_email = req.body.admin_email;

    if (!admin_email) {
      return res.status(402).json({
        status: 402,
        message: "ADMIN EMAIL NOT FOUND IN REQUEST!",
      });
    }

    const admin = await AdminMaster.findOne({ where: { admin_email } });

    if (!admin) {
      return res.status(402).json({
        status: 402,
        message: "ADMIN EMAIL NOT FOUND!",
      });
    }

    const token = generateToken({ email: admin.dataValues.admin_email });

    let link = `${process.env.frontend}/login?keys_value=${token}&comp=reset`;
    let template = `Reset Your Password ${link}`;
    const messageId = await sendOtpEmail({
      to: admin.dataValues.admin_email,
      template: template,
      // expireTime
    });

    if (!messageId) {
      return res.status(403).json({
        status: false,
        message: "Failed to send OTP email.",
      });
    }
    // console.log("Email sent: %s", messageId);
    return res.status(200).json({
      status: true,
      message: "OTP sent to your registered email address.",
      token,
    });
  } catch (error) {
    console.error("Forget Password Error:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const resetForgetPassword = async (req, res) => {
  const { admin_pwd } = req.body;
  const admin_email = req.authData.email;
  console.log({ admin_email });

  try {
    const admin = await AdminMaster.findOne({
      where: { admin_email: admin_email },
    });

    console.log({ admin });

    if (!admin) {
      return res
        .status(404)
        .json({ status: false, message: "Admin not found" });
    }

    const hashedPassword = await hashPassword(admin_pwd);

    await admin.update({ admin_pwd: hashedPassword });

    res
      .status(200)
      .json({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", { error });
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export const CreatedBySA = async (req, res) => {
  const {
    first_name,
    admin_name,
    admin_email,
    admin_mobile,
    role_id,
    last_name = "", // Optional last name handling
  } = req.body;

  const admin_id = req.authData?.userId;
  const admin_pic = req.file ? req.file.filename : null;

  if (!first_name || !admin_name || !admin_email || !admin_mobile || !role_id) {
    return res
      .status(400)
      .json({ message: "All fields are required", status: false });
  }

  try {
    const existingAdmin = await AdminMaster.findOne({ where: { admin_name } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin name is already in use", status: false });
    }

    const role = await Role.findOne({ where: { role_id } });
    if (!role) {
      return res.status(400).json({ message: "Invalid Role", status: false });
    }

    const generatePassword = () => {
      const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lower = "abcdefghijklmnopqrstuvwxyz";
      const digits = "0123456789";
      const special = "@$%*!";
      const allChars = upper + lower + digits + special;

      let password = [
        upper[Math.floor(Math.random() * upper.length)],
        lower[Math.floor(Math.random() * lower.length)],
        digits[Math.floor(Math.random() * digits.length)],
        special[Math.floor(Math.random() * special.length)],
      ];

      while (password.length < 8) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
      }

      return password.sort(() => Math.random() - 0.5).join("");
    };

    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // ✅ Create new admin
    const newAdmin = await AdminMaster.create({
      first_name,
      last_name,
      admin_name,
      admin_email,
      admin_mobile,
      admin_pic,
      role_id,
      admin_pwd: hashedPassword,
      created_by: admin_id,
      IS_PWDChanged: false,
    });

    // ✅ Send email with credentials
    await sendOtpEmailCreateCustomer(admin_email, plainPassword, admin_email);

    // ✅ Success response
    return res.status(201).json({
      success: true,
      message: "Admin created and email sent",
      data: {
        admin_id: newAdmin.admin_id,
        admin_email,
        first_name,
        last_name,
      },
    });
  } catch (error) {
    console.error("Error in admin creation:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create admin",
      error: error.message,
    });
  }
};
