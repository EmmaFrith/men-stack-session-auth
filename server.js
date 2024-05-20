const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();


const session = require('express-session');

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');


const authController = require('./controllers/auth.js');


const port = process.env.PORT ? process.env.PORT : 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`connected to mongoDB' ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
    session({
        secret: process.env.SESSION_SECRET, 
        resave: false, 
        saveUninitialized: true,
})
);


app.use('/auth', authController);


app.get('/', async (req, res) => {
res.render('index.ejs', { user: req.session.user });
});

app.get('/vip-lounge', (req, res) => {
    if(req.session.user) {
        res.send(`Welcome to the VIP lounge ${req.session.user.username}`);
    } else {
        res.send('No guests allowed');
    }

});

app.listen(port, () => {
    console.log(`Express app is ready on port ${port}!`)
})


