import React, { Component, Fragment } from 'react'
import DeleteButton from './DeleteButton';
import { Icon, Accordion, Segment, Input } from 'semantic-ui-react';
import goldPosition from '../images/gold.jpg'
import silverPosition from '../images/silver.jpg'
import bronzePosition from '../images/bronze.jpg'
const noScoreLabel = 'No score';
const addScoreLabel = 'Click to add score';
const insertScoreLabel = 'Insert here..';

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
    if (this.props.admin && !this.props.finished) {
      this.setState({editableCell: `${athleteId}-${wodId}`})
    }
  }

  handleChangeReps = (e) => {
    this.setState({ editReps: e.target.value })
  }

  keyPressed = (event) => {
    if (event.key === "Enter") {
      this.handleConfirmReps(event)
    }
  }

  handleConfirmReps = (event) => {
    if (this.state.editReps) {
      const athleteId = parseInt(this.state.editableCell.split("-")[0])
      const newWodReps = { id: parseInt(this.state.editableCell.split("-")[1]), points: this.state.editReps.replace('.',',')}
      this.props.handleConfirmReps(athleteId, newWodReps)
    }
    this.setState({ editableCell: '', editReps: '' })
    event.stopPropagation();
  }

  getPodium = (position) => {
    if (position === 1) {
      return <img src={goldPosition} alt="First Place"/>
    } else if (position === 2) {
      return <img src={silverPosition} alt="Second Place"/>
    } else if (position === 3) {
      return <img src={bronzePosition} alt="Third Place"/>
    } else {
      return <span className='score'>{position}.</span>
    }
  }

  render() {
    const { activeRow, editableCell, editReps } = this.state
    const { athlete, position } = this.props
    
    return (
      <Fragment>
        {!this.props.active && !this.props.finished &&
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
        {(this.props.active || this.props.finished) &&           
          <Accordion className='accordionAthlete mobile' styled>
            <Accordion.Title className='athlete' active={activeRow === athlete.id} index={athlete.id} onClick={this.handleOpenRow}>
              <div className='scoreRow'>
                {this.props.finished &&
                  this.getPodium(position)
                }
                {!this.props.finished &&
                  <span className='score'>{position}.</span>
                }
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
                        <Segment className={!this.props.finished ? 'editableCell':''} onClick={() => this.handleSetEditable(athlete.id, row.wodId)}>
                          {editableCell !== `${athlete.id}-${row.wodId}` && 
                            (row.reps === "0" ? 
                              <Fragment>
                                -{this.props.admin && <Icon className="large pencil icon editIcon"/>}
                              </Fragment>
                            :
                              <Fragment>
                                {`${row.wodRanking}th `} {row.reps}
                              </Fragment>)
                          }
                          {editableCell === `${athlete.id}-${row.wodId}` && 
                            <Fragment>
                              <Input autoFocus type="text" value={editReps} placeholder={insertScoreLabel} onChange={this.handleChangeReps} onKeyDown={this.keyPressed}/>
                              {editReps === '' ? 
                                <i className="large close icon" onClick={this.handleConfirmReps}/> :
                                <i className="large check icon" onClick={this.handleConfirmReps}/>
                              }
                            </Fragment>}
                        </Segment>
                    </Segment.Group>
                  )}
                </div>
            </Accordion.Content>
          </Accordion>
        }
        {/* Desktop */}
        {(this.props.active || this.props.finished) &&    
          <div className='accordionAthlete desktop'>
            <div className='athlete'>
              <div className='scoreRow'>
                {this.props.finished &&
                  this.getPodium(position)
                }
                {!this.props.finished &&
                  <span className='score'>{position}.</span>
                }
              </div>
              <img src={`${athlete.photo}`} alt="athlete-img"/>
              <span className='name'>{athlete.name}</span>
              <div className='comeFrom'>{athlete.from}</div>
            </div>
            <div className='scores'>
              <Segment.Group horizontal>
                <Segment className='globalPoints'>{`(${athlete.globalPoints})`}</Segment>
                {this.state.athleteScoreTable && this.state.athleteScoreTable.map(row =>
                    <Segment key={`${athlete.id}-${row.wodId}`} className={this.props.admin && !this.props.finished ? 'editableCell' : ''}>
                      {editableCell !== `${athlete.id}-${row.wodId}` && 
                        <span onClick={() => this.handleSetEditable(athlete.id, row.wodId)}>
                          {row.reps === "0" && (this.props.admin ? addScoreLabel : noScoreLabel)}
                          {row.reps !== "0" && (`${row.wodRanking}th ${row.reps}`)}
                        </span>
                      }
                      {editableCell === `${athlete.id}-${row.wodId}` && 
                        <div className="ui icon input">
                          <Input autoFocus type="text" value={editReps} placeholder={insertScoreLabel} onChange={this.handleChangeReps} onKeyDown={this.keyPressed}/>
                          {editReps === '' ? 
                            <i className="circular close link icon" onClick={this.handleConfirmReps}/> :
                            <i className="circular check link icon" onClick={this.handleConfirmReps}/>
                           }
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
