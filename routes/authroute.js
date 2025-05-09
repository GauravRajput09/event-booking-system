const express = require('express');
const router = express.Router();

const {
    registerUser,
    login,
    verifyEmail,
    getCurrentUser} = require('../Controllers/auth');


const {registerRules,loginRules,validate} = require('../middleware/validatormiddle');
const {protect, authorize}=require('../middleware/authmiddleware')


router.get('/me',protect, getCurrentUser);
router.get('/admin-route',protect,authorize('admin'))
router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, login);
router.get('/verify/:token', verifyEmail);

module.exports = router;