import React, { Component } from 'react';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }
	setUser = (user)=>{
		this.props.setUser(user)
	}
    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        var data = {
            Email: email,
            Password: password
		}
		var status;
        var response = await fetch(`https://localhost:44330/api/Login`,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
		const json = await response.json();
			
		console.log(json);
		status = json.toString(); 
		if(status !== 'BadRequest'){
			this.props.history.push(`/chat/${status}`);
		}else{
			this.props.history.push('/');
		}
		console.log(await status);	
		 
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {
        const { email, password } = this.state
        return (
            <div className="login">
                <form onSubmit={this.handleSubmit} className="login-form" >
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={this.handleChange}
                        placeholder={'Email'}
                    />
                    <input
                        type="text"
                        id="password"
                        value={password}
                        onChange={this.handleChange}
                        placeholder="Password"
                    />
                    <input type="submit" value="Submit" disabled={!this.validateForm()} />
                </form>
            </div>
        );
    }
}
