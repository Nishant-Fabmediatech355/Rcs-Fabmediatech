import AdminMaster from "../../../models/admin_master.js";
import MenuMaster from "../../../models/menu_master.js";
import MenuTrans from "../../../models/menu_trans.js";

//   menu trans Create    ,[menu_id] [admin_id]
export const CreateTrans = async (req, res) => {
  try {
    const { menu_id, admin_id } = req.body;
    const menu = await MenuTrans.findOne({
      where: { menu_id: menu_id, admin_id: admin_id },
    });
    if (!menu) {
      const newMenu = await MenuTrans.create({ menu_id, admin_id });
      res.status(201).json({
        status: true,
        message: "Menu transaction created successfully",
        data: newMenu,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Menu already exists in transaction" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   menu trans remove  ,[menu_id] [admin_id]
export const DeleteTrans = async (req, res) => {
  const { menu_trans_id, admin_id } = req.body;
  console.log({ menu_trans_id });

  try {
    const deleted = await MenuTrans.destroy({
      where: { admin_id: admin_id, menu_id: menu_trans_id }, // Use the correct column name for your primary key
    });

    if (!deleted) {
      return res.status(404).json({ error: "Menu transaction not found" });
    }

    res.status(201).send({
      status: true,
      message: "Menu transaction deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.log({ error });

    res.status(500).json({ error: error.message });
  }
};

// menu tarns by amdin id
export const GetTransByAdmin = async (req, res) => {
  try {
    const { admin_id } = req.query;
    const menus = await MenuTrans.findAll({
      where: { admin_id: admin_id },
      include: [{ model: MenuMaster }, { model: AdminMaster }],
    });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const GetAllTrans = async (req, res) => {
  try {
    const menus = await MenuTrans.findAll({
      include: [{ model: MenuMaster }, { model: AdminMaster }],
    });

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMenuTransByAdminId = async (req, res) => {
  const { admin_id } = req.query;
  const userId = req.authData.userId;
  const role = req.authData.role;
  console.log({ role });

  let menu;
  try {
    if (role === 1) {
      menu = await MenuMaster.findAll({});
    } else {
      menu = await MenuTrans.findAll({
        where: {
          admin_id: admin_id ?? userId,
        },
        include: [{ model: MenuMaster }, { model: AdminMaster }],
      });
    }

    res.status(200).json({
      status: true,
      message: "Menu transactions fetched successfully",
      data: menu,
    });
  } catch (error) {
    console.log({ error: error });

    res.status(500).json({ error: error.message });
  }
};
//    menu trans find one by menutrans id
export const GetOneTrans = async (req, res) => {
  try {
    const { MenuTrans_id } = req.params;
    const menu = await MenuTrans.findByPk(MenuTrans_id, {
      include: [{ model: MenuMaster }, { model: AdminMaster }],
    });
    if (!menu)
      return res.status(404).json({ error: "Menu transaction not found" });
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
