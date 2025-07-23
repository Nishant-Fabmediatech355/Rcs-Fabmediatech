import Permission from "../../../models/db1/permission.js";
export const createPermission = async (req, res) => {
  const { permission_name } = req.body;
  try {
    const [permission, createPermission] = await Permission.findOrCreate({
      where: { permission_name: permission_name },
    });
    if (createPermission) {
      res.status(200).json({
        status: true,
        message: "Permission Created!",
      });
    } else {
      res.status(500).json({
        status: false,
        message: `Permission Already Exist`,
      });
    }
  } catch (error) {
    res.status(402).json({
      status: true,
      message: error.message,
    });
  }
};

export const updatePermission = async (req, res) => {
  const { permission_id, permission_name } = req.body;
  try {
    const updatePermission = await Permission.findByPk(permission_id);

    if (!updatePermission) {
      return res.status(402).json({
        status: false,
        message: "Permission Id  Not Found",
      });
    }

    await updatePermission.update({ permission_name });

    res.status(200).json({
      status: true,
      message: " Permission Updated !",
      Data: updatePermission,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getPermission = async (req, res) => {
  const { permission_id } = req.body;
  try {
    const getPermission = await Permission.findByPk(permission_id);

    if (!getPermission) {
      return res.status(402).json({
        status: false,
        message: "Not Found",
      });
    }
    res.status(200).json({
      status: true,
      message: " Permission  Fetched !",
      Data: getPermission,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      Data: getPermission,
    });
  }
};

export const getAllPermission = async (req, res) => {
  try {
    const getAllPermission = await Permission.findAndCountAll();

    res.status(200).json({
      status: true,
      message: " All Permission  Fetched !",
      Data: getAllPermission,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      Data: getAllPermission,
    });
  }
};

export const deletePermission = async (req, res) => {
  const { permission_id } = req.body;
  try {
    const deletePermission = await Permission.destroy({
      where: { permission_id },
    });

    if (!deletePermission) {
      return res.status(409).json({
        status: false,
        message: "Permission Id  not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Permission Id  DELETED !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
