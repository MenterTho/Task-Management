const express = require('express');
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const http = require('http');
const connectDB = require('./Config/db')
const appRoutes = require('./Routes/appRoutes')

dotenv.config()
const app = express()
const port = process.env.PORT || 3001  

app.use(express.json())
app.use(morgan("combined"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())


// appRoutes(app)

connectDB()
// Start the server
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`)
})