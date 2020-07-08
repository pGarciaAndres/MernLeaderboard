import React, { Component } from 'react'
import { Menu, Accordion, Icon, Sidebar, Button, Image } from 'semantic-ui-react'
import AddWodForm from './AddWodForm'
import AddTournamentForm from './AddTournamentForm'
import LeaderboardUtils from './LeaderboardUtils'
import closeSession from '../images/close-session.png'
import locale from '../locale/es.json'

const closeSessionLabel = locale.closeSessionLabel
const leaderboardLabel = locale.leaderboardLabel
const workoutsLabel = locale.workoutsLabel
const deleteLabel = locale.deleteLabel
const noTournamentLabel = locale.noTournamentLabel
const noWodsLabel = locale.noWodsLabel
const newWodLabel = locale.newWodLabel
const sureLabel = locale.sureLabel
const yesLabel = locale.yesLabel
const newTournamentLabel = locale.newTournamentLabel
const utils = new LeaderboardUtils()

export default class SidebarContent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sidebarRow: 0,
            workoutsRow: 0,
            wodRow: 0,
            delete: false
        }
    }

    handleOpenSidebarRow = (e, props) => {
        const { index } = props
        const { sidebarRow } = this.state
        const newIndex = sidebarRow === index ? -1 : index
        this.setState({ sidebarRow: newIndex, workoutsRow: 0, wodRow: 0 })
    }
    
    handleOpenWorkoutsRow = (e, props) => {
        const { index } = props
        const { workoutsRow } = this.state
        const newIndex = workoutsRow === index ? -1 : index
        this.setState({ workoutsRow: newIndex, wodRow: 0 })
    }
    
    handleOpenWodRow = (e, props) => {
        const { index } = props
        const { wodRow } = this.state
        const newIndex = wodRow === index ? -1 : index
        this.setState({ wodRow: newIndex })
    }
    
    handleOpenLeaderboard = (e, props) => {
      this.setState({ sidebarRow: 0, workoutsRow: 0, wodRow: 0 })
      this.props.handleOpenLeaderboard(props)
    }
    
    handleAddWod = (wod, tournamentId) => {
      this.setState({ wodRow: 0 })
      this.props.handleAddWod(wod, tournamentId)
    }

    handleDeleteTournament = (e, props) => {
      this.props.handleDeleteTournament(props)
    }
    
    handleAddTournament = (tournament) => {
      this.setState({ sidebarRow: 0 })
      this.props.handleAddTournament(tournament)
    }

    handleCloseBoxSession = () => {
      this.setState({ sidebarRow: 0, workoutsRow: 0, wodRow: 0 })
      this.props.closeBoxSession()
    }

  render() {
    const { sidebarRow, workoutsRow, wodRow } = this.state

    return (
        <Sidebar as={Menu} animation='push' direction='right' inverted vertical visible={this.props.sidebar}>
          
          <div className="closeSession" onClick={this.handleCloseBoxSession}>
            <Image className="closeSession" src={closeSession} />
            <span>{closeSessionLabel}</span>
          </div>

          {this.props.tournaments.map(tournament => 
            <Accordion inverted key={tournament.id} className='accordionTournaments'>
            
              <Accordion.Title active={sidebarRow === tournament.id} index={tournament.id} onClick={this.handleOpenSidebarRow}>
                <Menu.Item key={tournament.id} as='a' header>
                  <Icon name='dropdown'/>{tournament.name}
                </Menu.Item>
              </Accordion.Title>

              <Accordion.Content active={sidebarRow === tournament.id}>
                <Accordion inverted className='accordionWorkouts'>
                  <Accordion.Title index={tournament.id} onClick={this.handleOpenLeaderboard}>
                    <Icon name='trophy'/>{leaderboardLabel}
                  </Accordion.Title>
                  <Accordion.Title active={workoutsRow === tournament.id} index={tournament.id} onClick={this.handleOpenWorkoutsRow}>
                    <Icon name='table'/>{workoutsLabel}
                  </Accordion.Title>
                  <Accordion.Content active={workoutsRow === tournament.id}>
                    {tournament.workouts.map(wod =>
                      <Accordion inverted className='accordionWod' key={wod.id}>
                        <Accordion.Title active={wodRow === wod.id} index={wod.id} onClick={this.handleOpenWodRow}>
                          <Icon name='dropdown'/>{wod.name}
                        </Accordion.Title>
                        {wodRow === wod.id && <div>Rx</div>}
                        <Accordion.Content active={wodRow === wod.id}>
                          {wod.rx.split("<br/>").map(line =>
                            <div key={line}>{line}</div>
                          )}
                        </Accordion.Content>
                        {wodRow === wod.id && <div>Scaled</div>}
                        <Accordion.Content active={wodRow === wod.id}>
                          {wod.sc.split("<br/>").map(line =>
                            <div key={line}>{line}</div>
                          )}
                        </Accordion.Content>
                      </Accordion>
                    )}
                    {tournament.workouts.length === 0 && 
                    <div className='empty'>{noWodsLabel}</div> }

                    {/* New WOD (Admin) */}
                    {this.props.admin && !utils.isTournamentFinished(tournament.active, tournament.leaderboard) &&
                    <Accordion inverted className='accordionWod new wod'>
                      <Accordion.Title active={wodRow === 'ADD'} index={'ADD'} onClick={this.handleOpenWodRow}>
                        <Icon name='dropdown'/>{newWodLabel}
                      </Accordion.Title>
                      <Accordion.Content active={wodRow === 'ADD'} className="wodContent">
                        <AddWodForm handleAddWod={this.handleAddWod} tournamentId={tournament.id}/>
                      </Accordion.Content>
                    </Accordion>}
                  </Accordion.Content>
                  
                  {this.props.admin && 
                  <Accordion.Title active={wodRow === 'DEL'} index={'DEL'} onClick={this.handleOpenWodRow}>
                    <Icon name='trash alternate' color='red'/>
                    <span className='red'>{deleteLabel}</span>
                  </Accordion.Title>}
                  <Accordion.Content active={wodRow === 'DEL'}>
                    <span>{sureLabel}</span>
                    <Button index={tournament.id} className='inverted red deleteTournament' onClick={this.handleDeleteTournament}>{yesLabel}</Button>
                  </Accordion.Content>
                </Accordion>
              </Accordion.Content>
            </Accordion>
          ).reverse()}

          {/* New Tournament (Admin) */}
          {this.props.admin && 
          <Accordion inverted className='accordionTournaments'>
            <Accordion.Title active={sidebarRow === 'ADDT'} index={'ADDT'} onClick={this.handleOpenSidebarRow}>
              <Menu.Item key={'ADDT'} as='a' header>
                <Icon name='dropdown'/>{newTournamentLabel}
              </Menu.Item>
            </Accordion.Title>
            <Accordion.Content active={sidebarRow === 'ADDT'} className="wodContent"> 
              <AddTournamentForm 
                handleAddTournament={this.handleAddTournament}
                tournaments={this.props.tournaments}/>
            </Accordion.Content>
          </Accordion>}
          {!this.props.admin && this.props.tournaments.length === 0 &&
            <Accordion inverted className='accordionTournaments'>
              <div className='empty top'>{noTournamentLabel}</div> 
            </Accordion>}
      </Sidebar>
    )
  }
}
