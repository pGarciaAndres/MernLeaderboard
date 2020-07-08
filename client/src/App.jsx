import React, { Component } from 'react';
import Modal from 'react-modal';
import SidebarContent from './components/SidebarContent';
import Header from './components/Header';
import TitleBoard from './components/TitleBoard';
import Leaderboard from './components/Leaderboard';
import LeaderboardUtils from './components/LeaderboardUtils'
import mainLogo from './images/logo.png'
import { Sidebar, Segment, Input, Button } from 'semantic-ui-react';
import './App.scss';
import './Modal.scss';
import locale from './locale/es.json';
// Services
import tournamentService from './services/tournamentService';

const availbaleBox = ['QUBOX', 'ZONAZERO']
const STORAGE_LOGIN = 'leaderboard.login'
const STORAGE_DATABASE = 'leaderboard.database'
const utils = new LeaderboardUtils()
Modal.setAppElement('#root')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      admin: this.getLogin(),
      sidebar: false,
      tournaments: [],
      tournamentSelected: undefined,
      boxId: '',
      boxSession: this.getBoxSession(),
      error: false
    }
  }

  getLogin = () => {
    return localStorage.getItem(STORAGE_LOGIN) === "true"
  }

  setLogin = (value) => {
    localStorage.setItem(STORAGE_LOGIN, value)
  }

  componentDidMount() {
    if (availbaleBox.includes(this.state.boxSession)) {
      this.connectDatabase()
      this.getTournaments()
    }
  }

  connectDatabase = () => {
    tournamentService.connect(this.state.boxSession)
  }

  getTournaments = async() => {
    const response = await tournamentService.getTournaments()
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

  handleChangeBoxId = (e) => {
    this.setState({ boxId: e.target.value })
  }

  keyPressed = (event) => {
    if (event.key === "Enter") {
        this.enterBox()
    }
  }

  enterBox = () => {
    if (availbaleBox.includes(this.state.boxId.toUpperCase())) {
      localStorage.setItem(STORAGE_DATABASE, this.state.boxId.toUpperCase())
      const admin = false
      const boxSession = this.state.boxId.toUpperCase()
      const boxId = ''
      const error = false
      this.setState({ admin, boxId, boxSession, error })
      tournamentService.connect(boxSession).then((res) => {
        if (res.success === true) {
          this.getTournaments()
        }
      })
    } else {
      const boxId = ''
      const error = true
      this.setState({ boxId, error })
    }
  }
  
  getBoxSession = () => {
    return localStorage.getItem(STORAGE_DATABASE)
  }

  closeBoxSession = () => {
    localStorage.setItem(STORAGE_DATABASE, '')
    localStorage.setItem(STORAGE_LOGIN, false)
    tournamentService.disconnect().then((res) => {
      if (res.success === true) {
        this.setState({
          admin: null,
          boxSession: '',
          tournaments: [],
          tournamentSelected: undefined,
          sidebar: false
        })
      }
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
          closeBoxSession={this.closeBoxSession}
        />
        <Sidebar.Pusher>
          <div className={`App ${this.state.boxSession}`}>
            <Header admin={this.state.admin} 
              sidebar={this.state.sidebar} 
              handleSidebar={this.handleSidebar}
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              boxSession={this.state.boxSession}
            />
            <TitleBoard />

            <Leaderboard tournament={this.state.tournamentSelected} 
              handleUpdateTournament={this.handleUpdateTournament}
              admin={this.state.admin} 
              resetFilter={this.state.resetFilter}/>
          </div>

          <Modal isOpen={!availbaleBox.includes(this.state.boxSession)}
            overlayClassName="mainModal">
            <div className="mainModalContainer">
              <div className="mainModalLeft">
                <img  alt='' src={mainLogo}/>
              </div>
              <div className="mainModalRight">
                <p>{locale.mainModalText}</p>
                <Input value={this.state.boxId} placeholder='BOX ID' onChange={this.handleChangeBoxId} onKeyDown={this.keyPressed}/>
                <Button
                  className="modalButton"
                  onClick={this.enterBox}>
                    {locale.startLabel}
                </Button>
                {this.state.error && <p className='error'>{locale.mainModalError}</p>}
              </div>
            </div>
          </Modal>

        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default App;