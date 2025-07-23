import { hashPassword } from "./bcrypt.js";
import Role from "../../models/db1/role.js";
import Permission from '../../models/db1/permission.js'
import AdminMaster from "../../models/db1/admin_master.js";
const createRole = async () => {
  try {
    const [role, create] = await Role.findOrCreate({
      where: { role_name: "All" },
      defaults: { role_name: "All" },
    });
    if (create) {
      console.log("Role Created Successfully");
    } else {
      console.log("Role Already Exist");
    }
  } catch (error) {
    console.log({ error });
  }
};

const createPermission = async () => {
  try {
    const [role, create] = await Permission.findOrCreate({
      where: { permission_name: "All" },
      defaults: { permission_name: "All" },
    });
    if (create) {
      console.log("Permission Created Successfully");
    } else {
      console.log("Permission Already Exist");
    }
  } catch (error) {
    console.log({ error });
  }
};

const createAdmin = async () => {
  try {
    const hashedPassword = await hashPassword("12345");
    const [Admin, Created] = await AdminMaster.findOrCreate({
      where: { admin_email: "superadmin@gmail.com" },
      defaults: {
        first_name: "Admin",
        last_name: "Admin",
        admin_name: "SuperAdmin",
        admin_pwd: hashedPassword,
        admin_email: "superadmin@gmail.com",
        admin_mobile: "9718286467",
        is_Active: true,
        role_id: 1,
      },
    });
    if (Created) {
      console.log(`Admin Created Successfully`);
    } else {
      console.log(`Admin Already Exists`);
    }
  } catch (error) {
    console.log({ error:error.message });
  }
};

export { createAdmin, createRole, createPermission };
