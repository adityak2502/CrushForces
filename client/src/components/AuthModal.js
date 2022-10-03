import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const AuthModal = ({ setShowModal,  isSignUp, CFAuthToken }) => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [ cookies, setCookie, removeCookie] = useCookies(null)

    let navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (isSignUp){
                if(password !== confirmPassword) {
                    setError('Passwords need to match!')
                    return
                }
                const res = await axios.get("https://codeforces.com/api/user.info?handles=adityagamer")
                const firstName = res.data.result[0].firstName
                if(CFAuthToken != firstName){
                    setError("Please set your first name to the token")
                }
            }

            const response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup' : 'login'}`, { username, password })

            setCookie('AuthToken', response.data.token)
            setCookie('UserId', response.data.userId)

            const success = response.status === 201
            if (success && isSignUp) navigate ('/onboarding')
            if (success && !isSignUp) navigate ('/dashboard')

            window.location.reload()

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>

            <h2>{isSignUp ? 'CREATE ACCOUNT': 'LOG IN'}</h2>
            <p>By clicking Log In, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
            <form onSubmit={handleSubmit}>
                <input
                    id="username"
                    name="username"
                    placeholder="Codeforces Username/Handle"
                    required={true}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && <input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <p>{CFAuthToken}</p>
                <input className="secondary-button" type="submit"/>
                <p>{error}</p>
            </form>

            <hr/>
            <h2>GET THE APP</h2>

        </div>
    )
}
export default AuthModal
