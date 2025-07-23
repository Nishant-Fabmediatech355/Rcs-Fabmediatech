import express from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import {
    signup, login, logout, refreshToken, verifyOtp, forgotPassword, resetPassword,
    getCustomerDetails, updateCustomerProfile, changeCustomerPassword, generateOtp, initialChangePassword
} from
    '../../controllers/auth/authController.js';

const authRoutes = express.Router();
authRoutes.post('/login', login);
authRoutes.post('/verify-otp', verifyOtp)
authRoutes.post('/generate-otp', generateOtp);
authRoutes.put('/change-password', authenticate, changeCustomerPassword);

authRoutes.post('/signup', signup);
authRoutes.post('/logout', logout);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password', authenticate, resetPassword);
authRoutes.post('/refreshToken', refreshToken);
authRoutes.get('/profile-details', authenticate, getCustomerDetails);
authRoutes.put('/update-profile', authenticate, updateCustomerProfile);
authRoutes.put('/initial-change-password', authenticate, initialChangePassword);

export default authRoutes;
