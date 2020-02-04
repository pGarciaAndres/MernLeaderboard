import React from 'react'
import AdminLogin from './AdminLogin';
import { Image, Button, Icon } from 'semantic-ui-react';
import logo from '../images/logo-qubox.png'

export default function Header(props) {
  return (
    <div className="header">
      <Image className="logo" src={logo}  />
      <Button icon className="menu" onClick={() => props.handleSidebar()}>
        <Icon className={"inverted huge icon menu " + (props.sidebar ? 'chevron left' : 'bars')}/>
      </Button>
      <AdminLogin admin={props.admin} loginAdmin={props.handleLoginAdmin} logout={props.handleLogout}/>
    </div>
  )
}
