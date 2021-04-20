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


io.on('connection', (socket) =>
{
    //what to do on connection
    console.log(counter + ' someone connected');
    counter++;

    //join logic
    socket.on('join', (data) =>
    {
       console.log(data);
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
    socket.on('sendToSelf', (data) =>{
        socket.emit('displayMessage', (data));
    })

    socket.on('disconnect', ()=>
    {
        counter--;
        console.log(counter + ' user disconnected');
    })
});


server.listen(port, () =>
{
    //what to do when server starts to run
    console.log("server running on " + port);
});

