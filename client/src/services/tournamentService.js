import axios from 'axios';

export default {
    getTournaments: async() => {
        let res = await axios.get('http://localhost:5000/api/getTournaments');
        return res.data;
    },

    updateTournament: async (id, tournament) => {
        let res = await axios.put('http://localhost:5000/api/updateTournament/' + id, tournament);
        return res.data;
    },

    createTournament: async (tournament) => {
        let res = await axios.post('http://localhost:5000/api/createTournament/', tournament);
        return res.data;
    },

    deleteTournament: async (id) => {
        let res = await axios.post('http://localhost:5000/api/deleteTournament/' + id);
        return res.data;
    }
}