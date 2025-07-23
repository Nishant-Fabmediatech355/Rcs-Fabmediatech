import AdminMaster from "../../../models/db1/admin_master.js";
import CustomerDetails from "../../../models/db1/customer_details.js";
import CustomerParameters from "../../../models/db1/customer_parameters.js";
import CustomerProfile from "../../../models/db1/customer_profile.js";
import ResellerProfile from "../../../models/db1/reseller_profile.js";
import Role from "../../../models/db1/role.js";

export const ViewCustomer = async (req, res) => {
  try {
    const admin_id = req.authData.userId;

    const customers = await CustomerProfile.findAll({
      include: [
        {
          model: CustomerDetails,
          as: "customer_detail",
          attributes: ["username", "intro_by", "is_active"],
          include: {
            model: CustomerProfile,
            as: "customer_profile",
            attributes: ["customer_name"],
          },
        },
        {
          model: CustomerParameters,
          as: "parameter",
          attributes: [],
        },
        {
          model: ResellerProfile,
          as: "reseler",
          attributes: ["company_name"],
        },
      ],
    });

    // Check if no customers are found
    if (!customers || customers.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No customers found",
      });
    }

    // Return the fetched customer data
    return res.status(200).json({
      status: true,
      message: "Customer Fetched!",
      Data: customers,
    });
  } catch (error) {
    console.error("Error retrieving customers:", error);

    // Return a 500 error with the error message
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve customers",
      error: error.message,
    });
  }
};

// Find a customer by ID
export const ViewCustomerById = async (req, res) => {
  const admin_id = req.authData.userId; // Get admin_id from token
  console.log(`Admin ${admin_id} accessed customer ${req.params.customer_id}`);
  const { customer_id } = req.params;
  try {
    // Fetch the customer by ID
    const customer = await CustomerProfile.findOne({
      where: { customer_id },

      include: [
        {
          model: CustomerDetails,
          as: "customer_detail",
        },
        {
          model: CustomerParameters,
          as: "parameter",
        },
      ],
    });

    // Check if the customer exists
    if (!customer) {
      return res.status(404).json({
        status: false,
        message: `Customer with ID ${customer_id} not found`,
      });
    }

    // Respond with the customer details
    return res
      .status(200)
      .json({ status: true, message: "Customer Fetched !", Data: customer });
  } catch (error) {
    console.error("Error retrieving customer by ID:", { error });

    // Return a 500 error with a detailed message
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve customer",
      error: error,
    });
  }
};

// Delete Custoner By Id In Params
export const DeleteCustomer = async (req, res) => {
  try {
    const admin_id = req.authData.userId; // Get admin_id from token
    const { id: customerId } = req.params;

    console.log(
      `Admin ${admin_id} attempting to delete customer ${customerId}`
    );
    // const { id: customerId } = req.params; // Extract customer ID from request params

    // Attempt to delete the customer
    const deletedCount = await CustomerProfile.destroy({
      where: { customer_id: customerId },
    });

    // Check if any rows were affected (deletedCount === 0 means no matching record)
    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Customer not found" });
    }

    // Successful deletion
    return res
      .status(200)
      .json({ status: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);

    // Handle server-side errors
    return res.status(500).json({
      status: false,
      message: "Server error while deleting customer",
      error: error.message,
    });
  }
};

// Update a customer by ID
export const UpdateCustomer = async (req, res) => {
  try {
    const admin_id = req.authData.userId; // Get admin_id from token
    const { id } = req.params;

    console.log(`Admin ${admin_id} updating customer ${id}`);
    // const { id } = req.params;
    const customerId = parseInt(id, 10);
    const {
      customer_name,
      customer_mobile,
      country_code,
      customer_add1,
      customer_add2,
      city,
      state,
      PIN,
      customer_email,
      username,
      is_active,
    } = req.body;

    // Create full mobile number if needed
    const fullMobileNumber =
      country_code && customer_mobile
        ? `${country_code}${customer_mobile}`
        : undefined;

    // Update CustomerProfile
    const [profileUpdated] = await CustomerProfile.update(
      {
        customer_name,
        customer_mobile: fullMobileNumber,
        customer_add1,
        customer_add2,
        city,
        state,
        PIN,
        customer_email,
        mobilesForOTP: fullMobileNumber,
      },
      { where: { customer_id: customerId } }
    );

    // Update CustomerDetails (login-related)
    const [detailsUpdated] = await CustomerDetails.update(
      {
        username,
        is_active,
      },
      { where: { customer_id: customerId } }
    );

    if (profileUpdated === 0 && detailsUpdated === 0) {
      return res.status(404).json({
        status: false,
        message: "No data updated or customer not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Customer updated successfully",
      updated: {
        profileUpdated,
        detailsUpdated,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

export const CreateCustomerAdmin = async (req, res) => {
  const {
    username,
    customer_name,
    customer_mobile,
    country_code,
    customer_add1,
    customer_add2,
    company_name,
    city,
    state,
    PIN,
    customer_email,
    account_manager_id,
  } = req.body;
  const admin_id = req.authData.userId;

  if (!username || !customer_name || !customer_mobile || !customer_email) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields", status: false });
  }

  try {
    const existingUser = await CustomerDetails.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already in use" });
    }

    if (account_manager_id) {
      // Fetch account manager with role details
      const accountManager = await AdminMaster.findOne({
        where: { admin_id: account_manager_id },
        include: {
          model: Role,
          as: "role", // Ensure 'role' is populated from the Role table
        },
      });

      console.log("Account Manager:", accountManager); // Debug log

      // Check if the account manager exists and has the correct role_id
      if (!accountManager || accountManager.role.role_id !== 6) {
        // role_id = 6 for "Account Manager"
        return res
          .status(400)
          .json({ message: "Invalid Account Manager selected" });
      }
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

      for (let i = password.length; i < 8; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
      }

      for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
      }

      return password.join("");
    };

    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const fullMobileNumber = `${country_code}${customer_mobile}`;

    const newCustomerProfile = await CustomerProfile.create({
      customer_name,
      customer_mobile: fullMobileNumber,
      customer_add1,
      customer_add2,
      company_name,
      city,
      state,
      PIN,
      customer_email,
      mobilesForOTP: fullMobileNumber,
      account_manager_id: account_manager_id || null,
    });

    await CustomerDetails.create({
      customer_id: newCustomerProfile.customer_id,
      username,
      password: hashedPassword,
      is_active: true,
      intro_by: admin_id,
      IS_PWDChanged: false,
    });

    await CustomerParameters.create({
      customer_id: newCustomerProfile.customer_id,
      deduct_id: 1,
    });

    await sendOtpEmailCreateCustomer(customer_email, plainPassword, username);

    return res.status(201).json({
      status: true,
      message: "Customer created successfully",
      data: {
        customer_id: newCustomerProfile.customer_id,
        customer_name,
      },
    });
  } catch (err) {
    console.error("Error creating customer:", err);
    return res.status(500).json({
      message: "Failed to create customer",
      error: err.message,
    });
  }
};

export const GetAccountManagersByRole = async (req, res) => {
  try {
    const accountManagers = await AdminMaster.findAll({
      include: [
        {
          model: Role,
          as: "role",
          where: { role_id: 6 }, // Only account managers
          attributes: ["role_id", "role_name"],
        },
      ],
      attributes: ["admin_id", "first_name", "admin_email"],
    });

    return res.status(200).json({
      status: true,
      data: accountManagers,
    });
  } catch (error) {
    console.error("Error fetching account managers:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch account managers",
      error: error.message,
    });
  }
};

export const updateCustomerBalanceByAdmin = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { customer_id, balance, request_id, summary } = req.body;
    const admin_id = req.authData.userId;

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }
    if (balance === undefined || balance === null) {
      return res.status(400).json({ message: "Balance is required" });
    }
    if (!request_id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    const customerParams = await CustomerParameters.findOne({
      where: { customer_id },
      transaction: t,
    });
    if (!customerParams) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const existingTransaction = await TransactionHistory.findOne({
      where: { request_id },
      transaction: t,
    });
    if (existingTransaction) {
      return res.status(400).json({ message: "Request ID already used" });
    }

    // Calculate new balance
    const currentBalance = Number(customerParams.balance);
    const balanceChange = Number(balance);
    const newBalance = currentBalance + balanceChange;

    // Check for sufficient funds if deducting balance
    if (balanceChange < 0 && Math.abs(balanceChange) > currentBalance) {
      return res.status(400).json({
        message: "Insufficient balance",
        current_balance: currentBalance,
        required: Math.abs(balanceChange),
      });
    }

    // Update customer balance
    await CustomerParameters.update(
      { balance: newBalance },
      { where: { customer_id }, transaction: t }
    );

    // Record transaction
    await TransactionHistory.create(
      {
        from: admin_id,
        to: customer_id,
        debit: balanceChange < 0 ? Math.abs(balanceChange) : null,
        credit: balanceChange > 0 ? balanceChange : null,
        summary: summary || "Balance updated",
        request_id: request_id,
        previous_balance: currentBalance,
        new_balance: newBalance,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      message: "Balance updated successfully",
      updated_balance: newBalance,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error Updating Balance by Admin:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const searchCustomer = async (req, res) => {
  try {
    const admin_id = req.authData.userId;
    const { field, query } = req.query;

    if (!field || !query) {
      return res
        .status(400)
        .json({ status: false, message: "Field and query are required" });
    }

    let whereProfile = {};
    let whereDetails = {};

    switch (field) {
      case "customer_id":
        whereProfile.customer_id = query;
        break;
      case "customer_name":
        whereProfile.customer_name = { [Op.like]: `%${query}%` };
        break;
      case "username":
        whereDetails.username = { [Op.like]: `%${query}%` };
        break;
      case "customer_email":
        whereProfile.customer_email = { [Op.like]: `%${query}%` };
        break;
      default:
        return res
          .status(400)
          .json({ status: false, message: "Invalid search field" });
    }

    const customers = await CustomerProfile.findAll({
      where: whereProfile,
      include: [
        {
          model: CustomerDetails,
          as: "customer_details",
          where: Object.keys(whereDetails).length ? whereDetails : undefined,
        },

        {
          model: CustomerParameters,
          as: "customer_parameters",
        },
      ],
    });

    if (!customers.length) {
      return res
        .status(404)
        .json({ status: false, message: "No customers found" });
    }

    return res.status(200).json({
      status: true,
      message: "Search result fetched successfully",
      Data: customers,
    });
  } catch (error) {
    console.error("Error in customer search:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const AddToCustomerWhitelist = async (req, res) => {
  try {
    const admin_id = req.authData.userId;
    const { customer_id, whitelistText } = req.body;
    const whitelistFile = req.file;

    let numbers = [];

    if (whitelistText && whitelistText.trim() !== "") {
      numbers = whitelistText
        .split(/[\n,]+/)
        .map((num) => num.trim())
        .filter((num) => num !== "");
    } else if (whitelistFile) {
      const filePath = path.join(
        whitelistFile.destination,
        whitelistFile.filename
      );
      const fileContent = fs.readFileSync(filePath, "utf-8");

      numbers = fileContent
        .split(/[\n,]+/)
        .map((num) => num.trim())
        .filter((num) => num !== "");
    } else {
      return res.status(400).json({
        status: false,
        message: "Please provide numbers in textarea or upload a valid file.",
      });
    }

    if (!customer_id || numbers.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid customer_id or empty number list.",
      });
    }

    // ✅ Delete matching blacklist numbers
    const deleteCount = await CustomerBlacklist.destroy({
      where: {
        customer_id,
        phNo: numbers,
      },
    });

    return res.status(200).json({
      status: true,
      message: `${deleteCount} number(s) removed from blacklist.`,
      deletedCount: deleteCount,
    });
  } catch (error) {
    console.error("Error removing from blacklist:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while removing from blacklist",
      error: error.message,
    });
  }
};

export const getCustomerTransactionHistoryByAdmin = async (req, res) => {
  try {
    const customer_id = req.params.customer_id;

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const { fromDate, toDate, page = 1, limit = 20 } = req.query;

    let dateFilter = {};
    if (fromDate && toDate) {
      dateFilter = {
        createdAt: {
          [Op.between]: [
            new Date(fromDate),
            new Date(new Date(toDate).setHours(23, 59, 59, 999)),
          ],
        },
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await TransactionHistory.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ from: customer_id }, { to: customer_id }],
          },
          dateFilter,
        ],
      },
      include: [
        {
          model: CustomerProfile,
          as: "fromCustomer",
          attributes: ["customer_id", "customer_name"],
        },
        {
          model: CustomerProfile,
          as: "toCustomer",
          attributes: ["customer_id", "customer_name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    const formatted = rows.map((transaction) => ({
      transaction_id: transaction.transaction_id,
      fromName: transaction.fromCustomer?.customer_name || "N/A",
      toName: transaction.toCustomer?.customer_name || "N/A",
      debit: transaction.debit,
      credit: transaction.credit,
      summary: transaction.summary,
      request_id: transaction.request_id,
      date: transaction.createdAt,
    }));

    return res.status(200).json({
      transactions: formatted,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching transaction history (admin):", error);
    return res.status(500).json({
      message: "Failed to fetch transaction history",
      error: error.message,
    });
  }
};
