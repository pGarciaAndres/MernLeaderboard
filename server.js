const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());

// configure the app to use bodyParser()
app.use(bodyParser.json());

// Routes
const tournamentsRouter = require('./routes/tournamentsRoute');
app.use(tournamentsRouter);

// Database
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/boxzonazero`, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

// Redirect all the requests to our frontend application
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}`);
});