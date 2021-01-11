// importing

import express from 'express'
import mongoose from 'mongoose'
import Messages from './MessagesDB.js'

//app config

const app = express()
const port= process.env.PORT || 5000

//middlewares

app.use(express.json())

//DB config

let connectionUri;
connectionUri= 'mongodb+srv://mubashir:YjqtbobK0i3294LP@cluster0.hzaow.mongodb.net/my-whatsapp-?retryWrites=true&w=majority'
mongoose.connect(connectionUri,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// ????
//api routes

app.get('/',(req, res) =>{
res.status(200).send('hello')
} )

app.get('/messages/sync',((req, res) => {
    Messages.find((err,data)=>{
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
    Messages.create(dbMessage,(err, data) =>{
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
