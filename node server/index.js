const express = require('express');
const app = express();
const port = 3000;
var http = require("http").Server(app);
var io = require("socket.io")(http);
const path =require('path');
const { Socket } = require('socket.io');
const mainFile = path.join(__dirname, "../")
//  console.log(__dirname);

// here we use middleware
app.use(express.static(mainFile));


app.get("/",function(req,res){
    res.sendFile(mainFile + "/index.html");
});
const activeuser = {};

io.on("connection",(socket)=>{
    socket.on("new_user_joined",(username)=>{
        console.log("new user ",username);
        activeuser[socket.id] = username;
        socket.broadcast.emit("user-joined",username);

        socket.on("disconnect",()=>{
            console.log("user left ",username);
            socket.broadcast.emit("user-left",username);

        })
    })
    socket.on("send",(message)=>{
        // console.log(message);
        socket.broadcast.emit("recieve",{
           message : message,
           username : activeuser[socket.id]
        })
    })
})

http.listen(port,function(err){
    if(err){
        console.log("Error in the server",err);
    }
    console.log(`Server is running on port ${port}`);
});