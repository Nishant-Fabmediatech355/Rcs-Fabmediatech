
import Role from "../../../models/role.js";
export const createRole = async(req,res)=>{
  const {role_name} = req.body;
  try {
    const [role , createRole] =await Role.findOrCreate({where:{role_name : role_name}})
    if(createRole){
      res.status(200).json({
        status:true,
        message:'Role Created!',
      })
    }else{
    res.status(200).json({
      status:true,
      message: 'Role Existed !',
    })
  }
  } catch (error) {
    res.status(500).json({
      status:false,
      message:error.message
    })
  }
}

export const getAllRole = async(req,res)=>{
  try {
    const result =await Role.findAndCountAll();
    
    res.status(200).json({
      status:true,
      message: 'Role All Roles !',
      Data:result
    })
  
  } catch (error) {
    res.status(500).json({
      status:false,
      message:error.message
    })
  }
}
export const updateRole = async(req,res)=>{
  const {role_id,role_name}=req.body;
 try {
   const updateRole = await Role.findByPk(role_id);

   if (!updateRole) {
    return res.status(402).json({
      status: false,
      message: "Role Id Not Found",
    });
  }
 
   await updateRole.update({role_name});

   res.status(200).json({
    status: true,
    message: " Role Updated !",
    Data: updateRole
  });
 } catch (error) {
    logger.info(`Failed due to ${error}`);
    res.status(500).json({
      status: false,
      message: error.message,
    });
 }


}

export const getRole =async (req,res)=>{
  const {role_id} = req.body;
try {
const getRole = await Role.findByPk(role_id)   

  if(!getRole){
    return res.status(402).json({
      status: false,
      message: "Not Found",
    });
  }
   res.status(200).json({
    status: true,
    message: " Role Fetched !",
    Data: getRole
  });
} catch (error) {
  logger.info(`Failed due to ${error}`);
  res.status(500).json({
    status: false,
    message: error.message,
  });
}
}

export const deleteRole =async(req,res)=>{
  const {role_id}=req.body;
  try {
     const deleteRole= await Role.destroy({where:{role_id}});
     console.log({deleteRole});
     
     if (!deleteRole) {
      return res.status(409).json({
        status:false,
        message:'Record not found'
      })
     }
     res.status(200).json({
      status: true,
      message: 'Role DELETED !',
    });
  } catch (error) {
    console.log({error});
    
    res.status(500).json({
    status: false,
    message: error.message,
  });
  }
}
