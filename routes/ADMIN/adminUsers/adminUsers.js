import express from 'express';
const userRouter = express.Router();
import {
    CreatedBySA,
    forgetPassword,
    GetAdminDetailsById,
    getSubAdminDetails,
    Login, Logout,
    passwordMatched,
    resetForgetPassword,
    resetPassword, UpdateAdmin,
    updateSubAdmin, verifyAccount,
    getAllAdminUser,
    deleteSubAdmin,
    initialChangePassword,
    verifyAdminOtp,
    generateAdminOtp,
} from '../../../controllers/ADMIN/adminUsers/adminUser.js';
import { authenticate } from '../../../middleware/ADMIN/authenticateRoute.js';
import { upload } from '../../../middleware/ADMIN/multer.js';

userRouter.post("/login", Login);
userRouter.post('/verify-otp', verifyAdminOtp )
userRouter.post('/generate-otp', generateAdminOtp);

userRouter.post("/logout", authenticate, Logout);
userRouter.get("/get-admin-details", authenticate, GetAdminDetailsById);
userRouter.patch("/update-admin-profile", upload.single("admin_pic"), authenticate, UpdateAdmin);
userRouter.post("/password-matched", authenticate, passwordMatched)
userRouter.post("/reset-password", authenticate, resetPassword);

// Sub Admin Routes
// userRouter.post("/create-user-by-sub-admin", upload.single("admin_pic"), authenticate, CreatedBySA);
userRouter.post("/create-user-by-sub-admin", authenticate, CreatedBySA);
userRouter.post("/verify-account", authenticate, verifyAccount);
userRouter.get("/get-sub-admin", getSubAdminDetails);
userRouter.patch("/update-sub-admin", authenticate, updateSubAdmin);
userRouter.get("/get-all-admin-user", authenticate, getAllAdminUser);
userRouter.delete("/delete-sub-admin", authenticate, deleteSubAdmin);
// Password Reset Routes
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-forgetpassword", authenticate, resetForgetPassword);
userRouter.put("/initial-change-password", authenticate, initialChangePassword);


export default userRouter