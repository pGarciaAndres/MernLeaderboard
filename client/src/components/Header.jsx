import React from 'react'
import AdminLogin from './AdminLogin';
import { Button, Icon } from 'semantic-ui-react';
import logo from '../images/logo-qubox.png'
// BOXZONAZERO
/* import logo from '../images/logo-zonazero.png' */

export default function Header(props) {
  return (
    <div className="header">
      <img alt="" className="logo" src={logo}  />
      <Button icon className="menu" onClick={() => props.handleSidebar()}>
        <Icon className={"inverted huge icon menu " + (props.sidebar ? 'chevron left' : 'bars')}/>
      </Button>
      <AdminLogin admin={props.admin} loginAdmin={props.handleLogin} logout={props.handleLogout}/>
    </div>
  )
}
