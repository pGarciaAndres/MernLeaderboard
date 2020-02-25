const mongoose = require('mongoose');
const { Schema } = mongoose;

const TournamentsSchema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    active: { type: Boolean, required: true },
    workouts: { type: Array, required: true },
    participants: { type: Number, required: false },
    leaderboard: { type: Array, required: true }
})

module.exports = mongoose.model('Tournaments', TournamentsSchema);