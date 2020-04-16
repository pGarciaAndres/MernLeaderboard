import React, { Component } from 'react';
import Modal from 'react-modal';
import SidebarContent from './components/SidebarContent';
import Header from './components/Header';
import TitleBoard from './components/TitleBoard';
import Leaderboard from './components/Leaderboard';
import LeaderboardUtils from './components/LeaderboardUtils'
import { Sidebar, Segment } from 'semantic-ui-react';
import './App.scss';
import './Modal.scss';
// Services
import tournamentService from './services/tournamentService';

const LOCAL_STORAGE_KEY = 'leaderboard.login'
const utils = new LeaderboardUtils()
const customStyles = {
  content : {
    top           : '0px',
    left          : '0px',
    right         : '0px',
    bottom        : '0px',
    borderRadius  : '0px'
  }
}
Modal.setAppElement('#root')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false,
      admin: this.getLogin(),
      sidebar: false,
      tournaments: [],
      tournamentSelected: undefined
    }
  }

  getLogin = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) === "true"
  }

  setLogin = (value) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, value)
  }

  componentDidMount() {
    this.getTournaments();    
  }

  getTournaments = async() => {
    const response = await tournamentService.getTournaments();
    const tournamentSelected = response.length > 0 ? response[response.length-1] : null
    this.setState({
      tournaments: response,
      tournamentSelected: tournamentSelected
    })
  }

  handleSidebar = (e) => {
    this.setState({ 
      sidebar: !this.state.sidebar
    })
  }

  handleLogin = () => {
    this.setLogin(true)
    this.setState({ admin : true })
  }

  handleLogout = () => {
    this.setLogin(false)
    this.setState({ admin : false })
  }

  handleOpenLeaderboard = (props) => {
    let newTournamentSelected = this.state.tournaments.find(t => t.id === props.index)
    this.setState({ 
      sidebar: false,
      tournamentSelected: newTournamentSelected,
      resetFilter: true
    })
  }

  handleUpdateTournament = (newLeaderboard, active, workouts, tournamentId) => {
    let tournamentSelected = workouts ?
      this.state.tournaments.find(t => t.id === tournamentId) :
      this.state.tournamentSelected

    if (newLeaderboard) tournamentSelected.leaderboard = utils.calculateRanking(newLeaderboard, tournamentSelected.workouts)
    if (active !== null && active !== undefined) tournamentSelected.active = active
    if (workouts) tournamentSelected.workouts = workouts

    tournamentService.updateTournament(tournamentSelected.id, tournamentSelected).then((res) => {
      if (res.success === true) {
        if (workouts) {
          this.getTournaments()
        } else {
          let resetFilter = active
          this.setState({ tournamentSelected, resetFilter })
        }
      }
    })
  }
    
  handleAddWod = (wod, tournamentId) => {
    const wodTournament = this.state.tournaments.find(t => t.id === tournamentId)
    const newId = this.getNextId(wodTournament.workouts)

    const newWod = {
      id: newId,
      name: wod.name,
      rx: wod.rx.split("\n").join("<br/>"),
      sc: wod.sc.split("\n").join("<br/>")
    }
    const newWorkouts = [...wodTournament.workouts, newWod]
    this.handleUpdateTournament(null, null, newWorkouts, tournamentId)
  }

  handleAddTournament = (tournament) => {
    const newId = this.getNextId(this.state.tournaments)
    const newTournament = {
      id: newId,
      name: tournament.name,
      active: false,
      workouts: [],
      participants: tournament.participants,
      leaderboard: []
    }
    const newTournaments = [...this.state.tournaments, newTournament]

    tournamentService.createTournament(newTournament).then((res) => {
      if (res.success === true) {
        this.setState({
          sidebar: false,
          tournaments: newTournaments,
          tournamentSelected: newTournament
        })
      }
    })
  }

  handleDeleteTournament = (props) => {
    tournamentService.deleteTournament(props.index).then((res) => {
      if (res.success === true) {
        this.getTournaments();
      }
    })
  }

  getNextId = (list) => {
    let newId = list.reduce((value, current) => {
      if (current.id > value) return current.id
      else return value
    }, 0) + 1
    return newId
  }
  
  closeModal = () => {
    this.setState({
      modalIsOpen: false
    })
  }
    
  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <SidebarContent admin={this.state.admin} 
          sidebar={this.state.sidebar} 
          tournaments={this.state.tournaments} 
          handleOpenLeaderboard={this.handleOpenLeaderboard}
          handleAddWod={this.handleAddWod}
          handleAddTournament={this.handleAddTournament}
          handleDeleteTournament={this.handleDeleteTournament}
        />
        <Sidebar.Pusher>
          <div className="App">
            <Header admin={this.state.admin} 
              sidebar={this.state.sidebar} 
              handleSidebar={this.handleSidebar}
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
            />
            <TitleBoard />

            <Leaderboard tournament={this.state.tournamentSelected} 
              handleUpdateTournament={this.handleUpdateTournament}
              admin={this.state.admin} 
              resetFilter={this.state.resetFilter}/>
          </div>

          <Modal isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal">
              <button onClick={this.closeModal}>close</button>
          </Modal>

        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default App;