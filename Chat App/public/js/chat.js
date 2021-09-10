const socket = io()

//Elements
const $messageForm = document.querySelector("form")
const $messageFormInput = $messageForm.querySelector("#text")
const $messageFormButton = $messageForm.querySelector("#submit")
const $locationButton = document.querySelector("#sendlocation")
const $messages = document.querySelector("#messages")

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = ()=>{

    // New message element
    const $newMessage = $messages.lastElementChild

    //Height of New message
    const newMessagesStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessagesStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible Height
    const visibleHeight = $messages.offsetHeight

    //Height of messages cointeiner
    const conteinerHeight = $messages.scrollHeight

    //How far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    console.log("Scroll?")
    console.log(conteinerHeight - newMessageHeight)
    if(conteinerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
        console.log("Yes")
    }
}

socket.on("message",(message)=>{
    //Server Message
    console.log(message.text)

    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
        username: message.username
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on("send",(start)=>{
    //Client Message 
    console.log(start)
    const html = Mustache.render(messageTemplate, {
        message: start.text,
        createdAt: moment(start.createdAt).format('h:mm a'),
        username: start.username
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on("sendLocation", (position)=>{
    //Messege client position

    const html = Mustache.render(locationTemplate, {
        message: position.text,
        createdAt: moment(position.createdAt).format('h:mm a'),
        username: position.username
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on("roomData", ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {room, users})
    document.querySelector("#sidebar").innerHTML = html
})


//Send Message
$messageForm.addEventListener("submit", (e) =>{
    e.preventDefault();

    //disable
    $messageFormButton.setAttribute("disabled", "disabled")
    
    var x = e.target.elements.message.value;
    socket.emit("send", x, (a) =>{
        if(a){
            return console.log(a)
        }

        autoscroll()

        //enable
        console.log("Delivered!")
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()
    
    }) 

})

//Send Location
$locationButton.addEventListener("click", ()=>{

    if(!navigator.geolocation){
        return alert("Goelocation is not supported. Change your browser")
    }

    $locationButton.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit("sendLocation", {lat: position.coords.latitude, long: position.coords.longitude}, (a)=>{
            console.log(a)
            $locationButton.removeAttribute("disabled")
        })
    })

})

socket.emit("join", { username, room}, (e)=>{
    if(e){

        alert(e)
        location.href = "/"

    }
})


