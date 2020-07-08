import React, { Component } from 'react'
import { Form, Button, Message } from 'semantic-ui-react'
import locale from '../locale/es.json'

const maxTournaments = 5;

export default class AddTournamentForm extends Component {
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
        placeholder={locale.insertNameLabel}
        name='name'
        id='tName'
        onChange={this.handleChange}
        autoComplete="off"
        maxLength={14}/>
        {/* Participants */}
        <Form.Input 
        placeholder={locale.participantsLabel}
        type='number'
        min="5"
        step="5"
        name='participants'
        id='participants'
        onChange={this.handleChange}
        autoComplete="off"/>

        <Button type='submit' className='createButton' disabled={this.disabledAddTournament(tournament)}>{locale.createLabel}</Button>
        {this.limitOfTournaments() &&
          <Message error
          header={locale.createError}
          content={locale.maxNumError} />
        }
      </Form>
    )
  }
}
