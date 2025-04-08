require('dotenv').config(); // Load environment variables from .env file

//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const storeRoutes = require('./routes/storeRoutes');

//create app
const app = express();

// Configure app
const port = process.env.PORT || 3000; // Use Render's assigned port
app.set('view engine', 'ejs');

// MongoDB connection URI from environment variable
const mongUri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongUri)
    .then(() => {
        // Start server
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => console.log(err));


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