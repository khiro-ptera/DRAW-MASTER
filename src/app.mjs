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

app.use(session(sessionOptions));

app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: false}));

const fPath = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(fPath, 'public')));


const Storage = mongoose.model('Storage');
const Display = mongoose.model('Display');

// MIDDLEWARE
// require authenticated user
app.use(auth.authRequired(['/edit-display']));

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



app.listen(process.env.PORT || 3000);
