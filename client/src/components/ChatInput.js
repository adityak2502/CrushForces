import { useState} from 'react'
import axios from 'axios'

const ChatInput = ({ user, clickedUser, getUserMessages, AuthToken }) => {
    const [textArea, setTextArea] = useState("")
    const Username = user?.username
    const clickedUsername = clickedUser?.username
    const addMessage = async () => {
        const message = {
            to_username: clickedUsername,
            timestamp: new Date().toISOString(),
            message: textArea
        }
        try {
            await axios.post('http://localhost:8000/message', { username: Username, message },
            {headers: {"Authorization" : `Bearer ${AuthToken}`}})
            getUserMessages()
            setTextArea("")
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="chat-input">
            <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
            <button className="secondary-button" onClick={addMessage}>Send</button>
        </div>
    )
}

export default ChatInput