import React, { Component } from 'react';
import Modal from 'react-modal';
import SidebarContent from './components/SidebarContent';
import Header from './components/Header';
import TitleBoard from './components/TitleBoard';
import Leaderboard from './components/Leaderboard';
import Controls from './components/Controls';
import { Sidebar, Segment } from 'semantic-ui-react';
import './App.scss';
// Services
import tournamentService from './services/tournamentService';

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
const createTournamentLabel = 'Create a new tournament'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false,
      admin: false,
      sidebar: false,
      tournaments: [],
      tournamentSelected: null
    }
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    })
  }

  componentDidMount() {
    this.getTournaments();    
  }

  getTournaments = async() => {
    let response = await tournamentService.getTournaments();
    this.setState({
      tournaments: response,
      tournamentSelected: response.length > 0 ? response[response.length-1] : null
    })
  }

  handleSidebar = (e) => {
    this.setState({ 
      sidebar: !this.state.sidebar
    })
  }

  handleLoginAdmin = () => {
    this.setState({ admin : true })
  }

  handleLogout = () => {
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

    if (newLeaderboard) tournamentSelected.leaderboard = newLeaderboard
    if (active) tournamentSelected.active = active
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
              handleLoginAdmin={this.handleLoginAdmin}
              handleLogout={this.handleLogout}
            />
            <TitleBoard />

            {this.state.tournamentSelected && 
            <Leaderboard tournament={this.state.tournamentSelected} 
              handleUpdateTournament={this.handleUpdateTournament}
              admin={this.state.admin} 
              resetFilter={this.state.resetFilter}/>}

            {!this.state.tournamentSelected &&
            <Controls 
              tournament={createTournamentLabel}
              active={false} 
              filter={null}
              handleAddAthlete={null} 
              startCompetition={null}
              admin={this.state.admin} />}
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