const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(expressSession);
const ioRedis = require('socket.io-redis');
const debug = require('debug')('chatbot:server');
const http = require('http');
const sticky = require('sticky-session');
const flash = require('connect-flash');
const client = redis.createClient();
const port = 3000;



const User = require('./models/user');
const Channel = require('./models/channel');
const Emotion = require('./models/emotion');
const Message = require('./models/message');


const index = require('./routes/index');
const auth = require('./routes/auth/auth');
const member = require('./routes/member/member');
const channel = require('./routes/channel/channel');
const message = require('./routes/message/message');
const emotion = require('./routes/emotion/emotion');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);


const mongoDB = 'mongodb://127.0.0.1:27017/slack';
mongoose.connect(mongoDB, {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(expressSession({
    secret: 'LavieEstBelle',
    store: new redisStore({host: 'localhost', port: 6379, client: client, ttl: 260}),
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/member', member);
app.use('/channel', channel);
app.use('/message', message);
app.use('/emotion', emotion);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.set('port', port);

io.adapter(ioRedis({host: 'localhost', port: 6379}));

app.set('socketio', io);

sticky.listen(server, port, function () {
    console.log('Server started listening on port : ' + port);
});
server.listen(port);

io.on('connection', socket => {
    socket.emit("HELLO", { hello: 'world' });
});
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


module.exports = app;
