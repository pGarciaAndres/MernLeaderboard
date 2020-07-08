import React, { Component } from 'react'
import locale from '../locale/es.json'

export default class TitleBoard extends Component {
  constructor(props) {
    super(props)

    this.title = locale.titleBoardLabel
  }

  render() {
    return (
      <div className="titleboard">
        <p>{this.title}</p>
      </div>
    )
  }
}
