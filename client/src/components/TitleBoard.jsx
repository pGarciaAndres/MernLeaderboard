import React, { Component } from 'react'

export default class TitleBoard extends Component {
  constructor(props) {
    super(props)

    this.title = "LEADERBOARD"
  }

  render() {
    return (
      <div className="titleboard">
        <p>{this.title}</p>
      </div>
    )
  }
}
