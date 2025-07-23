import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "niraj.inquiry@gmail.com", // generated ethereal user
    pass: "tplp yuve bytb rxti", // generated ethereal password
  },
});

const emailSender = async (email, templates) => {
  console.log({ email });
  try {
    await transporter.sendMail({
      from: "niraj.inquiry@gmail.com", // sender address
      to: email, // sender address
      subject: "Fab Media Tech Pvt Ltd.", // Subject line
      text: " ", // plain text body
      html: templates,
    });
    return true;
  } catch (error) {
    console.log({ error: error.message });
    return false;
  }
};
export default emailSender;