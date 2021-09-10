const path = require("path")
const http = require("http")
const express = require('express')
const socketio = require("socket.io")
const Filter = require("bad-words")
const {generate, generateLoc} = require("./utils/messages")
const {addUser,removeUser,getUser,getUsersInRoom} = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath))


//When connection starts
io.on("connection", (socket)=>{

    //Join
    socket.on("join", ({username, room}, callback)=>{

      const {error, user} = addUser({id: socket.id, username, room})

      if(error){
        return callback(error)
      }

      socket.join(user.room)

      //Messege client on start
      socket.emit("message", generate("Welcome!","Admin"))
      //Message everyone except client
      socket.broadcast.to(user.room).emit("message", generate(user.username + "has joined!","Admin"))

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      })

      callback()

    })


    //Transfer message
    socket.on("send", (message, callback)=>{

      const user = getUser(socket.id)

      const filter = new Filter()

      if(filter.isProfane(message)){
        return callback({text: "Profanity not allowed!"})
      }

      console.log(message)
      //Message everyone
      io.to("ff").to(user.room).emit("send", generate(message, user.username))

      callback()

    })

    //Send Location
    socket.on("sendLocation", (position, callback) => {
      const user = getUser(socket.id)

      io.to(user.room).emit("sendLocation", generateLoc("https://google.com/maps?q="+position.lat+","+position.long, user.username))
      console.log(position)

      callback("Location sent!")
    })

    //If disconnect
    socket.on("disconnect", () =>{
      const user = removeUser(socket.id)

      if(user){
        io.to(user.room).emit("message", generate(`${user.username} has left!`,"Admin"))

        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room)
        })
      }

      
    })

})









server.listen(port, () => {
  console.log(`Server is up at port: ${port}`)
})