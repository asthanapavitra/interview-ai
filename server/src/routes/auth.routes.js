const {Router}=require('express');
const {registerUserController,loginUserController,logoutUserController,getProfile,googleAuthController}=require('../controllers/auth.controller')
const authMiddleware=require('../middlewares/auth.middleware')

const router=Router();

/**
 * @routes /api/auth/register
 * @access Public
 * @description Register a new user
 */
router.post('/register', registerUserController)

/**
 * @routes /api/auth/login
 * @access Public
 * @description Login a user with email and password
 */

router.post('/login', loginUserController)
/**
 * @routes /api/auth/logout
 * @access Public
 * @description Logouts user by removing token
 */
router.get('/logout', logoutUserController)

/**
 * @routes /api/auth/google
 * @access Public
 * @description Login/Register a user via Google Sign-In
 */
router.post('/google', googleAuthController)
/**
 * @routes /api/auth/get-profile
 * @access Private
 * @description Provides user details
 */

router.get('/get-profile', authMiddleware, getProfile)

module.exports=router;