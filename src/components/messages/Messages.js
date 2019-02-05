import React, { Component } from 'react';

export default class Messages extends Component {
	constructor(props) {
	  super(props);
		
		this.scrollDown = this.scrollDown.bind(this)
	}

	scrollDown(){
		const { container } = this.refs
		container.scrollTop = container.scrollHeight
	}

	componentDidMount() {
		this.scrollDown()
	}

	componentDidUpdate(prevProps, prevState) {
		this.scrollDown()
	}
	
	render() {
		const { messages, user,name } = this.props
		var options = {
			hour: 'numeric',
			minute: 'numeric',
		  };
		return (
			<div ref='container'
				className="thread-container">
				<div className="thread">
					{
						
						messages.map((mes)=>{
							return (
								<div
									key={mes.messageId}
									className={`message-container ${mes.fromId === user && 'right'}`}
								>
									<div className="time">{
										new Date(mes.dateSent).toLocaleString("en-US", options) 
										}</div>
									<div className="data">
										<div className="message">{mes.content}</div>
										<div className="name">{name}</div>
									</div>
								</div>

								)
						})
					}					
				</div>
			</div>
		);
	}
}
