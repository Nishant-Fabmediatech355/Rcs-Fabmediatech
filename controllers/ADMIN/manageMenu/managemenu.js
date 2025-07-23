import MenuMaster from "../../../models/menu_master.js";

//  Manage Menus
export const CreateMenu = async (req, res) => {
  try {
    const { menu_url, menu_display_name, srl_number, is_active} = req.body;
    

    // Create a new menu in the MenuMaster table
    const newMenu = await MenuMaster.create({
      menu_url,
      menu_display_name,
      srl_number,
      is_active
    });

    return res.status(201).json({ status: true, message: "Menu created successfully", data: newMenu });
    
  } catch (error) {
    console.error("Error creating menu:", error);  // Log error for debugging
    return res.status(500).json({ status: false, error: error.message });
  }
};

// Read All
export const GetAllMenu = async (req, res) => {
  try {
    const menus = await MenuMaster.findAll();
    res.status(200).json({
      status:true,
      massage:"Menu Fetched!",
      Data:menus
    }
    );
  } catch (error) {
    res.status(500).json({ status:false,error: error.message });
  }
};
// Read by ID
export const GetOneMenu = async (req, res) => {
  try {
    const { menu_id } = req.body;
    const menu = await MenuMaster.findByPk(menu_id);
    if (!menu) return res.status(404).json({status:false, error: "Menu not found" });
    res.status(200).json({status:true,Data:menu});
  } catch (error) {
    res.status(500).json({status:false, error: error.message });
  }
};

// Update
export const UpdateMenu = async (req, res) => {
  try {
    const { menu_id } = req.body;
    const { menu_url, menu_display_name, srl_number, is_active } =
      req.body;
    const [updated] = await MenuMaster.update(
      { menu_url, menu_display_name, srl_number, is_active },
      { where: { menu_id: menu_id } }
    );
    if (!updated) return res.status(404).json({ error: "Menu not found" });
    const updatedMenu = await MenuMaster.findByPk(menu_id);
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete
export const DeleteMenu = async (req, res) => {
  try {
    const { menu_id } = req.body;
    const deleted = await MenuMaster.destroy({ where: { menu_id: menu_id } });
    if (!deleted) return res.status(404).json({ error: "Menu not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

