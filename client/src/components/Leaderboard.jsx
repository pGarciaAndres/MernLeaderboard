import React, { Component, Fragment } from 'react'
import AthleteRowWrapper from './AthleteRowWrapper'
import Controls from './Controls'
import AthleteRowHeader from './AthleteRowHeader'
import noPhotoMale from '../images/noPhotoMale.jpg'
import noPhotoFemale from '../images/noPhotoFemale.jpg'
import LeaderboardUtils from './LeaderboardUtils'
import locale from '../locale/es.json'

const utils = new LeaderboardUtils()
const boxSession = localStorage.getItem('leaderboard.database')
const noDataLabel = locale.noDataLabel
const initialValue = {
    active: false,
    leaderboard: [],
    origin: [],
    workouts: [],
    filter: utils.initFilter(false)
}

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
            this.state = initialValue
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.tournament) {
            if (JSON.stringify(nextProps.tournament.leaderboard) !== JSON.stringify(prevState.origin)) {
                let origin = nextProps.tournament.leaderboard
                let active = nextProps.tournament.active
                let workouts = nextProps.tournament.workouts
                let filter = nextProps.resetFilter ? utils.initFilter(active) : prevState.filter
                let leaderboard = utils.filterLeaderboard(active, filter, origin, workouts)
                return { active, leaderboard, origin, filter, workouts }
            }       
            if (JSON.stringify(nextProps.tournament.workouts) !== JSON.stringify(prevState.workouts)) {
                let origin = nextProps.tournament.leaderboard
                let active = nextProps.tournament.active
                let workouts = nextProps.tournament.workouts
                let filter = nextProps.resetFilter ? utils.initFilter(active) : prevState.filter
                let leaderboard = utils.filterLeaderboard(active, filter, origin, workouts)
                return { leaderboard, workouts }
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
            return initialValue;
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
                from: athlete.from ? athlete.from : boxSession,
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
            const athleteScoreId = copyLeaderboard[index].scores.findIndex(score => score.id === newWodReps.id)
            if (athleteScoreId === -1) {
                copyLeaderboard[index].scores.push(newWodReps)
            } else {
                copyLeaderboard[index].scores[athleteScoreId].points = newWodReps.points
            }
            this.props.handleUpdateTournament(copyLeaderboard)
        }
    }

    startCompetition = () => {
        const active = true
        this.props.handleUpdateTournament(null, active)
    }

    finishCompetition = () => {
        const active = false
        this.props.handleUpdateTournament(null, active) 
    }
    
    render() {
        const { tournament } = this.props
        const title = tournament ? tournament.name : tournament === null ? noDataLabel : ''
        const finished = tournament ? utils.isTournamentFinished(tournament.active, tournament.leaderboard) : false
        return (
            <Fragment>
                <Controls 
                    title={title}
                    active={this.state.active}
                    finished={finished}
                    filter={this.state.filter}
                    admin={this.props.admin}
                    workouts={this.state.workouts}
                    firstParticipant={this.state.origin[0]}
                    handleFilter={this.handleFilter}
                    handleAddAthlete={this.handleAddAthlete}
                    startCompetition={this.startCompetition}
                    finishCompetition={this.finishCompetition}
                    disableAddAthlete={utils.disableAddAthlete(tournament, this.state.leaderboard.length)}
                />

                {(this.state.active || finished ) && 
                    <AthleteRowHeader 
                    workouts={this.state.workouts} 
                    filter={this.state.filter}
                />}

                {this.state.leaderboard && 
                    <AthleteRowWrapper 
                    admin={this.props.admin} 
                    active={this.state.active}
                    finished={finished}
                    leaderboard={this.state.leaderboard} 
                    handleRemoveAthlete={this.handleRemoveAthlete} 
                    handleConfirmReps={this.handleConfirmReps}
                />}
            </Fragment>
        )
    }
}
