import React, { Component, Fragment } from 'react'
import { Image, Input, Icon, Button } from 'semantic-ui-react'
import locale from '../locale/es.json'
import * as firebase from 'firebase'
import adminLogin from '../images/adminLogin.png'
import adminLogout from '../images/adminLogout.png'

const userLogin = 'garciandres.15@gmail.com'

export default class AdminLogin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showLogin: false,
            pwd: '',
            error: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.admin === null && this.state.showLogin === true) {
            this.setState({ showLogin: false })
        }
    }

    showLogin = () => {
        let showLogin = this.state.showLogin
        let pwd = ''
        showLogin = !showLogin
        this.setState({ showLogin, pwd })
    }

    handleChange = (e) => {
        this.setState({ pwd: e.target.value })
    }

    keyPressed = (event) => {
        if (event.key === "Enter") {
            this.handleLogin()
        }
    }

    handleLogin = (event) => {
        //Email & Password provider
        let email = userLogin;
        let password = this.state.pwd;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(result => {
                console.log(`Admin has logged in!`);
                this.setState({
                    error: null,
                    showLogin: false,
                    pwd: ''
                });
                this.props.loginAdmin()
            }).catch(error => {
                console.log(`Error ${error.code}: ${error.message}`);
                this.setState({
                    showLogin: false,
                    pwd: '',
                    error: `Invalid password`
                });
            })
    }

    handleLogout = () => {
        console.log(`Admin has logged out!`);
        this.props.logout()
    }

    render() {
        let pwd = this.state.pwd
        let showLogin = this.state.showLogin
        return (
            <div className="adminLogin">
                {!this.props.admin && 
                    <Fragment>
                        <Image className="adminButton" src={adminLogin} onClick={this.showLogin} />
                        {showLogin &&
                            <Fragment>
                                <Input autoFocus type="password" placeholder={locale.pwdPlaceholder} name='password' onChange={this.handleChange} onKeyDown={this.keyPressed}/>
                                <Button icon className="pwdButton" disabled={pwd.length === 0 } onClick={this.handleLogin}>
                                    <Icon className="large check icon"/>
                                </Button>
                            </Fragment>
                        }
                    </Fragment>
                }
                {this.props.admin && 
                    <Image className="adminButton logout" src={adminLogout} onClick={this.handleLogout} />
                }
                
            </div>
            
        )
    }
}
