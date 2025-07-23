// utils/sendOtpEmail.js
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "anjunagar2000@gmail.com",
    pass: "gfqs zukm oclj iaez", // Gmail App Password
  },
});
export const sendOtpEmail = async ({ to, template }) => {
  try {
    const mailOptions = {
      from: '"Fab Media Admin 👻" <anjunagar2000@gmail.com>',
      to:to,
      subject: "Reset Your Fab Media Password 🔐",
      text: ``,
      html: template,
    };
  
    await transporter.sendMail(mailOptions);
    return true
  } catch (error) {
    console.log({error});
    return false
  }
  
};
