import React from 'react'
import AdminLogin from './AdminLogin';
import { Button, Icon } from 'semantic-ui-react';
import qubox from '../images/logo-qubox.png'
import zonazero from '../images/logo-zonazero.png'

const getLogo = (boxSession) => {
  if (boxSession === 'ZONAZERO') {
    return zonazero
  }
  if (boxSession === 'QUBOX') {
    return qubox
  }
}

export default function Header(props) {
  return (
    <div className="header">
      <img alt="" className="logo" src={getLogo(props.boxSession)}  />
      <Button icon className="menu" onClick={() => props.handleSidebar()}>
        <Icon className={"inverted huge icon menu " + (props.sidebar ? 'chevron left' : 'bars')}/>
      </Button>
      <AdminLogin admin={props.admin} loginAdmin={props.handleLogin} logout={props.handleLogout}/>
    </div>
  )
}
