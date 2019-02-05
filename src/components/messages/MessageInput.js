import React, { Component } from 'react';

export default class MessageInput extends Component {
	
	constructor(props) {
	  	super(props);

		this.state = {
			message:"",
		};
	}

	handleSubmit = (e)=>{
		e.preventDefault()
		this.sendMessage()
		this.setState({message:""})
	}

	sendMessage = async (convId,userId)=>{
		await fetch(`https://localhost:44330/api/AddMessage`,
        {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
				"FromId": `${this.props.userId}`,
				"ConversationId": `${this.props.convId}`,
				"Content": `${this.state.message}`}),
            headers: { 'Content-Type': 'application/json' }
		});
		this.props.hubConnection
		.invoke("SendMessage", this.props.userId, this.state.message).catch(function (err) {
			return console.error(err.toString());
		}); 
		this.props.sendMessage(this.state.message)
	}

	render() {
		const { message } = this.state
		return (
			<div className="message-input">
				<form 
					onSubmit={ this.handleSubmit }
					className="message-form">

					<input 
						id = "message"
						ref = {"messageinput"}
						type = "text"
						className = "form-control"
						value = { message }
						autoComplete = {'off'}
						placeholder = "Type something interesting"						
						onChange = {
							({target})=>{
								this.setState({message:target.value})
							}
						}
						/>
					<button
						disabled = { message.length < 1 }
						type = "submit"
						className = "send"

					> Send </button>
				</form>

			</div>
		);
	}
}
