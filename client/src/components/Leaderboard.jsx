import React, { Component, Fragment } from 'react'
import AthleteRowWrapper from './AthleteRowWrapper';
import Controls from './Controls';
import AthleteRowHeader from './AthleteRowHeader';
import noPhotoMale from '../images/noPhotoMale.jpg'
import noPhotoFemale from '../images/noPhotoFemale.jpg'
import LeaderboardUtils from './LeaderboardUtils'

const utils = new LeaderboardUtils()
const noDataLabel = 'No data'

export default class Leaderboard extends Component {
    constructor(props) {
        super(props)
        
        if (this.props.tournament) {
            this.state = {
                active: this.props.tournament.active,
                leaderboard: utils.initLeaderboard(this.props.tournament),
                origin: this.props.tournament.leaderboard,
                workouts: this.props.tournament.workouts,
                filter: utils.initFilter(this.props.tournament.active)
            }
        } else {
            this.state = {
                active: false,
                leaderboard: [],
                origin: [],
                workouts: [],
                filter: utils.initFilter(false)
            }
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.tournament) {
            if (JSON.stringify(nextProps.tournament.leaderboard) !== JSON.stringify(prevState.origin)) {
                let newOrigin = nextProps.tournament.leaderboard
                let tournamentActive = nextProps.tournament.active
                let workouts = nextProps.tournament.workouts
                let filter = nextProps.resetFilter ? utils.initFilter(tournamentActive) : prevState.filter
                let newLeaderboard = utils.filterLeaderboard(tournamentActive, filter, newOrigin, workouts)
                return { active: tournamentActive, leaderboard: newLeaderboard, origin: newOrigin, filter }
            }       
            if (JSON.stringify(nextProps.tournament.workouts) !== JSON.stringify(prevState.workouts)) {
                let newWorkouts = nextProps.tournament.workouts
                return { workouts: newWorkouts }
            } 
            if (prevState.active !== nextProps.tournament.active) {
                const tournamentActive = nextProps.tournament.active
                let newOrigin = nextProps.tournament.leaderboard
                let filter = utils.initFilter(tournamentActive)
                let newLeaderboard = utils.filterLeaderboard(tournamentActive, filter, newOrigin, nextProps.tournament.workouts)
    
                return { active: tournamentActive, leaderboard: newLeaderboard, filter }
            }
            return {}
        } else {
            return {}
        }
     }

    handleFilter = (filter, active, workouts) => {
        let filteredLeaderboard = utils.filterLeaderboard(active, filter, this.state.origin, workouts)
        this.setState({ filter, leaderboard: filteredLeaderboard })
    }

    handleAddAthlete = (athlete) => {
        if (!this.state.origin.some(item => item.name === athlete.name)) {
            const newId = this.state.origin.reduce((value, current) => {
                if (current.id > value) return current.id
                else return value
            }, 0) + 1
            const photoProfileDefault = athlete.gender === 'Women' ? noPhotoFemale : noPhotoMale
            const newAthlete = {
                id: newId,
                photo: athlete.photo ? athlete.photo : photoProfileDefault,
                name: athlete.name,
                gender: !!athlete.gender ? athlete.gender : 'Men',
                age: !!athlete.age ? athlete.age : '(18-35)',
                category: athlete.category,
                from: athlete.from,
                scores: []
            }
            const newLeaderboard = [...this.state.origin, newAthlete]
            this.props.handleUpdateTournament(newLeaderboard)
        }
    }

    handleRemoveAthlete = (athlete) => {
        const copyLeaderboard = [...this.state.origin]
        const newLeaderboard = copyLeaderboard.filter(index => index.id !== athlete.id)
        this.props.handleUpdateTournament(newLeaderboard)
    }

    handleConfirmReps = (athleteId, newWodReps) => {
        let copyLeaderboard = [...this.state.origin]
        const index = copyLeaderboard.indexOf(copyLeaderboard.find(athlete => athlete.id === athleteId))
        if (index >= 0) {
            copyLeaderboard[index].scores.push(newWodReps)
            this.props.handleUpdateTournament(copyLeaderboard)
        }
    }

    startCompetition = () => {
        const active = true
        this.props.handleUpdateTournament(null, active)
    }
    
    render() {
        const title = this.props.tournament ? this.props.tournament.name : this.props.tournament === null ? noDataLabel : ''
        return (
            <Fragment>
                <Controls 
                    title={title}
                    active={this.state.active} 
                    filter={this.state.filter}
                    handleFilter={this.handleFilter}
                    handleAddAthlete={this.handleAddAthlete} 
                    startCompetition={this.startCompetition}
                    admin={this.props.admin} 
                    workouts={this.state.workouts}
                    disableAddAthlete={utils.disableAddAthlete(this.props.tournament, this.state.leaderboard.length)}
                />

                {this.state.active && <AthleteRowHeader workouts={this.state.workouts} />}
                {this.state.leaderboard && <AthleteRowWrapper 
                    admin={this.props.admin} 
                    active={this.state.active}
                    leaderboard={this.state.leaderboard} 
                    handleRemoveAthlete={this.handleRemoveAthlete} 
                    handleConfirmReps={this.handleConfirmReps}
                />}
            </Fragment>
        )
    }
}
