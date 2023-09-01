

const io = require('socket.io')(3001, {
    cors:{
        origin:'http://localhost:3000',
        methods: ['GET','POST']
    }
})

io.on("connection", socket => {

    socket.on('send-changes', delta => {
        console.log(delta) 
    
    socket.broadcast.emit("receive-changes",delta) // here we are saying on our current socket we want to broadcast the changes to everyone except us and the changes are passed as delta 
    })
})







