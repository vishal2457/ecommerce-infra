var log4js = require("log4js");
var express = require("express");
var path = require("path");
var helmet = require("helmet");
var db = require("./models");
var cors = require("cors");
var compression = require("compression");
var app = express();
const httpServer = require("http").createServer(app);
var io = require("socket.io")(httpServer);
var jwt = require("jsonwebtoken");
var config = require("config");
const Socket = require("./Socket");
const { redisClient, setInRedis } = require("./Redis");
let sockets = new Map();
let socketInstance = {}




redisClient.on('connect', ()=>{
  redisClient.flushdb( function (err, succeeded) {
    console.log(`redis db flushed`); // will be true if successfull
    console.log('redis connected');
});
    console.log('redis connected');

  });

redisClient.on("error", function(error) {
  console.error(error);
});




/**
 * ? Application stack Sequelize, Node, Mysql, FrontEnd(React, Next)
 * ! vishal.proses@gmail.com (developer)
 */

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

/**
 * * Database connection
 */
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database Authenticated");
  })
  .catch((err) => {
    logger.error("Database authentication error", err);
    console.log(err, "this is error");
  });

/**
 * * Running this script will sync models to db
 * ! .sync({force: true}), WILL SYNC EXISTING MODELS CHANGES BUT WILL DELETE ALL DATA
 */
  // db.sequelize
  //   .sync()
  //   .then(() => {
  //     console.log("Database Synced with models");
  //   })
  //   .catch((err) => {
  //     logger.error("Database sync error", err);
  //     console.log(err, "this is error");
  //   });



app.use(cors())
.use(helmet())
.use(compression())
// .use(log4js.connectLogger(log4js.getLogger("http"), { level: "auto" }))
.use(express.json({limit: '50mb'}))
.use(express.urlencoded({limit: '50mb', extended: true}))
.use(
  helmet.frameguard({
    action: "deny",
  })
);

app.use("/static", express.static(path.join(__dirname, "public")));

const isValid = (token) => {
  //  console.log(token, "thsis token");
  if (!token) return false;
  return jwt.verify(token, config.get("jwtSecret"), function (err, decoded) {
    if (err) return false;

    return decoded.user;
  });
};

  // middleware to autenticate client with jwt
//25-12-2020 vishal acharya
io.use(async(socket, next) => {
  let token = socket.handshake.query.auth;
  let user = isValid(token);
  if (user) {
    let userID = user.id.toString();
    await setInRedis(userID, socket.id);
    socketInstance[userID] = socket;
    sockets.set(userID, socket.id);
    return next();
  }
  return next(new Error("authentication error"));
});

const authenticated = (socket) => {
  //sending client the authentication status
  socket.emit("authenticated", true);
};

   
//socket connection after authentication
//25-12-2020 vishal acharya
io.on("connection", (socket) => {
  authenticated(socket);
  Socket(socket, socketInstance);
  socket.on("disconnect", () => {
    let user = socket.handshake.query.user;
    if(user){
    let userID = JSON.parse(user).id.toString();
    //console.log(userID, "user disconnected");
    sockets.delete(userID);
    }
   // console.log(sockets);
    console.log('disconnect');
  });
});


//app.use(limiter);
app.all("/*", function (req, res, next) {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With, x-token"
    );
    res.end();
    return false;
  }
  res.header("Access-Control-Expose-Headers", "x-token");

  next();
});




let today = new Date();
let name =
  "paperbird_" +
  today.getDate() +
  "-" +
  parseInt(today.getMonth() + 1) +
  "-" +
  today.getFullYear() +
  ".log";
const file = `./logs/${name}`;
log4js.configure({
  appenders: {
    console: { type: "console" },
    file: { type: "file", filename: file },
  },
  categories: {
    Paperbird: { appenders: ["file"], level: "info" },
    default: { appenders: ["console"], level: "info" },
  },
});
var logger = log4js.getLogger("Paperbird");



app.use(function (request, response, next) {
  //console.log(request.body, "this is body");
  request.io = io;
  request.sockets = sockets
  request.logger = logger;
  response.setHeader("x-token", "vishal");

  //  request.redis = redisClient;
  next();
});

//require all application routes
require('./routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render("error");
});


// error handler
app.use(function (err, req, res, next) {
  // console.log(err, "this is error");
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  logger.error("Something went wrong:", err);
  // res.status(err.status || 500);
  res.render("error");
});
//
// const options = {
//   key: fs.readFileSync('http://orientcounsellingtool.cipla.com/opt/privateKey.key'),
//   cert: fs.readFileSync('http://orientcounsellingtool.cipla.com/opt/CRT')
// };


let port = 5000


httpServer.listen(port, () => console.log(`Magic happens at port ${port}`) );

//module.exports = app;
