const productRouter = require('./product')
// const siteRouter = require('./site')
const RegisterRouter = require('./register')
const LoginRouter = require('./login')
// const meRouter = require('./me')
const authRouter = require('./auth')
const profileRouter = require('./profile')
const userRouter = require('./user')
const categoryRouter = require('./category')

const route = (app) => {
    // app.use('/api/site', siteRouter)
    app.use('/api/products', productRouter)
    app.use('/api/register', RegisterRouter)
    app.use('/api/login', LoginRouter)
    // app.use('/api/me', meRouter)
    app.use('/api/auth', authRouter)
    app.use('/api/users', userRouter)
    app.use('/api/profile', profileRouter)
    app.use('/api/categories', categoryRouter)
}

module.exports = route