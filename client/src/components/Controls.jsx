import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react';
import AddAthleteForm from './AddAthleteForm';
import FilterForm from './FilterForm';
import Modal from 'react-modal';

const yesLabel = 'YES'
const startModalText = "Once the competition starts you can't edit or include more participants, do you want to start?";
const finishModalText = "Are you sure you want to finish this competition permanently?";

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
    return (this.props.title === 'No data' || this.props.currentNumParticipants === 0)
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
              onClick={this.openModalFinish}>
              <Icon className="large winner icon"/>
            </Button>}

          {this.props.active && 
          <Button icon active={this.state.openFilter} className="controlButton marginRight" onClick={() => this.setState({openFilter: !this.state.openFilter})}>
            <Icon className="large sort amount down icon"/>
          </Button>}
        </div>

        {this.state.creatingAthlete && <AddAthleteForm handleAddAthlete={this.handleAddAthlete}/>}

        {this.state.openFilter && <FilterForm filter={this.props.filter} active={this.props.active} handleFilter={this.handleFilter}/>}

        <Modal isOpen={this.state.modalStartIsOpen}
          onRequestClose={this.closeModalStart}
          overlayClassName="customModal start">
            <Button className="closeButton" onClick={this.closeModalStart}>x</Button>
            <p>{startModalText}</p>
            <Button
              className="modalButton"
              onClick={this.startCompetition}>
                {yesLabel}
            </Button>
        </Modal>

        <Modal isOpen={this.state.modalFinishIsOpen}
          onRequestClose={this.closeModalFinish}
          overlayClassName="customModal finish">
            <Button className="closeButton" onClick={this.closeModalFinish}>x</Button>
            <p>{finishModalText}</p>
            <Button
              className="modalButton"
              onClick={this.finishCompetition}>
                {yesLabel}
            </Button>
        </Modal>
      </React.Fragment>
    )
  }
}
