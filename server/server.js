//CONST necessary to server operation
const express = require('express');
const http = require('http');
const app = express();
const port = 8080;
const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));
const server = http.createServer(app);

const io = require('socket.io')(server);

//data management stuff
let counter = 0;
const usersArray = [];

//io connection
io.on('connection', (socket) =>
{
    function UpdateUsers() {
        let usernames = [];
        for(const user of usersArray){
            usernames.push(user.myUsername);
        }
        console.log("updating users...");
        io.emit('users', usernames)
    };

    //what to do on connection
    console.log(counter + ' someone connected');
    counter++;

    //join logic
    socket.on('join', (data) =>
    {
        console.log(data + ' has joined the server on socket id ' + socket.id);
        usersArray.push(new User(data, socket.id));

        UpdateUsers();
    });

    //send to all logic
    socket.on('sendToAll', (data) =>
    {
        let message = data.post;
        let username = data.name;
        io.emit('displayMessage', (data));
        // console.log(message);
    });

    //send to self logic
    socket.on('sendToSelf', (data) =>
    {
        socket.emit('displayMessage', (data));
    })

    socket.on('disconnect', () =>
    {
        let foundId = usersArray.findIndex(user => user.mySocketId == socket.id)
        if (foundId >= 0) {

            console.log(usersArray[foundId].myUsername + ' has disconnected');
            usersArray.splice(foundId);
        }
        else {
            console.log("someone disconnected but the id cannot be found");
        }

        counter--;

        UpdateUsers();
    })
});

server.listen(port, () =>
{
    //what to do when server starts to run
    console.log("server running on " + port);
});

class User
{
    constructor(username, socketId) {
        this.myUsername = username;
        this.mySocketId = socketId;
    }
}

