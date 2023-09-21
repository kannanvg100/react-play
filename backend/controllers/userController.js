const User = require('../models/User')
const generateToken = require('../utils/generateToken')

module.exports = {
	login: async (req, res, next) => {
		try {
			const { email, password } = req.body

			const user = await User.findOne({ email })
			if (!user) return res.status(404).json({ message: 'Email not registered' })
            
			const isPasswordValid = await user.comparePassword(password)
			if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' })
            
			generateToken(res, user._id)
			res.status(200).json({ name: user.name, _id: user._id, email: user.email, profileImage: user.profileImage })
		} catch (error) {
			next(error)
		}
	},

	signup: async (req, res, next) => {
		try {
			const { name, email, password } = req.body
			const userExists = await User.findOne({ email })

			if (userExists) res.status(400).json({ message: 'User already exists' })

			const user = await User.create({ name, email, password })
			if (user) {
				generateToken(res, user._id)
				res.status(201).json({ _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage })
			} else {
				res.status(400).json({ message: 'Registration failed' })
			}
		} catch (error) {
			next(error)
		}
	},

	logoutUser: (req, res, next) => {
		try {
			res.cookie('jwt', '', {
				httpOnly: true,
				expires: new Date(0),
			})
			res.status(200).json({ message: 'Logged out successfully' })
		} catch (error) {
			next(error)
		}
	},

	updateUserProfile: async (req, res, next) => {
		try {
			const user = await User.findById(req.user._id)

			if (user) {
				user.name = req.body.name || user.name
				user.email = req.body.email || user.email

				if (req.body.password) {
					user.password = req.body.password
				}

                if (req.file) {
                    user.profileImage = req.file.filename
                }

				const updatedUser = await user.save()

				res.status(200).json({
					_id: updatedUser._id,
					name: updatedUser.name,
					email: updatedUser.email,
					profileImage: user.profileImage,
				})
			} else {
				res.status(404).json({ message: 'User not found' })
			}
		} catch (error) {
			next(error)
		}
	},
}
