import React, { Component } from 'react'
import { Accordion, Form, Button } from 'semantic-ui-react';
const nameLabel = 'Insert name';
const rxLabel = 'Rx';
const rxTextLabel = 'Describe RX routine...';
const scLabel = 'Scaled';
const scTextLabel = 'Describe Scaled routine...' ;
const submitLabel = 'Save';

export default class AddWodForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
          wod : {
            name: '',
            rx: '',
            sc: ''
          }
        }
    }

    handleChange = (e, { name, value }) => {
      let wod = this.state.wod
      wod[name] = value
      this.setState({wod})
    }

    disabledCreateWod = (wod) => {
      return wod.name.length === 0 || wod.rx.length === 0 || wod.sc.length === 0
    }
    
    addWod = (event) => {
      this.props.handleAddWod(this.state.wod, this.props.tournamentId)
      document.getElementsByName('name')[0].value = ''
      document.getElementsByName('rx')[0].value = ''
      document.getElementsByName('sc')[0].value = ''
      let wod = {name: '', rx: '', sc: ''}
      this.setState({wod})
    }

  render() {
    let wod = this.state.wod

    return (
      <Form unstackable onSubmit={this.addWod} className="wodForm">
        {/* Name */}
        <Form.Input 
        placeholder={nameLabel}
        name='name'
        onChange={this.handleChange}
        autoComplete="off"/>
        {/* Rx */}
        <div>{rxLabel}</div>
        <Accordion.Content>
          <Form.TextArea 
          placeholder={rxTextLabel} 
          name='rx'
          onChange={this.handleChange}/>
        </Accordion.Content>
        {/* Sc */}
        <div>{scLabel}</div>
        <Accordion.Content >
          <Form.TextArea 
          placeholder={scTextLabel} 
          name='sc'
          onChange={this.handleChange}/>
        </Accordion.Content>

        <Button type='submit' className='createButton' disabled={this.disabledCreateWod(wod)}>{submitLabel}</Button>
      </Form>
    )
  }
}
