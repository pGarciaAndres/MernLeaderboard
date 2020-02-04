import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'

export default class DeleteButton extends Component {

  removeAthlete = () => {
    this.props.handleRemoveAthlete(this.props.athlete)
  }

  render() {
    return (
        <Button className="deleteButton" icon onClick={this.removeAthlete}>
          <Icon className="big trash alternate icon"/>
        </Button>
    )
  }
}
