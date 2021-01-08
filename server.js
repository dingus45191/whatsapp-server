// importing

import express from 'express'
import mongoose from 'mongoose'
import Messages from './MessagesDB'
import * as Process from "process";

//app config

const app = express()
const port= process.env.PORT || 5000

//middlewares

//DB config

mongoose.connect('mongodb+srv://mubashir:Smartguy1@cluster0.hzaow.mongodb.net/my-whatsapp-?retryWrites=true&w=majority',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// ????

//api routes

app.get('/',(req, res) =>{
res.status(200).send('hello')
} )

app.post('/api/v1/messages/new',((req, res) => {
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
