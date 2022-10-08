import Chat from './Chat'
import ChatInput from './ChatInput'
import axios from 'axios'
import {useState, useEffect} from "react"


const ChatDisplay = ({ user , clickedUser , AuthToken}) => {
    const Username = user?.username
    const clickedUserName = clickedUser?.username
    const [usersMessages, setUsersMessages] = useState(null)
    // const [usersMessages, setUsersMessages] = useState(null)
    // const [clickedUsersMessages, setClickedUsersMessages] = useState(null)

    const getUsersMessages = async () => {
     try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { username: Username, correspondingUsername: clickedUserName},
                headers: {"Authorization" : `Bearer ${AuthToken}`}
            })
         setUsersMessages(response.data)
        } catch (error) {
         console.log(error)
     }
    }

    // const getClickedUsersMessages = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8000/messages', {
    //             params: { username: clickedUserName , correspondingUsername: Username, AuthToken}
    //         })
    //         setClickedUsersMessages(response.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        getUsersMessages()
    }, [])

    const messages = []
    
    usersMessages?.forEach(message => {
        const formattedMessage = {}
        const curUser = message.from_username
        formattedMessage['name'] = message.from_username
        formattedMessage['img'] = ((message.from_username == Username) ? (user?.url) : (clickedUser?.url))
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    // usersMessages?.forEach(message => {
    //     const formattedMessage = {}
    //     formattedMessage['name'] = user?.username
    //     formattedMessage['img'] = user?.url
    //     formattedMessage['message'] = message.message
    //     formattedMessage['timestamp'] = message.timestamp
    //     messages.push(formattedMessage)
    // })

    // clickedUsersMessages?.forEach(message => {
    //     const formattedMessage = {}
    //     formattedMessage['name'] = clickedUser?.username
    //     formattedMessage['img'] = clickedUser?.url
    //     formattedMessage['message'] = message.message
    //     formattedMessage['timestamp'] = message.timestamp
    //     messages.push(formattedMessage)
    // })

    const descendingOrderMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp))

    return (
        <>
        <Chat descendingOrderMessages={descendingOrderMessages}/>
     <ChatInput
         user={user}
        clickedUser={clickedUser} getUserMessages={getUsersMessages}  AuthToken = {AuthToken}/>
        </>
    )
}

export default ChatDisplay