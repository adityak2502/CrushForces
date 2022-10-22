import ScrollButton from './ScrollButton'; 
const Chat = ({formattedMessages}) => {
    return (
        <div>
            <div className="chat-display">
                {formattedMessages.map((message, _index) => (
                    <div key={_index}>
                        <div className="chat-message-header">
                            <div className="img-container">
                                <img src={message.img} alt={message.name + ' profile'}/>
                            </div>
                            <p>{message.name}</p>
                        </div>
                        <p>{message.message}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Chat