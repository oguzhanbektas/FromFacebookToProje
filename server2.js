const Restify = require('restify');
const server2 = Restify.createServer({
    name: 'ToServer'
});
const PORT = process.env.PORT || 3001;
class To3001From3000 {
    To3000(request) {
        if (request) {
            //  console.log("Class içi Request Text->" + JSON.stringify(request));
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var tip = {
                "sender": request.sender,
                "timeOfMessage": request.timeOfMessage,
                "message": request.message.text,
                "Content-Type": "application/json"
            }
            var args = {
                data: request,
                headers: tip,
                requestConfig: {
                    timeout: 1000, //request timeout in milliseconds
                    noDelay: true, //Enable/disable the Nagle algorithm
                    keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
                    keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent
                },
                responseConfig: {
                    timeout: 1000 //response timeout
                }
            };
            console.log("To3000 args -->" + JSON.stringify(args));
            var req = client.post("http://localhost:3000/ToFacebook", args, function (data, response) {
                console.log("ToFacebook 3000 e" + JSON.stringify(data));
            });
            req.on('requestTimeout', function (req) {
                console.log('request has expired');
                req.abort();
            });
            req.on('responseTimeout', function (res) {
                console.log('response has expired');
            });
            req.on('error', function (err) {
                console.log('request error', err);
            });
        }
    }
}
const send = new To3001From3000();

server2.use(Restify.jsonp());
server2.use(Restify.bodyParser());

server2.post('/', (req, res, next) => {
    console.log("Facebook id: " + req.body.sender + " Mesaj : " + req.body.message.text + " TimeOfMessage :" + req.body.timeOfMessage);
    res.send("Successful");
    return next();
});

server2.post('/ToFacebook', (req, res, next) => {
    var msgObj = {
        "sender": req.body.sender,
        "timeOfMessage": req.body.timeOfMessage,
        "message": req.body.message,
        "Content-Type": "application/json"
    };
    // console.log("ToFacebook req.body-->"+JSON.stringify(msgObj));
    // var deneme="id:"+req.body.sender+"Message:"+req.body.message.text;
    send.To3000(msgObj);
    return next();
});


server2.listen(PORT, () => console.log(`server2 running on port ${PORT}`));