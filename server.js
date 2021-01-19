// importing

import express from 'express'
import mongoose from 'mongoose'
import messages from './MessagesDB.js'
import Pusher from 'pusher'
import cors from 'cors'

//app config

const pusher = new Pusher({
    appId: "1136847",
    key: "a1594a87ba3826b5f6e3",
    secret: "e1a9be6cabfd312885b8",
    cluster: "mt1",
    useTLS: true
});

const app = express()
const port= process.env.PORT || 5000

//middlewares

app.use(express.json())
app.use(cors())


//DB config

let connectionUri;
connectionUri= 'mongodb+srv://mubashir:YjqtbobK0i3294LP@cluster0.hzaow.mongodb.net/my-whatsapp-?retryWrites=true&w=majority'
mongoose.connect(connectionUri,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db= mongoose.connection;
db.once('open',()=>{
    console.log('DB is connected')
    const msgCollection= db.collection('messages')
    const changeStream = msgCollection.watch()
    changeStream.on('change',(change)=>{
        console.log(change)
        if(change.operationType==='insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp:messageDetails.timestamp,
                received: messageDetails.received
            })
        }
        else {
            console.log('Error triggering Pusher')
        }
    })


})


// ????
//api routes

app.get('/',(req, res) =>{
res.status(200).send('hello')
} )

app.get('/messages/sync',((req, res) => {
    messages.find((err,data)=>{
        if (err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
}))

app.post('/messages/new',((req, res) => {
    const dbMessage= req.body
    messages.create(dbMessage,(err, data) =>{
      if(err){
          res.status(500).send(err)
      }
      else{
          res.status(201).send(data)
      }
    })
}))

//listen

app.listen(port , ()=> console.log(`Listening on localhost:${port}`))
