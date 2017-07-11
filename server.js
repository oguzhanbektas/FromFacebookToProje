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
const sent = new ForSentMessage();

// Receive all incoming messages
server.post('/', (req, res, next) => {
    f.incoming(req, res, msg => {
        // Process messages
        f.txt(msg.sender, `Hey, you just said ${msg.message.text}`);
        sent.ToServer(msg);
    });
    return next();
});

// Subscribe
f.subscribe();

server.listen(PORT, () => console.log(`Vanilla running on port ${PORT}`));