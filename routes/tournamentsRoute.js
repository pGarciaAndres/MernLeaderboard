const express = require('express')
const router = express.Router()

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

module.exports = router