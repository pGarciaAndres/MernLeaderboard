import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react';

export default class AthleteRowHeader extends Component {
    render() {
        return (
            <div className='athleteRowHeader'>
                <div className='headerLeft'>
                    <span className='rank'>RANK</span>
                    <span className='athletes'>ATHLETES</span>
                </div>
                
                <Segment.Group className='headerRight' horizontal>
                    <Segment>POINTS</Segment>
                    {this.props.workouts && this.props.workouts.map(wod => 
                        <Segment key={wod.id}>{wod.name}</Segment>
                    )}
                </Segment.Group>
            </div>
        )
    }
}
