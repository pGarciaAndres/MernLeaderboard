import React, { Component, Fragment } from 'react'
import DeleteButton from './DeleteButton';
import { Icon, Accordion, Segment, Input, Button } from 'semantic-ui-react';
const noScoreLabel = 'No score';
const addScoreLabel = 'Click to add score';

export default class AthleteRow extends Component {
  constructor(props) {
    super(props)
    
    this.state = { 
      activeRow: 0,
      position: 0,
      athleteScoreTable: props.athlete.scoreTable ? props.athlete.scoreTable : [],
      editableCell: '',
      editReps: ''
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { position } = nextProps
    const athleteScoreTable = nextProps.athlete.scoreTable
    if (athleteScoreTable !== this.state.athleteScoreTable) {
      this.setState({ position, athleteScoreTable })
    }
    return true
  }

  handleOpenRow = (e, props) => {
    const { index } = props
    const { activeRow } = this.state
    const newIndex = activeRow === index ? -1 : index
    this.setState({ activeRow: newIndex, editableCell: '', editReps: '' })
  }

  handleSetEditable = (athleteId, wodId) => {
    if (this.props.admin) {
      this.setState({editableCell: `${athleteId}-${wodId}`})
    }
  }

  handleChangeReps = (e) => {
    this.setState({ editReps: e.target.value })
  }

  keyPressed = (event) => {
    if (event.key === "Enter") {
      this.handleConfirmReps()
    }
  }

  handleConfirmReps = () => {
    if (this.state.editReps) {
      const athleteId = parseInt(this.state.editableCell.split("-")[0])
      const newWodReps = { id: parseInt(this.state.editableCell.split("-")[1]), points: this.state.editReps}
      this.props.handleConfirmReps(athleteId, newWodReps)
    }
    this.setState({ activeRow: -1, editableCell: '', editReps: '' })
  }

  render() {
    const { activeRow } = this.state
    const { athlete, position } = this.props
    let editReps = this.state.editReps
    
    return (
      <Fragment>
        {!this.props.active && 
          <div className='athleteRow'>
            <div className='first'>
              <div className='gender'>
                {athlete.gender === 'Women' &&
                <Icon className="small venus icon"/>}
                {athlete.gender !== 'Women' &&
                <Icon className="small mars icon"/>}
              </div>
              <div className='category'>
                {athlete.category === 'Rx' && 'RX'}
                {athlete.category === 'Scaled' && 'SC'}
              </div>
            </div>
            <div className='athlete'>
              <div className='name'>{athlete.name}</div>
              <div className='comeFrom'>{athlete.from}</div>
            </div>
            {this.props.admin && 
            <DeleteButton athlete={athlete} handleRemoveAthlete={this.props.handleRemoveAthlete}/>}
          </div>
        }
        {/* Mobile */}
        {this.props.active &&           
          <Accordion className='accordionAthlete mobile' styled>
            <Accordion.Title className='athlete' active={activeRow === athlete.id} index={athlete.id} onClick={this.handleOpenRow}>
              <div className='scoreRow'>
                <span className='score'>{position}. </span>
              </div>
              <Icon name='dropdown' />
              <div className='name'>{athlete.name}</div>
              <span className='globalPoints'>{`(${athlete.globalPoints})`}</span>
              <div className='comeFrom'>{athlete.from}</div>
            </Accordion.Title>
            <Accordion.Content active={activeRow === athlete.id}>
                <div className='athleteScore-left'>
                  <img src={`${athlete.photo}`} alt="athlete-img"/>
                </div>
                <div className='athleteScore-right'>
                  {this.state.athleteScoreTable && this.state.athleteScoreTable.map(row => 
                    <Segment.Group key={`${athlete.id}-${row.wodId}`} horizontal>
                      <Segment className='firstCell'>{row.wodName}</Segment>
                      {row.reps !== "0" && <Segment>{`${row.wodRanking}th `}{row.reps}</Segment>}
                      {row.reps === "0" && 
                        <Segment className='editableCell' onClick={() => this.handleSetEditable(athlete.id, row.wodId)}>
                          {this.state.editableCell !== `${athlete.id}-${row.wodId}` && 
                            <Fragment>-
                              {this.props.admin && <Icon className="large pencil icon editIcon"/>}
                            </Fragment>}
                          {this.state.editableCell === `${athlete.id}-${row.wodId}` && 
                            <Fragment>
                              <Input autoFocus value={editReps} placeholder='Reps or time...' onChange={this.handleChangeReps} onKeyDown={this.keyPressed}/>
                              <Button icon className="editConfirmIcon" disabled={editReps.length === 0 } onClick={this.handleConfirmReps}>
                                <Icon className="large check icon"/>
                              </Button>
                            </Fragment>}
                        </Segment>
                      }
                    </Segment.Group>
                  )}
                </div>
            </Accordion.Content>
          </Accordion>
        }
        {/* Desktop */}
        {this.props.active &&           
          <div className='accordionAthlete desktop'>
            <div className='athlete'>
              <div className='scoreRow'>
                <span className='score'>{position}.</span>
              </div>
              <img src={`${athlete.photo}`} alt="athlete-img"/>
              <span className='name'>{athlete.name}</span>
              <div className='comeFrom'>{athlete.from}</div>
            </div>
            <div className='scores'>
              <Segment.Group horizontal>
                <Segment className='globalPoints'>{`(${athlete.globalPoints})`}</Segment>
                {this.state.athleteScoreTable && this.state.athleteScoreTable.map(row => 
                  row.reps !== "0" ? 
                    <Segment key={`${athlete.id}-${row.wodId}`}>{`${row.wodRanking}th `}{row.reps}</Segment> :
                    <Segment key={`${athlete.id}-${row.wodId}`} className='editableCell'>
                      {this.state.editableCell !== `${athlete.id}-${row.wodId}` && 
                        <span onClick={() => this.handleSetEditable(athlete.id, row.wodId)}>
                          {this.props.admin ? addScoreLabel : noScoreLabel}
                        </span>
                      }
                      {this.state.editableCell === `${athlete.id}-${row.wodId}` && 
                        <div className="ui icon input">
                          <Input autoFocus type="text" value={editReps} placeholder="Reps or time..." onChange={this.handleChangeReps} onKeyDown={this.keyPressed}/>
                          <i className="circular check link icon" onClick={this.handleConfirmReps}></i>
                        </div>
                      }
                    </Segment>
                )}
              </Segment.Group>
            </div>
          </div> 
        }
      </Fragment>
    )
  }
}
