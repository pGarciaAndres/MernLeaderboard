import React, { Component } from 'react'
import { Form, Button, Message } from 'semantic-ui-react';
const nameLabel = 'Insert name';
const participantsLabel = 'Limit of participants'
const createLabel = 'Create';
const maxTournaments = 2;

export default class addTournamentForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
          tournament : {
            name: '',
            participants: ''
          }
        }
    }

    handleChange = (e, { name, value }) => {
      let tournament = this.state.tournament
      tournament[name] = value
      this.setState({tournament})
    }

    disabledAddTournament = (tournament) => {
      return tournament.name.length === 0 || 
             parseInt(tournament.participants) === 0 ||
             this.limitOfTournaments()
    }

    limitOfTournaments = () => {
      return this.props.tournaments.length >= maxTournaments
    }
    
    addTournament = (event) => {
      document.getElementById('tName').value = ''
      document.getElementById('participants').value = ''
      let tournament = {name: '', participants: ''}
      this.setState({tournament})
      
      this.props.handleAddTournament(this.state.tournament)
    }

  render() {
    let tournament = this.state.tournament

    return (
      <Form error unstackable onSubmit={this.addTournament} className="tournamentForm">
        {/* Name */}
        <Form.Input 
        placeholder={nameLabel}
        name='name'
        id='tName'
        onChange={this.handleChange}
        autoComplete="off"
        maxLength={14}/>
        {/* Participants */}
        <Form.Input 
        placeholder={participantsLabel}
        type='number'
        min="5"
        step="5"
        name='participants'
        id='participants'
        onChange={this.handleChange}
        autoComplete="off"/>

        <Button type='submit' className='createButton' disabled={this.disabledAddTournament(tournament)}>{createLabel}</Button>
        {this.limitOfTournaments() &&
          <Message error
          header='Cannot create!'
          content='Maximum number of competition.' />
        }
      </Form>
    )
  }
}
