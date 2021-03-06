let socket = io.connect();

//login screen constants
const loginScreen = document.getElementById('loginScreen');
const loginBtn = document.getElementById('loginButton');
const username = document.getElementById('nameInput');

const activeUsers = document.getElementById('activeUsers')
//chat screen constants
const chatScreen = document.getElementById('chatScreen');
const input = document.getElementById('postInput');
const target = document.getElementById('target');
const sendToAll = document.getElementById('toAll');
const sendToSelf = document.getElementById('toSelf');

//templates
const postTemplate = document.getElementById("postTemplate");
const notificationTemplate = document.getElementById("notificationTemplate");
const activeUserTemplate = document.getElementById("activeUserTemplate");

/**
 * post class to add some extra structure to the posting system
 */
class post{
    constructor(name, message){
        this.name = name;
        this.message = message;
    }
}


//login button functionality
loginBtn.addEventListener("click", ()=>
{
    //  if validated; store username + close login + move to chat
    // TODO: validate username

    // store username
    localStorage.setItem('username', username.value);
    socket.emit('join', localStorage.getItem('username'));

    //switch from login to chat
    loginScreen.hidden = true;
    chatScreen.hidden = false;
})
//sendtoall button functionality
sendToAll.addEventListener("click", ()=>
{
    socket.emit('sendToAll', new post(username.value, input.value));
});

//sendtoself button functionality
sendToSelf.addEventListener("click", ()=>
{
    socket.emit('sendToSelf', new post(username.value, input.value));
});

//display message functionality
socket.on('displayMessage', (data) =>
{
    let clone = postTemplate.content.cloneNode(true);
    let content = clone.querySelectorAll('span');
    content[0].textContent = data.name;
    content[2].textContent = data.message;
    target.appendChild(clone);
    // target.innerHTML += '<br>' + data.name + ': '+ data.message;
});

socket.on('notification', (notification) =>{
    let clone = notificationTemplate.content.cloneNode(true);
    let content = clone.querySelector('td');
    content.innerText = notification;
    target.appendChild(clone);
});

socket.on('shenanigans', ()=>{
   console.log('yeet!');
   location.reload();
});

socket.on('users', (listOfUsernames) =>
{
    //first, empty the table entirely
    activeUsers.innerHTML = "";

    console.log(listOfUsernames);
    //next, start populating the table.
    listOfUsernames.forEach((name)=>{

        console.log("bloop");
        let clone = activeUserTemplate.content.cloneNode(true);
        let btn = clone.querySelector('button');
        btn.innerText = name;
        btn.id = name;
        activeUsers.appendChild(clone);

        btn.addEventListener("click", ()=>{
            console.log("shenanigans in action...");
            socket.emit('messWithUser', btn.id);
        })
    });

});