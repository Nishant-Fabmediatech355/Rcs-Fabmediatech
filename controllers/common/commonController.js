import { createLogger } from "../../common/logger.js";
// import ApitempReport from "../../models/ApitempReport.js";
// import ClickerReport from "../../models/clicker/ClickerReport.js";

// import CustomerCountryMap from "../../models/customer_country_MAP.js";
// import EmailTemplate from "../../models/EmailTemplate.js";
import ResellerProfile from "../../models/db1/reseller_profile.js";
// import TBLSMSReports from "../../models/tblSMSReport.js";
// import TempReport from "../../models/tempReport.js";
import nodemailer from "nodemailer";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
// import ClickerLogs from "../../models/clicker/ClickerLogs.js";
const errorLog = createLogger("common");

export const getDomainDetails = async (req, res) => {
  const { domain } = req.query;
  try {
    const data = await ResellerProfile.findOne({
      where: {
        reseller_domain: domain,
      },
      attributes: [
        "reseller_domain",
        "is_active",
        "reseller_header",
        "reseller_footer",
        "company_name",
        "reseller_logo",
      ],
    });
    console.log({ data });

    if (!data) {
      return res.status(201).json({
        isActive: false,
        status: false,
        message: "Domain Not Found",
      });
    }
    res.status(201).json({
      isActive: true,
      status: true,
      message: "Domain Found",
      data: data,
    });
  } catch (error) {
    errorLog.info(`${error}`);
    console.log({ error });
    res.status(201).json({
      status: false,
      error: error.message,
    });
  }
};

// export const dlrResponse = async (req, res) => {
//   const queryString = req.query;
//   // console.log({ req: req });
//   try {
//     const data = req.data;
//     await TempReport.create({ data: JSON.stringify(queryString) });
//     res.status(201).json({
//       status: true,
//       message: "Message Updated",
//     });
//   } catch (error) {
//     errorLog.info(`${error}`);

//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// export const dlrResponseforApi = async (req, res) => {
//   const queryString = req.query;
//   // console.log({ req: req });
//   try {
//     const data = req.data;
//     await ApitempReport.create({ data: JSON.stringify(queryString) });
//     res.status(201).json({
//       status: true,
//       message: "Message Updated",
//     });
//   } catch (error) {
//     errorLog.info(`${error}`);

//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

export const calculateSmsCount = (
  smsText,
  allowLongSms = false,
  language = "english"
) => {
  let smsCount = 1;
  let messageLength = smsText.length;
  const specialChars = ["^", "|", "{", "}", "[", "]", "\\", "~"];
  let additionalLength = 0;

  smsText.split("").forEach((char) => {
    if (specialChars.includes(char)) {
      additionalLength += 2;
    }
  });
  messageLength += additionalLength;

  const isEnglish = language === "english";
  const singleSmsLimit = isEnglish ? 160 : 70;
  const multiPartLimit = isEnglish ? 153 : 67;

  if (messageLength > singleSmsLimit) {
    smsCount = 2;
    let additionalLimit = singleSmsLimit + multiPartLimit;

    while (messageLength > additionalLimit) {
      additionalLimit += multiPartLimit;
      smsCount++;
    }
  }

  return { smsCount, messageLength };
};

//************************Send OTP Password Email only create customer ******************************* */
export const sendOtpEmailCreateCustomer = async (email, otp, username) => {
  try {
    const { subject, text } = await getFormattedEmailTemplate(
      "create_customer",
      {
        username,
        otp,
      }
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.netcorecloud.net",
      port: 587,
      secure: false,
      auth: {
        user: "fabmediatecheapi",
        pass: "840e4&d701204",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '"Fabmediatech" <no-reply@fabmediatech.com>',
      to: email,
      subject: subject,
      html: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return "OTP sent via Email";
  } catch (error) {
    errorLog.info(error);
    console.error("Email send error:", error.message);
    throw error;
  }
};

//************************Send OTP Password Email only create customer ******************************* */
export const sendOtpPhoneForgotPassword = async (
  email,
  htmlText,
  username,
  subject
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.netcorecloud.net",
      port: 25,
      secure: false,
      auth: {
        user: "fabmediatecheapi",
        pass: "840e4&d701204",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '"Fabmediatech" <no-reply@fabmediatech.com>',
      to: email,
      subject: subject,
      html: htmlText,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return "Reset link sent via Email";
  } catch (error) {
    errorLog.info(error);
    console.error("Email send error:", error.message);
    throw error;
  }
};

//************************Get Formatted Email Template For Db******************************* */

export const getFormattedEmailTemplate = async (
  templateName,
  variables = {}
) => {
  const template = await EmailTemplate.findOne({
    where: { template_name: templateName },
  });
  console.log(template, "--------------------------------->template");
  if (!template) {
    throw new Error("Email template not found");
  }

  let text = template.template_text;
  let subject = template.template_subject;

  const staticVars = {
    logo_url: "support@fabmediatech.com",
    logo_url: "https://fabmediatech.com/images/logo-updated.png",
    footer_text: "Regards,<br/>Team Fabmediatech",
  };

  const allVars = { ...staticVars, ...variables };

  for (const [key, value] of Object.entries(allVars)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    text = text.replace(regex, value);
    subject = subject.replace(regex, value);
  }

  return {
    subject,
    text,
  };
};

// export const updateSMSRoute = async (req, res) => {
//   const { customer_country_id, dlt_rates, sms_rates } = req.body;
//   try {
//     const data = await CustomerCountryMap.update(
//       { dlt_rates, sms_rates },
//       {
//         where: { customer_country_id: customer_country_id },
//       }
//     );
//     res.status(200).json({
//       status: true,
//       data: data,
//       message: "Customer Country Map Updated Successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "Error updating SMS route",
//     });
//   }
// };

// export const updateClickerUserSMSClick = async (req, res) => {
//   const { shortlink } = req.params;
//   const parser = new UAParser();
//   const result = parser.setUA(req.headers["user-agent"]).getResult();
//   // console.log(result);
//   const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
//   // const ip = "182.156.189.142";
//   var geo = geoip.lookup(ip);
//   // console.log({ geo, result, ip });

//   try {
//     const clickerUser = await ClickerReport.findOne({
//       where: {
//         shortCode: shortlink,
//       },
//     });
//     // console.log({ clickerUser: clickerUser.dataValues.campaign_id });

//     if (clickerUser) {
//       let query = {
//         isClicked: true,
//       };
//       if (geo) {
//         query.customerData = JSON.stringify({ geo, device: result, ip });
//       }
//       // console.log({ query });

//       await clickerUser.update(query);

//       const campaign_id = clickerUser.dataValues.campaign_id;
//       const clckerLog = await ClickerLogs.findByPk(campaign_id);
//       // console.log({ clckerLog: clckerLog.dataValues });

//       if (!clckerLog) {
//         return res.send(`<html>
//         <body>
//           <script>
// alert("No result found. Please close this tab.");
//             window.close();
//           </script>
//         </body>
//       </html>`);
//       }
//       res.redirect(clckerLog.dataValues.landing_page);
//     } else {
//       return res.send(`<html>
//         <body>
//           <script>
//  alert("No result found. Please close this tab.");
//             window.close();
//           </script>
//         </body>
//       </html>`);
//     }
//   } catch (error) {
//     console.log({ error });

//     res
//       .status(500)
//       .json({ status: false, message: "Error updating Clicker User" });
//   }
// };
