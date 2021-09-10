const express = require('express')
require('./db/mongoose.js')
const User = require('./models/user')
const Task = require('./models/task')
const { response } = require('express')
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app =  express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () =>{
    console.log("Server is up! Port: " + port)
})

