class ToSentMessage {
    ToServer(request) {
        if (request) {
            //   console.log("Request Text->" + request.message.text);
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
            //  console.log("ToSentProje args --> "+JSON.stringify(args.data));
            var req = client.post("http://localhost:3001/", args, function (data, response) {
                //    console.log("ToSentProje data --> "+JSON.stringify(data));
                if (data == "Successful") console.log("Veri gönderildi");
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
module.exports = ToSentMessage;