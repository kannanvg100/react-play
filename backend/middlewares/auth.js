const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = {
	protect: async (req, res, next) => {
		const token = req.cookies.jwt
		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET)
				req.user = await User.findById(decoded.userId).select('-password')
				next()
			} catch (error) {
				console.error(error)
				res.status(401).json({ message: 'invalid token' })
			}
		} else {
			res.status(401).json({ message: 'no token' })
		}
	},

    protectAdmin: async (req, res, next) => {
		const token = req.cookies.jwt
		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET)
				req.user = await User.findById(decoded.userId).select('-password')
                if (!req.user.isAdmin) return res.status(401).json({ message: 'Pls use a admin acoount' })
				next()
			} catch (error) {
				console.error(error)
				res.status(401).json({ message: 'invalid token' })
			}
		} else {
			res.status(401).json({ message: 'no token' })
		}
	},
}
