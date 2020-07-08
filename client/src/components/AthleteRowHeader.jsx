import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import locale from '../locale/es.json'

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
            return ((this.props.filter.wod === 'All' || workout.id === this.props.filter.wod))
        })
        this.setState({ workouts })
    }
    if (this.props.workouts.length !== prevProps.workouts.length) {
        const workouts = this.props.workouts
        this.setState({ workouts })
    }
  }
  
    render() {
        return (
            <div className='athleteRowHeader'>
                <div className='headerLeft'>
                    <span className='rank'>{locale.rankingLabel}</span>
                    <span className='athletes'>{locale.athletesLabel}</span>
                </div>
                
                <Segment.Group className='headerRight' horizontal>
                    <Segment>{locale.pointsLabel}</Segment>
                    {this.state.workouts && this.state.workouts.map(wod => 
                        <Segment key={wod.id}>{wod.name}</Segment>
                    )}
                </Segment.Group>
            </div>
        )
    }
}
