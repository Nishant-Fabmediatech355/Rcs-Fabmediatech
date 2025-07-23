
const roleMiddleware = (...allowedRoles) => {
    return (req,res,next) => {
      if(!allowedRoles.includes(req.AdminMaster.admin_type)) {
        return res.status(403).json({ message: 'Unauthorized Access' });
      }
      next();
    };
  }
  
  export default roleMiddleware
  