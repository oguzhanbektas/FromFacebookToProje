'use strict';
// create an API server
const Restify = require('restify');
const server = Restify.createServer({
    name: 'VanillaMessenger'
});
const PORT = process.env.PORT || 3000;

server.use(Restify.jsonp());
server.use(Restify.bodyParser());


// Tokens
const config = require('./config');

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config);


// Register the webhooks
server.get('/', (req, res, next) => {
    f.registerHook(req, res);
    return next();
});

const ForSentMessage = require('./ToSentProj');
const send = new ForSentMessage();

// Receive all incoming messages
server.post('/', (req, res, next) => {
    f.incoming(req, res, msg => {
        // Process messages
       // f.txt(msg.sender, `Hey, you just said ${msg.message.text}`);
        send.ToServer(msg);
    });
    return next();
});
server.post('/ToFacebook', (req, res, next) => {
    console.log("Gelen Veri" + JSON.stringify(req.body));
    console.log("id: " + req.body.sender + " text : " + req.body.message.text);
    var id = req.body.sender;
    var text = "Deneme-->"+req.body.message.text;
    let obj = {
        recipient: {
            id
        },
        message: {
            text
        }
    }
    f.sendMessage(obj);
    return next();
});


// Subscribe
f.subscribe();

server.listen(PORT, () => console.log(`Vanilla running on port ${PORT}`));