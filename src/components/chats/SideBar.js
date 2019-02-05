import React, { Component } from 'react';


export default class SideBar extends Component{

	constructor(props) {
        super(props);
        this.state = {
			email: "",
			
        };
    }
	async componentWillMount(){
		console.log((this.props.chats))
	}	
	handleChange = event => {
        this.setState({email: event.target.value})
    }
	handleClick = async (event) =>{
		var response = await fetch(`https://localhost:44330/api/CreateConversationWithUser`,
        {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"UserId": `${this.props.user}`, "Email":`${this.state.email}`}),
            headers: { 'Content-Type': 'application/json' }
		});
		const json = await response.status;
		
		if(json.toString() ==="204"){
			this.props.hubConnection
			.invoke("SendConv", "", "").catch(function (err) {
				return console.error(err.toString());
			}); 
		}
		this.setState({email:""})
		
	}
	render(){
		const { chats, user, setActiveChat, logout} = this.props
		const { email } = this.state
		return (
			<div id="side-bar">
					<div className="search">
					<input placeholder="Search (Email)" id="email" type="text" value={email} onChange={this.handleChange}/>
					<div className="plus" onClick={this.handleClick}></div>
					</div>
					<div 
						className="users" 
						ref='users' 
						onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null) }}>
						
						{
						chats.map((chat)=>{															
							return(
								<div 
									key={chat.conversationrId} 
									className={`user ${chat.membersId[0]===user?chat.membersName[1]:chat.membersName[0]}`}
									onClick={ ()=>{ setActiveChat(chat) } }
									>
									<div className="name">{chat.membersId[0]===user?chat.membersName[1]:chat.membersName[0]}</div>																												
								</div>
							)							
						})	
						}
						
					</div>
					<div className="current-user">
						<div onClick={()=>{ logout()}} title="Logout" className="logout">
							Logout	
						</div>
					</div>
			</div>
		);
	
	}
}
