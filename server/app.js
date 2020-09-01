const express = require("express");
//const session = require("express-session");
const app = express();




const server = require("./server");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//const app = require("./app");
//var os = require( 'os' );

//var networkInterfaces = os.networkInterfaces( );

//console.log( networkInterfaces );


//const mongoStore = require('connect-mongo')(session);
//implement mongoStore later
//var cookieParser = require('cookie-parser');
//const csrf = require('csurf');
//const csrfProtection = csrf({ cookie: true });


const userRoutes = require('./api/routes/user');
const roomsRoutes = require('./api/routes/room');

//const invalidCsrfToken = require('./api/middleware/invalidCsrfToken');
//const attachCsrfToken = require('./api/middleware/attachCsrfToken');

//const for session 
//const {
//    PORT = 3000,
//    NODE_ENV = 'development',
//    SESS_NAME = 'sid',
//    SESS_SECRET = 'secret',
//    SESS_LIFETIME = 1000 * 60 * 60 * 2
//} = process.env;

//const IN_PROD = NODE_ENV == 'production';

mongoose.connect('mongodb://localhost/peopleTalk', {
    useCreateIndex: true,
    useNewUrlParser: true
});
//mongoose.connect('mongodb://localhost/rooms', {
//    useCreateIndex: true,
//    useNewUrlParser: true
//});
mongoose.Promise = global.Promise;


app.use(express.static(__dirname + '/userAvatar'));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, PATCH, DELETE");
        return res.status(200).json();
    }
    next();
    
});

//app.use(session({
//    name: SESS_NAME,
//    resave: false,
//    saveUninitialized: false,
//    secret: SESS_SECRET,
//    store: new mongoStore({ mongooseConnection: mongoose.connection }),
//    
//    cookie: {
//        maxAge: SESS_LIFETIME,
//        secure: IN_PROD,
//
//    }
//}));

app.use(function(req, res, next) {
    //res.locals.session = req.session;
  res.locals.io = req.io;
   next();
});

//app.use(csrfProtection);
//app.use(invalidCsrfToken);
//app.use(attachCsrfToken);
app.use("/rooms", roomsRoutes);
app.use("/user", userRoutes);


//server.getIO((io) => {
//    io.on('connection', (socket) => {
//        console.log('A user is connected.. ' +socket.id);
//    });
//});


//app.get('/getcsrftoken', function (req, res) {
//    return res.cookie('rememberme', req.csrfToken().toString, { httpOnly: true });
//});


app.get('/confirmation/:token', async (req, res) => {
    console.log(req.params.token);
    return res.redirect(`http://localhost:3000/user/userValid/${ req.params.token }`);
});

app.get("/", (req, res) => {
    //msg = req.csrfToken();
     //var io = server.getIO();
     //const path = require('path');
     //const serverPath = path.join(__dirname + "/server.js").toString();
     //console.log(__dirname);
     //io.on('connection', (socket) => {
     //    console.log("A user is connected...." +socket.id);
     //    socket.on('disconnect', () => {
     //        console.log("User is disconnected.." +socket.id);
     //    });
     //});
   msg = "this is it.";
    //res.status(200).redirect(`http://localhost:8080`);
   res.status(200).send({
      message: "Hello " + msg,
   });
});

app.use((req, res, next) => {
    //console.log("The Csurf token is : "+req.csrfToken());
    
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;