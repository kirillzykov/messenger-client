import './index.css';
import React, { Component } from 'react';
import LoginForm from './components/LoginForm'
import WelcomeScreen from './components/WelcomeScreen';
import RegisterForm from './components/RegisterForm';
import ChatContainer from './components/chats/ChatContainer'
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class Layout extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {	  	
	  	user:null,
	  };
	}

	setUser = (user)=>{

		this.setState({user})
	}

	logout =async ()=>{

		this.setState({user:null})
		await fetch(`https://localhost:44330/api/Logout`,
        {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
    });
	}

	render() {

		return (
			<Router >
				<div className="container">
					<Route path="/" exact component={WelcomeScreen} />
					<Route path="/login" render={(props)=><LoginForm {...props}  setUser={this.setUser} />} />
					<Route path="/register" component={RegisterForm} />
					<Route path={`/chat/:user`} render={(props)=><ChatContainer {...props} user={props.match.params.user} logout={this.logout}/>} />					
				</div>
			</Router>
		);
	}
}
