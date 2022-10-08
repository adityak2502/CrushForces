import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const ChatHeader = ({ user }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])
    let navigate = useNavigate()


    const logout = () => {
        removeCookie('Username', cookies.Username)
        removeCookie('AuthToken', cookies.AuthToken)
        navigate('/')
    }

    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user.url} alt={"photo of " + user.username}/>
                </div>
                <h3>{user.username}</h3>
            </div>
            <i className="log-out-icon" onClick={logout}>⇦</i>
        </div>
    )
}

export default ChatHeader