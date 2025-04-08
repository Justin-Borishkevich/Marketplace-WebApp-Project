//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const storeRoutes = require('./routes/storeRoutes');
const { MongoClient } = require('mongodb');
const { getCollection } = require('./models/item');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
const mongUri = 'mongodb+srv://admin:admin1234$@cluster0.aj2fr.mongodb.net/Store?retryWrites=true&w=majority&appName=Cluster0';

//connect to Mongodb
mongoose.connect(mongUri)
.then(() => {
    //start server
    app.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    })
})
.catch(err=>console.log(err));


//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routs
app.get('/', (req, res) => {
    res.render('index');
})

app.use('/store', storeRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = 'Internal Server Error';
    }
    res.status(err.status);
    res.render('error', {error: err});
})