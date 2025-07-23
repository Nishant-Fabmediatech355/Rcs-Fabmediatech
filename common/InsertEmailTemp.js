import EmailTemplate from "../models/EmailTemplate.js";

export const InsertEmailTemp = async () => {
  try {
    const [created, template] = await EmailTemplate.findOrCreate({
      where: { template_name: "create_customer" },
      defaults: {
        template_name: "create_customer",
        template_subject: "Your Account Has Been Created",
        template_text: `<div style="font-family: Arial, sans-serif; max-width: 100%; margin: 0 auto; padding: 20px;">
    <div style="text-align: left; margin-bottom: 20px;">
      <p style="font-size: 16px; margin-bottom: 10px;">Dear {{username}},</p>
      <p style="font-size: 16px; margin-bottom: 10px;">
        Your One Time Password for SMS Panel login is: 
        <strong style="font-size: 18px;">{{otp}}</strong>
      </p>
    </div>
    
    <div style="text-align: left; background-color: #f8f8f8; padding: 15px; border-left: 4px solid #e74c3c; margin-bottom: 20px;">
      <p style="font-size: 14px; margin: 0; color: #333;">
        <strong>Important:</strong> Please do not share this OTP with anyone.
      </p>
      <p style="font-size: 14px; margin: 10px 0 0 0; color: #333;">
        In case you have not initiated this request please contact <a href="mailto:support@fabmediatech.com" style="color: #3498db;">support@fabmediatech.com</a>
      </p>
    </div>
    
    <div style="border-top: 1px solid #eeeeee; padding-top: 20px;">
      <p style="font-size: 14px; margin: 0 0 5px 0; text-align: left;">Regards,</p>
      <p style="font-size: 16px; font-weight: bold; margin: 0 0 20px 0; text-align: left;">Team Fabmediatech</p>
      <div style="text-align: left;">
        <img src="https://fabmediatech.com/images/logo-updated.png" alt="Fabmediatech Logo" style="max-height: 40px;">
      </div>
    </div>
  </div>`,
        list_variables: " username, otp,mobile",
      },
    });
    if (created) {
      console.log("Template Created Successfully");
				} else {
					console.log("Template Already Exists");
    }
  } catch (error) {
    console.log({ error: error.message });
  }
};
