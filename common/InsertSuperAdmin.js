import CustomerProfile from '../models/db1/'
import CustomerDetails from '../models/customer_details.js'
import CustomerParameters from '../models/customer_parameters.js'
import CustomerCountryMap from '../models/customer_country_MAP.js'
import ResellerProfile from '../models/reseller_profile.js'
import bcrypt from 'bcryptjs';

const InsertSuperAdmin = async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);

    try {
        const [admin, created] = await CustomerProfile.findOrCreate({
            where: { customer_email: "admin@fabmediatech.com" },
            defaults: {
                customer_mobile: "+91 9505515499",
                PANImage: "https://5.imimg.com/data5/SELLER/Default/2023/8/337666275/HF/EJ/ZS/150615656/1000063876.png",
                aadharImage: "https://images.jdmagicbox.com/rep/b2b/Pre-Printed-Aadhaar-Card/Pre-Printed-Aadhaar-Card-1.png",
                PAN: "KWPK3749B",
                aadhar: "863480860550",
                PIN: "845428",
                state: "UP",
                city: "Noida",
                customer_add2: "Logix Technova Tower B-22",
                customer_add1: "Sector-132",
                customer_name: "Fab Media",
                customer_email: "admin@fabmediatech.com"
            }
        })
        if (created) {
          // console.log({admin:admin});
          await CustomerDetails.create({
            intro_by: admin.dataValues.customer_id,
            password: hashedPassword,
            username: "admin@123",
            customer_id: admin.dataValues.customer_id,
            IS_PWDChanged: true, 

          })
            .then((res) => {
              console.log("customer details created");
            })
            .catch((err) => {
              console.log({ err: err.message });
            });
          await CustomerParameters.create({
            deduct_id: admin.dataValues.customer_id,
            balance: 5000,
            od_balance: 0,
            deduct_percent: 10,
            phNo_greater_than: "12",
            is_loginOTP_active: false,
            customer_id: admin.dataValues.customer_id,
            is_loginOTP_active: false,
          })
            .then((res) => {
              console.log("customer parameter created");
            })
            .catch((err) => {
              console.log({ err: err.message });
            });
          await CustomerCountryMap.create({
            route_id: 1,
            dlt_rates: 0.02,
            sms_rates: 0.1,
            country_id: 1,
            customer_id: admin.dataValues.customer_id,
            service_id: 1,
          })
            .then((res) => {
              console.log("customer country map created");
            })
            .catch((err) => {
              console.log({ err: err.message });
            });
          await ResellerProfile.create({
            TM_ID_type: "MT_ID_type",
            TM_ID: "TM_ID",
            reseller_logo:
              "https://www.fabmediatech.com/images/logo_updated30-Dec.png",
            company_name: "Fab Media Tech Pvt. Ltd.",
            reseller_footer: "Footer",
            customer_id: admin.dataValues.customer_id,
            reseller_header: "Header",
            reseller_domain: process.env.frontend, // https://smssite.fabmediatech.com
          })
            .then((res) => {
              console.log("reseller profile created");
            })
            .catch((err) => {
              console.log({ err: err.message });
            });
        } else {
            return console.log('Super Admin Already Found')

        }
    } catch (error) {
        return console.log("admin insert error", { error: error });

    }
}

//export default InsertSuperAdmin;