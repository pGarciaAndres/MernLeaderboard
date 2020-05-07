const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Tournament = require('../models/Tournaments');

router.get('/api/getTournaments', (req, res) => {
    Tournament.find().then((tournaments) => {
        res.status(200).send(tournaments);
    }).catch((err) => {
        res.status(500).json({ success: false, msg: `Get: ${err}` });
    });
});

router.put('/api/updateTournament/:id', (req, res) => {
    Tournament.findOneAndUpdate({id: req.params.id}, req.body).then(() => {
        res.status(201).json({ success: true });
    }).catch((err) => {
        res.status(500).json({ success: false, msg: `Update: ${err}` });
    });
});

router.post('/api/createTournament', (req, res) => {
    Tournament.create(req.body).then(() => {
        res.status(201).json({ success: true });
    }).catch((err) => {
        res.status(500).json({ success: false, msg: `Create: ${err}` });
    });
});

router.post('/api/deleteTournament/:id', (req, res) => {
    Tournament.findOneAndDelete({id: req.params.id}).then(() => {
        res.status(201).json({ success: true });
    }).catch((err) => {
        res.status(500).json({ success: false, msg: `Delete: ${err}` });
    });
});

router.post('/api/connectDatabase/:id', (req, res) => {
    mongoose.Promise = global.Promise;
    if (req.params.id === 'LOCALHOST') {
        mongoose.connect(`mongodb://localhost:27017/boxzonazero`, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
    }
    if (req.params.id === 'ZONAZERO') {
        mongoose.connect(`mongodb+srv://mern-leaderboard:crosssfit@tournaments-edn5q.mongodb.net/boxzonazero?retryWrites=true&w=majority`, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
    }
    if (req.params.id === 'QUBOX') {
        mongoose.connect(`mongodb+srv://mern-leaderboard:crosssfit@tournaments-edn5q.mongodb.net/qubox?retryWrites=true&w=majority`, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
    }
    console.log(`🐵 ==> MONGO DATABASE connected to ${req.params.id}`);
    res.status(201).json({ success: true });
});

router.get('/api/disconnectDatabase', (req, res) => {
    mongoose.Promise = global.Promise;
    mongoose.disconnect();
    res.status(201).json({ success: true });
});

module.exports = router