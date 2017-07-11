const Restify = require('restify');
const server2 = Restify.createServer({
    name: 'ToServer'
});
const PORT = process.env.PORT || 3001;

server2.use(Restify.jsonp());
server2.use(Restify.bodyParser());

server2.post('/', (req, res, next) => {
    console.log("Facebook id: "+req.body.sender+" Mesaj : "+req.body.message.text+" TimeOfMessage :"+ req.body.timeOfMessage);
    res.send("Successful");
    return next();
});
server2.listen(PORT, () => console.log(`deneme running on port ${PORT}`));