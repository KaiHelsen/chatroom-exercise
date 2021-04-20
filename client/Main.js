let socket = io.connect();
const login = document.getElementById('login');
const username = document.getElementById('nameInput');
const input = document.getElementById('postInput');
const target = document.getElementById('target');
const sendToAll = document.getElementById('toAll');
const sendToSelf = document.getElementById('toSelf');

const postTemplate = document.getElementById("postTemplate")

/**
 * post class to add some extra structure to the posting system
 */
class post{
    constructor(name, message){
        this.name = name;
        this.message = message;
    }
}


socket.emit('join', 'hello!');

sendToAll.addEventListener("click", ()=>
{
    socket.emit('sendToAll', new post(username.value, input.value));
});

sendToSelf.addEventListener("click", ()=>
{
    socket.emit('sendToSelf', new post(username.value, input.value));
});

socket.on('displayMessage', (data) =>
{
    let clone = postTemplate.content.cloneNode(true);
    let content = clone.querySelectorAll('td');
    content[0].textContent = data.name;
    content[2].textContent = data.message;
    target.appendChild(clone);
    // target.innerHTML += '<br>' + data.name + ': '+ data.message;
});