import express from 'express';
import session from 'express-session';
import path from 'path';
import url from 'url';
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

app.listen(process.env.PORT || 3000);
