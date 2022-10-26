import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({getUsersMessages, formattedMessages}) => {
    return (
        <React.Fragment>
            <div className="chat-display">
                {formattedMessages.map((message, _index) => (
                    <div key={_index}>
                        <div className="chat-message-header">
                            <div className="img-container">
                                <img src={message.img} alt={message.name + ' profile'}/>
                            </div>
                            <p style={{color: message.color}}>{message.name}</p>
                        </div>
                        <p>{message.message}</p>
                    </div>
                ))}
              <div className='refresh'>
                <button className="refresh-button" onClick={() => getUsersMessages()}>Refresh Chat</button>
              </div>
            </div>
        </React.Fragment>
    )
}

export default Chat