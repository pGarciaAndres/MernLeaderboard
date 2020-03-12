import  { Component } from 'react'

export default class LeaderboardUtils extends Component {
    initLeaderboard = (tournament) => {
        const filter = this.initFilter(tournament.active)
        return this.filterLeaderboard(tournament.active, filter, tournament.leaderboard, tournament.workouts)
    }

    initFilter = (tournamentActive) => {
        return {
            gender: tournamentActive ? "Men" : "All",
            age: "All",
            category: tournamentActive ? "Rx" : "All"
        }
    }
    
    filterLeaderboard = (active, filter, origin, workouts) => {
        let filteredLeaderboard = this.applyFilter(filter, origin)
        if (active) {
            const leaderboardUtils = new LeaderboardUtils()
            filteredLeaderboard = leaderboardUtils.calculateRanking(filteredLeaderboard, workouts)
        }
        return filteredLeaderboard
    }
    
    applyFilter = (filter, origin) => {
        return origin.filter(athlete => {
            return (
                (filter.gender === 'All' || athlete.gender === filter.gender) &&
                (filter.age === 'All' || athlete.age === filter.age) &&
                (filter.category === 'All' || filter.category === athlete.category)
            )
        })
    }

    calculateRanking = (filteredLeaderboard, workouts) => {
        if (filteredLeaderboard.length === 0) {
            return []
        } else {
            let wodTable = this.calculateWodTable(filteredLeaderboard, workouts)
            let leaderboardWithRating = filteredLeaderboard.map(athlete => {
                let athleteScoreTable = this.calculateScoreTable(athlete.id, wodTable)
                athlete.scoreTable = athleteScoreTable
                athlete.globalPoints = this.calculateGlobalPoints(athleteScoreTable)
                return athlete
            }).sort((athleteA, athleteB)=> athleteA.globalPoints - athleteB.globalPoints)
            return leaderboardWithRating
        }
    }
    
    calculateWodTable = (filteredLeaderboard, workouts) => {
        let wodTable = []
        if (workouts.length > 0) {
            let athleteScores = filteredLeaderboard.map(athlete => { return {id:athlete.id, scores:athlete.scores} })
            for (let i = 0; i < workouts.length; i++) {
                let workoutRow = {
                    wodId: workouts[i].id,
                    wodName: workouts[i].name,
                    scores: athleteScores.map(item => {
                        return {
                            athleteId: item.id, 
                            points: item.scores.find(score => score.id === workouts[i].id) ? 
                                        item.scores.find(score => score.id === workouts[i].id).points : '0'
                        }
                    }).sort((a,b) => {
                        if (a.points === '0') {
                            return 1
                        } else if (b.points === '0') {
                            return -1
                        } else {
                            return this.isScoreForTime(a,b) ? parseInt(a.points.replace(":","")) - parseInt(b.points.replace(":","")) : 
                                parseInt(b.points.replace(",","")) - parseInt(a.points.replace(",",""))
                        }
                    })
                }
                wodTable.push(workoutRow)
            }
        }
        return wodTable
    }
    
    isScoreForTime = (scoreA, scoreB) => {
        return scoreA.points.includes(':') && scoreB.points.includes(':')
    }
    
    calculateScoreTable = (athleteId, wodTable) => {
        return wodTable.map(wod => {
            return { 
                wodId: wod.wodId,
                wodName: wod.wodName, 
                reps: this.getNumberOfReps(athleteId, wod.scores),
                wodRanking: this.getWodRanking(athleteId, wod.scores)
            }
        })
    }
    
    getNumberOfReps = (athleteId, wodScores) => {
        let score = this.getAthleteWodScore(athleteId, wodScores)
        if (score && score.points !== "0") {
          if (score.points.includes(':')) {
            return `(${score.points})`
          } else if (score.points.includes('.') || score.points.includes(',')) {
            return `(${score.points} kg)`
          } else {
            return `(${score.points} reps)`
          }
        } else {
          return "0"
        }
    }
    
    getWodRanking = (athleteId, wodScores) => {
        let score = this.getAthleteWodScore(athleteId, wodScores)
        if (score && score.points !== "0") {
            return wodScores.indexOf(wodScores.find(score => score.athleteId === athleteId))+1
        } else if (score && wodScores.some(score => score.points !== "0")) {
            return wodScores.indexOf(wodScores.find(score => score.points === "0"))+1
        } else {
          return null
        }
    }
    
    getAthleteWodScore = (athleteId, wodScores) => {
        return wodScores.find(score => score.athleteId === athleteId)
    }
    
    calculateGlobalPoints = (athleteScoreTable) => {
        return athleteScoreTable.reduce((a, b) => a + (b['wodRanking'] || 0), 0)
    }

    disableAddAthlete = (tournament, currentNumParticipants) => {
        return (
            !tournament ||
            tournament.participants === currentNumParticipants
        )
    }
}
