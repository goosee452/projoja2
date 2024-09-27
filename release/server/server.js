const express = require('express');
const cors = require('cors');
let session = require('express-session');
let WebSocket = require('ws') 
const options = {
    origin: 'http://localhost:5173',
    credentials: true
}
const MemoryStore = require('memorystore')(session);

const app = express();
const port = 2007;
app.use(cors(options));
let sessionParser = session({
    secret: 'oooohh_seeecret7664r42gw88',
    saveUninitialized: true,
    resave: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie:{
        maxAge: 36000000
    }
}
)
app.use(sessionParser);

let wss = new WebSocket.WebSocketServer({port: 2008});

wss.on('connection', (ws, req) => {
    sessionParser(req, {}, function () {
        //console.log(req.session);
        ws.on('error', console.error);
        ws.on('open', () => {
            console.log("AAAAAAAAAAAAAAA");
            ws.send('HELL YEAH');
        })
        ws.on('message', (data) => {
            
            let d = data + '';
            req.session.count = req.session.count == undefined ? 0: req.session.count + 1;
            req.session.planetData = JSON.parse(data);
            //console.log(req.sessionID);
            req.session.save((err)=>{
                //console.log(req.session.id);
                ws.send(JSON.stringify(req.session.planetData));
            })
        })
        ws.send(JSON.stringify({
            msgType: 'connection',
            planetData: req.session.planetData,
        }));
    }
    );
});

app.get('/api', (req, res)=>{
    console.log('Route req')
    if(typeof req.session.count == NaN){
        req.session.count = 0;
    }
    req.session.count += 1;
    //console.log(req.session);
    res.send('whatever');
})

app.get('/check', (req, res)=>{
    req.session.planetData;
    res.send(JSON.stringify(req.session.planetData) + ' ' + JSON.stringify(req.session.id));
})

app.get('/connectToSession', (req, res)=>{
    if(isNaN(req.session.count)){
        req.session.count = 0;
    }
    req.session.id;
    req.session.count += 1;
    if(typeof req.session.planetData == 'undefined'){
        req.session.planetData = [];
    }
    req.session.save((err)=>{
        console.log(err);
        //ws.send(JSON.stringify(req.session.planetData));
    })
    
    res.send(req.session.id + ' ' + req.session.count);
})

app.listen(port, ()=>{
    console.log(`Server running on port = ${port}`)
})