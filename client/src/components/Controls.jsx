import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import AddAthleteForm from './AddAthleteForm'
import FilterForm from './FilterForm'
import Modal from 'react-modal'
import locale from '../locale/es.json'

const boxSession = localStorage.getItem('leaderboard.database')

export default class Controls extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
        creatingAthlete: false,
        openFilter: false,
        modalStartIsOpen: false,
        modalFinishIsOpen: false
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.title !== prevProps.title) {
      this.closeForms()
    }
    if (this.props.admin !== prevProps.admin && this.props.admin === false) {
      this.closeForms()
    }
  }

  openModalStart = () => {
    this.setState({ modalStartIsOpen: true })
  }
  
  closeModalStart = () => {
    this.setState({ modalStartIsOpen: false })
  }
  
  openModalFinish = () => {
    this.setState({ modalFinishIsOpen: true })
  }
  
  closeModalFinish = () => {
    this.setState({ modalFinishIsOpen: false })
  }

  startCompetition = () => {
    this.closeForms()
    this.props.startCompetition()
  }

  finishCompetition = () => {
    this.closeForms()
    this.props.finishCompetition()
  }

  handleFilter = (filter) => {
    this.closeForms()
    this.props.handleFilter(filter, this.props.active, this.props.workouts)
  }

  handleAddAthlete = (athlete) => {
    this.closeForms()
    this.props.handleAddAthlete(athlete)
  }

  closeForms = () => {
    this.setState({creatingAthlete: false, openFilter: false, modalStartIsOpen: false, modalFinishIsOpen: false})
  }

  startDisabled = () => {
    return (this.props.title === 'No data' || this.props.firstParticipant === undefined)
  }

  finishDisabled = () => {
    return (!this.props.firstParticipant || this.props.firstParticipant.scores.length === 0 )
  }
    
  render() {
    return (
      <React.Fragment> 
        <div className="controls">
          <div className="tournament">{this.props.title}</div>
          {!this.props.active && 
          <React.Fragment>
            {/* Start (Admin) */}
            {this.props.admin && !this.props.finished &&
            <Button icon className="controlButton" 
              onClick={this.openModalStart}
              disabled={this.startDisabled()}>
              <Icon className="large sign-in icon"/>
            </Button>}
            {/* Filter */}
            <Button icon active={this.state.openFilter} 
              className={this.props.admin ? 'controlButton' : 'controlButton marginRight'}
              onClick={() => this.setState({creatingAthlete: false, openFilter: !this.state.openFilter})}
              disabled={!this.props.filter}>
              <Icon className="large sort amount down icon"/>
            </Button>
            {/* Create Athlete  (Admin) */}
            {this.props.admin && !this.props.finished &&
            <Button icon active={this.state.creatingAthlete} 
              className="controlButton" 
              onClick={() => this.setState({openFilter: false, creatingAthlete: !this.state.creatingAthlete})}
              disabled={this.props.disableAddAthlete}>
              <Icon className="large user plus icon"/>
            </Button>}
          </React.Fragment>}

          {/* Finish Competition (Admin) */}
          {this.props.active && this.props.admin &&
            <Button icon className="controlButton" 
              onClick={this.openModalFinish}
              disabled={this.finishDisabled()}>
              <Icon className="large winner icon"/>
            </Button>}

          {this.props.active && 
          <Button icon active={this.state.openFilter} className="controlButton marginRight" onClick={() => this.setState({openFilter: !this.state.openFilter})}>
            <Icon className="large sort amount down icon"/>
          </Button>}
        </div>

        {this.state.creatingAthlete && 
          <AddAthleteForm handleAddAthlete={this.handleAddAthlete}/>}

        {this.state.openFilter && 
          <FilterForm filter={this.props.filter} 
          active={this.props.active} 
          workouts={this.props.workouts} 
          handleFilter={this.handleFilter}/>}

        <Modal isOpen={this.state.modalStartIsOpen}
          onRequestClose={this.closeModalStart}
          overlayClassName={`customModal start ${boxSession}`}>
            <Button className="closeButton" onClick={this.closeModalStart}>x</Button>
            <p>{locale.startModalText}</p>
            <Button
              className="modalButton"
              onClick={this.startCompetition}>
                {locale.yesUpperLabel}
            </Button>
        </Modal>

        <Modal isOpen={this.state.modalFinishIsOpen}
          onRequestClose={this.closeModalFinish}
          overlayClassName={`customModal finish ${boxSession}`}>
            <Button className="closeButton" onClick={this.closeModalFinish}>x</Button>
            <p>{locale.finishModalText}</p>
            <Button
              className="modalButton"
              onClick={this.finishCompetition}>
                {locale.yesUpperLabel}
            </Button>
        </Modal>
      </React.Fragment>
    )
  }
}
