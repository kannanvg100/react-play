const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const adminRouter = require('./routes/adminRouter')
const usersRouter = require('./routes/userRouter')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', usersRouter)
app.use('/api/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	res.status(404).json({ message: 'Page not found' })
})

// error handler
app.use(function (err, req, res, next) {
	console.error(err)
	res.status(500).json({ message: 'Internal Server Error' })
})

module.exports = app
