const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect("mongodb://localhost/googledocsclone", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
})

const io = require('socket.io')(3001, {
    cors:{
        origin:'http://localhost:3000',
        methods: ['GET','POST']
    }
})

const defaultValue = ""

io.on("connection", socket => {
    socket.on('get-document',async documentId => {    //loads up the data 
     const document = await findOrCreateDocument(documentId)
     socket.join(documentId)
     socket.emit("load-document",document.data)
     
     socket.on('send-changes', delta => {
     socket.broadcast.to(documentId).emit("receive-changes",delta) // here we are saying on our current socket we want to broadcast the changes to everyone except us and the changes are passed as delta 
    })  
    
    socket.on("save-document",async data => {
        await Document.findByIdAndUpdate( documentId ,{data})
    })
  })
})

async function findOrCreateDocument(id)
{
    if(id == null)
    return 

    const document = await Document.findById(id)
    if (document) return document

    return await Document.create({_id: id , data: defaultValue})
}












