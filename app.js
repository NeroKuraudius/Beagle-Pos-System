if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// modules
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('cookie-session')
const flash = require('connect-flash')

// routes
const { apis, pages } = require('./routes')
const hbsHelpers = require('./helpers/handlebars-helpers')
const authHelpers = require('./helpers/auth-helpers')
const passport = require('./config/passport')

const app = express()
const PORT = process.env.PORT

// set templates
app.engine('hbs', exphbs.engine({ helpers: hbsHelpers, extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

// import CSS
app.use(express.static('public'))

// set session
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }))

// use body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// set passport
app.use(passport.initialize())
app.use(passport.session())

// set middleware
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.danger_msg = req.flash('danger_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.loginUser = authHelpers.getUser(req)
  next()
})

// set routes
app.use('/api', apis)
app.use(pages)

app.listen(PORT, () => console.log(`App execute on port:${PORT}!`))

module.exports = app