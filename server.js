const app = require('express')();
const http = require('http').createServer(app);
var mongoose = require('mongoose');
var bodyParser = require(`body-parser`);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

var dbUrl = "mongodb+srv://demo:demo@cluster0.0xmrt.mongodb.net/test";
mongoose.connect(dbUrl , (err) => { 
  console.log(`mongodb connected`,err);
})
var Message = mongoose.model(`Message`,{ name : String, message : String})

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    console.log('get messages', messages);
    io.emit('chat message', messages);
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('chat message', req.body);
    res.sendStatus(200);
  })
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('chat message', { message: 'Hello everyone', name:'server'});
  socket.on('chat message', (msg) => {
    console.log('message ', msg)
    socket.emit('chat message', msg);
  })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});
  
http.listen(3000, () => {
    console.log(`listening http on *:3000 http://localhost:3000`);
});