// const { format } = require("path");
// const {message} = require("statuses");
// const {append} = require("vary");

const socket = io();
const form = document.getElementById("sendcont");
const messageInput = document.getElementById("send_msg");
const messageContainer = document.getElementById("messagebox");
let audio1 = new Audio("/sound/notification.mp3");
let audio2 = new Audio("/sound/userjoinleave.mp3");

// if(position == "left"){
//     audio1.play();
// }
// if(position == "center"){
//     audio2.play();
// }

const append = (message,position) =>{
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.appendChild(messageElement);

}
form.addEventListener('submit',(evnt)=>{
   evnt.preventDefault(); 
   const message = messageInput.value;
   append(`You : ${message}`,'right');
   socket.emit('send',message)
   messageInput.value ="";
})

const username = prompt("Enter your Username");
socket.emit("new_user_joined",username);
socket.on("user-joined",(username)=>{
    append(`${username} joined the party :)`,"center");
    audio2.play();
})

socket.on('recieve',(data)=>{
    append(`${data.username} : ${data.message}`,"left")
    audio1.play();
})
socket.on("user-left",(username)=>{
    append(`${username} left the party :(`,"center");
    audio2.play();
})
