// const UserRouter = require('./userRoutes')
const AuthRouter = require('./authRoutes')

// Contains routes 
function route(app) {
  app.use('/auth', AuthRouter)
  // app.use('/user', UserRouter)
}
module.exports = route;