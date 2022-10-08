import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
const { v4: uuidv4 } = require('uuid')

const AuthModal = ({ setShowModal, isSignUp }) => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [verifyingUsername, setVerifyingUsername] = useState(null)
    const [CFToken, setCFToken] = useState(null)
    const [CFJWTToken, setCFJWTToken] = useState(null)

    let navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    }

    const handleTokenClick = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.get('http://localhost:8000/get_cf_token', { params: { username: username } })
            console.log(res.data)
            setCFToken(res.data.CF_token)
            setCFJWTToken(res.data.jwt_token)
            setVerifyingUsername(username)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    setError('Passwords need to match!')
                    return
                }
            }
            if(isSignUp) setUsername(verifyingUsername)
            setError(isSignUp ? "Verifying CF token" : "Logging in")
            axios.post(`http://localhost:8000/${isSignUp ? 'signup' : 'login'}`, { username, password, CFToken, CFJWTToken }).then(res => {
                setCookie('AuthToken', res.data.token)
                setCookie('Username', res.data.username)
                if (isSignUp) navigate('/onboarding')
                if (!isSignUp) navigate('/dashboard')
                window.location.reload()
            }).catch(err => {
                setError(err.response.data)
            })

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>

            <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
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
                {isSignUp && 
                    <button className="tertiary-button" onClick={handleTokenClick}>Generate {CFToken ? 'another' : ''} token for {username ? username : 'username'}</button>
                }
                {isSignUp && CFToken &&
                    <p> Token for {verifyingUsername} generated. Please set Codeforces profile first name as <br />{CFToken}</p>
                }
                <input className="secondary-button" type="submit" />
                <p>{error}</p>
            </form>

            <hr />

        </div>
    )
}
export default AuthModal
