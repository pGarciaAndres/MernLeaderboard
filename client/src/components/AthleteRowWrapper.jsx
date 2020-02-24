import React, { Component, Fragment } from 'react'
import AthleteRow from './AthleteRow';

export default class AthleteRowWrapper extends Component {
    render() {
        return (
            <Fragment>
                {this.props.leaderboard.map(athlete =>
                    <AthleteRow 
                        admin={this.props.admin} 
                        key={athlete.id} 
                        active={this.props.active} 
                        athlete={athlete} 
                        position={this.props.leaderboard.indexOf(athlete)+1}
                        handleRemoveAthlete={this.props.handleRemoveAthlete} 
                        handleConfirmReps={this.props.handleConfirmReps}
                    />
                )}
            </Fragment>
        )
    }
}
