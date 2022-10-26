import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [matchedUserNames, setMatchedUserNames] = useState([])
    const [swipableUsers, setSwipableUsers] = useState([])
    const Username = cookies.Username
    const AuthToken = cookies.AuthToken
    
    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {username: Username}
            })
            setUser(response.data.user)
        } catch (error) {
            console.log(error)
        }
    }
    const getSwipableUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8000/swipable_users', {
                params: { 
                    username:  Username,
                    gender: user.gender_interest
                },
                headers: {"Authorization" : `Bearer ${AuthToken}`}
            })
            console.log(res.data)
            setSwipableUsers(res.data.swipableUsers)
        } catch (error) {
            console.log(error)
        }
    }
    
    const getMatchedUserNames = async() => {
        try{
            const res = await axios.get('http://localhost:8000/matches', {
                params: { username:  Username},
                headers: {"Authorization" : `Bearer ${AuthToken}`}
            })
            setMatchedUserNames(res.data.matchedUsernames)
        } catch(error) {
            console.log(error)
        }
    }
    

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        getMatchedUserNames()
    }, [user])

    useEffect(() => {
        getSwipableUsers()
    }, [user])



    const updateMatches = async (matchedUserName) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                username: Username,
                matchedUserName
            },
            {headers: {"Authorization" : `Bearer ${AuthToken}`}})
            getUser()
        } catch (err) {
            console.log(err)
        }
    }


    const swiped = (direction, swipedUserName) => {
        if (direction === 'right') {
            updateMatches(swipedUserName)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    return (
        <> 
            {user &&
            <div className="dashboard">
                <ChatContainer user={user} matchedUserNames = {matchedUserNames} AuthToken={AuthToken}/>
                <div className="swipe-container">
                    <div className="card-container">

                        {swipableUsers?.map((swipableUser) =>
                            <TinderCard
                                className="swipe"
                                key={swipableUser.username}
                                onSwipe={(dir) => swiped(dir, swipableUser.username)}
                                onCardLeftScreen={() => outOfFrame(swipableUser.username)}>
                                <div
                                    style={{backgroundImage: "url(" + swipableUser.url + ")"}}
                                    className="card">
                                    <h3 style={{color: swipableUser.color}}>{swipableUser.username}</h3>
                                </div>
                            </TinderCard>
                        )}
                        {!swipableUsers?.length && 
                            <div>
                                No more users available to swipe
                            </div>
                        }
                        <div className="swipe-info">
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
export default Dashboard
