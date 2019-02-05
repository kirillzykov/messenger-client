import React, { Component } from 'react';
import SideBar from './SideBar'
import ChatHeading from './ChatHeading'
import Messages from '../messages/Messages'
import MessageInput from '../messages/MessageInput'
import {HubConnectionBuilder} from '@aspnet/signalr';

export default class ChatContainer extends Component {
	constructor(props) {
	  super(props);	
	
	  this.state = {
	  	chats:[],
		activeChat:null,
		messages:[],
		hubConnection: null,		  
	  };
	}
	componentWillReceiveProps(){
		console.log(this.props.user)
	}
	async componentWillMount() {
		console.log(this.props.user)
		var response = await fetch(`https://localhost:44330/api/GetConversations`,
        {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"UserId": `${this.props.user}`}),
            headers: { 'Content-Type': 'application/json' }
        });
		const json = await response.json().catch();
		var newChats=[];
		json.forEach(element => {
			newChats.push(element)
		});
		console.log(json)
		this.setState({chats:newChats})

		var connection = new HubConnectionBuilder()
		.withUrl("https://localhost:44330/chatHub").build();

		this.setState({hubConnection : connection})
		console.log(connection.hubConnection);
		connection.start().then(function(){
			console.log("conn")
		}).catch(function (err) {
			return console.error(err.toString());
		});
		connection.on("ReceiveConv",async  () =>{
			var response = await fetch(`https://localhost:44330/api/GetConversations`,
			{
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({"UserId": `${this.props.user}`}),
				headers: { 'Content-Type': 'application/json' }
			}).catch();
			const json = await response.json();
			var newChats=[];
			json.forEach(element => {
				newChats.push(element)
			});
			this.setState({chats:newChats})
		});
	}


	resetChat = (chat)=>{
		return this.addChat(chat, true)
	}


	addChat = (chat, reset)=>{
		const { chats } = this.state

		const newChats = reset ? [chat] : [...chats, chat]
		this.setState({chats:newChats, activeChat:reset ? chat : this.state.activeChat})

	}


	addMessageToChat = (chatId)=>{
		return message => {
			const { chats } = this.state
			let newChats = chats.map((chat)=>{
				if(chat.id === chatId)
					chat.messages.push(message)
				return chat
			})

			this.setState({chats:newChats})
		}
	}


	sendMessage = (chatId, message)=>{

	}

	setActiveChat = async (activeChat)=>{
		this.setState({activeChat})
		var response = await fetch(`https://localhost:44330/api/GetMessages`,
        {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"ConversationId": `${activeChat.conversationrId}`}),
            headers: { 'Content-Type': 'application/json' }
        });
		const json = await response.json();
		var newMessages=[];
		if(json.toString() !=="not found"){
			json.forEach(element => {
				newMessages.push(element)
			});
		}
		this.setState({messages:newMessages})
		this.state.hubConnection.on("ReceiveMessage",async  () =>{
			console.log(activeChat);
			var response = await  fetch(`https://localhost:44330/api/GetMessages`,
			{
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({"ConversationId": `${activeChat.conversationrId}`}),
				headers: { 'Content-Type': 'application/json' }
			});
			const json = await response.json();
			var newMessages=[];
			if(json.toString() !=="not found"){
				json.forEach(element => {
					newMessages.push(element)
				});
			}
			console.log(newMessages);
			this.setState({messages:newMessages})
		});
	}
	render() {
		const { user, logout } = this.props
		const { chats, activeChat ,messages,hubConnection} = this.state
		return (
			<div className="container">
				<SideBar
					logout={() =>{this.props.history.push('/'); logout()}}
					chats={chats}
					user={user}
					hubConnection={hubConnection}
					activeChat={activeChat}
					setActiveChat={this.setActiveChat}
					/>
				<div className="chat-room-container">
					{
						activeChat !== null ? (

							<div className="chat-room">
								<ChatHeading name={activeChat.membersId[0]===user?activeChat.membersName[1]:activeChat.membersName[0]} />
								<Messages 
									messages={messages}
									user={user}
									name={activeChat.membersId[0]===user?activeChat.membersName[1]:activeChat.membersName[0]}
									/>
								<MessageInput 
									userId={user}
									convId={activeChat.conversationrId}
									hubConnection={hubConnection}
									sendMessage={
										(message)=>{
											this.sendMessage(activeChat.conversationrId, message)
										}
									}
									/>

							</div>
						):
						<div className="chat-room choose">
							<h3>Choose a chat!</h3>
						</div>
					}
				</div>

			</div>
		);
	}
}
