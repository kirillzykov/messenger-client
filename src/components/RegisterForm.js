import React, { Component } from 'react';

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword:"",
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = this.state;
        var data = {
            Name: name,
            Email: email,
            Password: password,
            ConfirmPassword: confirmPassword,
        }
        var response = await fetch(`https://localhost:44330/api/Register`,
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
        const status = await response.status;
        if(status !== 'BadRequest'){
            this.props.history.push(`/login`);           
        }else{
            alert('BadRequest');
            this.props.history.push('/');
        }    
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {
        const { name, email, password, confirmPassword } = this.state;
        return (
            <div className="register">
                <form onSubmit={this.handleSubmit} className="register-form" >
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={this.handleChange}
                        placeholder="name"
                    />
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
                        placeholder={'Password'}
                    />
                    <input
                        type="text"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={this.handleChange}
                        placeholder="Confirm password"
                    />
                    <input type="submit" value="Submit" disabled={!this.validateForm()} />
                </form>
            </div>
        );
    }
}