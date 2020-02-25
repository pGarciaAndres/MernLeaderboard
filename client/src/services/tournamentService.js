import axios from 'axios';

export default {
    getTournaments: async() => {
        let res = await axios.get('/api/getTournaments');
        return res.data;
    },

    updateTournament: async (id, tournament) => {
        let res = await axios.put('/api/updateTournament/' + id, tournament);
        return res.data;
    },

    createTournament: async (tournament) => {
        let res = await axios.post('/api/createTournament/', tournament);
        return res.data;
    },

    deleteTournament: async (id) => {
        let res = await axios.post('/api/deleteTournament/' + id);
        return res.data;
    }
}