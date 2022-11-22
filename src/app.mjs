import './db.mjs';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import path from 'path';
import url from 'url';
import * as auth from './auth.mjs';

const app = express();

var sessionOptions = {
	secret: 'sec',
	resave: true,
	saveUninitialized: true
};

const fPath = path.dirname(url.fileURLToPath(import.meta.url));

app.use(session(sessionOptions));

app.set('view engine', 'hbs');
app.set('views', path.join(fPath, 'views'));

app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(fPath, 'public')));


const Storage = mongoose.model('Storage');
const Display = mongoose.model('Display');
const Card = mongoose.model('Card');

const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};
const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username/password is too short"};

// MIDDLEWARE
// require authenticated user
app.use(auth.authRequired(['/edit-display'], ['/manage-storages'], ['/editview-storage']));

// make {{user}} variable available for all paths
app.use((req, res, next) => {
	res.locals.user = req.session.user;
	next();
});

// log
app.use((req, res, next) => {
	console.log(req.method, req.path, req.body);
	next();
});

// ROUTE HANDLERS 
app.get('/', (req, res) => {
	res.render('index');
});

app.post('/', (req, res) => {
	res.render('index');
});

app.get('/display', (req, res) => {
	res.render('display');
});

app.get('/manage-storages', (req, res) => {
  const user = req.session.user;
  if (user == null) {
    res.redirect('/login');
  } else {
	  Storage.find({user:user._id}).sort('-createdAt').exec((err, storages) => {
      res.render('manage-storages', {user: req.session.user, home: true, storages: storages});
    });
    // res.render('manage-storages');
  }
});

app.post('/manage-storages', (req, res) => {
  const user = req.session.user;
  // console.log(user);
  if (user == null) {
    res.redirect('/login');
  } else {
    const st = new Storage({user:user._id, name:req.body.name, type:req.body.type, items:[]});
    st.save((err) => {
      if (err) {
        res.render('error', {message: 'Error saving storage'}); 
      } else {
        res.redirect('/manage-storages');
      }
    });
  }
});

app.get('/manage-storages/:slug', (req, res) => {const user = req.session.user;
  if (user == null) {
    res.redirect('/login');
  } else {
    Storage.findOne({slug:req.params.slug}).populate('user').exec(function(err, storage) {
      console.log(storage.items);
      res.render('storage-detail', {user: req.session.user, storage: storage, cards: storage.items});
    });
  }
});

app.post('/manage-storages/:slug', (req, res) => {
  const user = req.session.user;
  if (user == null) {
    res.redirect('/login');
  } else {
    const c = {name:req.body.name}
    Storage.findOne({slug:req.params.slug}).populate('user').exec(function(err, storage) {
      console.log(storage.items);
      storage.items.push(c);
      storage.save();
      res.render('storage-detail', {user: req.session.user, storage: storage, cards: storage.items});
    });
  }
  /*const c = new Card({user:user._id, name:req.body.name});
  c.save((err) => {
    if (err) {
      res.render('error', {message: 'Error saving card'}); 
    } else {
      const st = Storage.findOne({slug:req.params.slug});
      st.items.push(c);
      st.populate('user').exec(function(err, storage) {
        res.render('storage-detail', {user: req.session.user, storage: storage, cards: storage.items});
      });
    }
  });*/
  /*let c = {name:req.body.name}
  const st = Storage.findOne({slug:req.params.slug});
  console.log(st.items);
  st.items.push(c);
  st.populate('user').exec(function(err, storage) {
    res.render('storage-detail', {user: req.session.user, storage: storage, cards: storage.items});
  });*/
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
  // setup callbacks for register success and error
  function success(newUser) {
    auth.startAuthenticatedSession(req, newUser, (err) => {
        if (!err) {
            res.redirect('/');
        } else {
            res.render('error', {message: 'err authing???'}); 
        }
    });
  }

  function error(err) {
    res.render('register', {message: registrationMessages[err.message] ?? 'Registration error'}); 
  }

  // attempt to register new user
  auth.register(req.body.username, req.body.email, req.body.password, error, success);
});
        

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
  // setup callbacks for login success and error
  function success(user) {
    auth.startAuthenticatedSession(req, user, (err) => {
      if(!err) {
        res.redirect('/'); 
      } else {
        res.render('error', {message: 'error starting auth sess: ' + err}); 
      }
    }); 
  }

  function error(err) {
    res.render('login', {message: loginMessages[err.message] || 'Login unsuccessful'}); 
  }

  // attempt to login
  auth.login(req.body.username, req.body.password, error, success);
});

app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out');
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});



app.listen(process.env.PORT || 3000);
