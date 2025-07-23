export const createCardOrientation = async (req, res) => {
  const { card_orientation_name } = req.body;
  try {
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Error creating card orientation",
    });
  }
};
