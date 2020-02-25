import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react';
import AddAthleteForm from './AddAthleteForm';
import FilterForm from './FilterForm';

export default class Controls extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
        creatingAthlete: false,
        openFilter: false
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

  startCompetition = () => {
    this.closeForms()
    this.props.startCompetition()
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
    this.setState({creatingAthlete: false, openFilter: false})
  }

  noDataFound = () => {
    return (this.props.title === 'No data')
  }
    
  render() {
    return (
      <React.Fragment> 
        <div className="controls">
          <div className="tournament">{this.props.title}</div>
          {!this.props.active && 
          <React.Fragment>
            {/* Start (Admin) */}
            {this.props.admin && 
            <Button icon className="controlButton" 
              onClick={this.startCompetition}
              disabled={this.noDataFound()}>
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
            {this.props.admin && 
            <Button icon active={this.state.creatingAthlete} 
              className="controlButton" 
              onClick={() => this.setState({openFilter: false, creatingAthlete: !this.state.creatingAthlete})}
              disabled={this.props.disableAddAthlete}>
              <Icon className="large user plus icon"/>
            </Button>}
          </React.Fragment>}

          {this.props.active && 
          <Button icon active={this.state.openFilter} className="controlButton marginRight" onClick={() => this.setState({openFilter: !this.state.openFilter})}>
            <Icon className="large sort amount down icon"/>
          </Button>}
        </div>

        {this.state.creatingAthlete && <AddAthleteForm handleAddAthlete={this.handleAddAthlete}/>}

        {this.state.openFilter && <FilterForm filter={this.props.filter} active={this.props.active} handleFilter={this.handleFilter}/>}

      </React.Fragment>
    )
  }
}
