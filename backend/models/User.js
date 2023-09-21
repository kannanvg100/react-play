const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: [3, 'Name should have atleast 3 Chars'],
		default: 'User',
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'Please Enter Your Email address'],
		validate: [validator.isEmail, 'Please Enter a Valid Email'],
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: [true, 'Please Enter Your Password'],
		minLength: [4, 'Password should have atleast 4 Chars'],
		trim: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
    profileImage: {
		type: String,
        default: 'default_profile_image.jpg',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}
	this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema, 'users')
