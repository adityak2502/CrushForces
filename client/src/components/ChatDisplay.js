import Chat from './Chat'
import ChatInput from './ChatInput'
import axios from 'axios'
import {useState, useEffect} from "react"


const ChatDisplay = ({ user , clickedUser , AuthToken}) => {
    const Username = user?.username
    const clickedUserName = clickedUser?.username
    const [usersMessages, setUsersMessages] = useState(null)
    const [formattedMessages, setFormattedMessages] = useState([])

    const getUsersMessages = async () => {
     try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { username: Username, correspondingUsername: clickedUserName},
                headers: {"Authorization" : `Bearer ${AuthToken}`}
            })
            console.log("all set")
            setUsersMessages(response.data)
        } catch (error) {
         console.log(error)
     }
    }

    useEffect(() => {
        getUsersMessages()
    }, [])

    const messages = []

    useEffect(() => {
        usersMessages?.forEach(message => {
            const formattedMessage = {}
            formattedMessage['name'] = message.from_username
            formattedMessage['img'] = ((message.from_username == Username) ? (user?.url) : (clickedUser?.url))
            formattedMessage['message'] = message.message
            formattedMessage['timestamp'] = message.timestamp
            messages.push(formattedMessage)
        })
        const descendingOrderMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp))
        setFormattedMessages(descendingOrderMessages)
    }, [usersMessages]) 
    

    return (
        <div>
        {/* <button onClick={() => getUsersMessages()}>Refresh Chat</button> */}
        <Chat formattedMessages={formattedMessages}/>
     <ChatInput
         user={user}
        clickedUser={clickedUser} getUserMessages={getUsersMessages}  AuthToken = {AuthToken}/>
        </div>
    )
}

export default ChatDisplay