import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react';

export default class AthleteRowHeader extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            workouts: this.props.workouts
        }
      }
    
  componentDidUpdate(prevProps) {
    if (this.props.filter.wod !== prevProps.filter.wod) {
        const workouts = this.props.workouts.filter(workout => {
            return ((this.props.filter.wod === 'All' || workout.id === this.props.filter.wod)
            )
        })
        this.setState({ workouts })
    }
  }
  
    render() {
        return (
            <div className='athleteRowHeader'>
                <div className='headerLeft'>
                    <span className='rank'>RANK</span>
                    <span className='athletes'>ATHLETES</span>
                </div>
                
                <Segment.Group className='headerRight' horizontal>
                    <Segment>POINTS</Segment>
                    {this.state.workouts && this.state.workouts.map(wod => 
                        <Segment key={wod.id}>{wod.name}</Segment>
                    )}
                </Segment.Group>
            </div>
        )
    }
}
