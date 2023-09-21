const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { protect } = require('../middlewares/auth')
const upload = require('../config/multer')

// router.get('/', protect, userController.home)
router.patch('/profile', protect, upload.single('image'), userController.updateUserProfile)
router.post('/login', userController.login)
router.post('/signup', userController.signup)
router.get('/logout', userController.logoutUser)

module.exports = router
