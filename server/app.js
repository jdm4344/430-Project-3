// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const redis = require('redis');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/kwikpost';

mongoose.connect(dbURL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log('Could not connect to database');
      throw err;
    }
  });

// ============ Old Version =================
// let redisURL = {
//   hostname: 'localhost',
//   port: 6379,
// };

// let redisPASS;

// if (process.env.REDISCLOUD_URL) {
//   redisURL = url.parse(process.env.REDISCLOUD_URL);
//   redisPASS = redisURL.auth.split(':')[1];
// }

// ============== New Version ==============
let redisURL;
let redisPASS;

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1].toString();
} else {
  redisURL = {
    hostname: 'localhost',
    port: 6379,
  };
}

const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  pass: redisPASS,
  no_ready_check: true,
});

redisClient.auth(redisPASS, (err) => {
  if (err) console.log(err);
});
// =========================================

// pull in routes
const router = require('./router.js');

const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  // store: new RedisStore({
  //   host: redisURL.hostname,
  //   port: redisURL.port,
  //   pass: redisPASS,
  // }),
  store: new RedisStore({ client: redisClient }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

// csrf must come AFTER app.use(cookieParser());
// and app.use(session({...})); should come BEFORE the router
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
