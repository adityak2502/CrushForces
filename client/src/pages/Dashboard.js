import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const Username = cookies.Username


    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {username: Username}
            })
            console.log(response.data)
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getGenderedUsers = async () => {
        try {
            // const response = await axios.get('http://localhost:8000/gendered-users', {
            //     params: {gender: user?.gender_interest}
            // })
            const response = await axios.get('http://localhost:8000/all-users', {
                params: {gender: user?.gender_interest}
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUserName) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                Username,
                matchedUserName
            })
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

    const matchedUserNames = user?.matches.map(({username}) => username).concat(Username)

    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserNames.includes(genderedUser.username))


    console.log('filteredGenderedUsers ', filteredGenderedUsers)
    return (
        <> 
            {user &&
            <div className="dashboard">
                <ChatContainer user={user}/>
                <div className="swipe-container">
                    <div className="card-container">

                        {filteredGenderedUsers?.map((genderedUser) =>
                            <TinderCard
                                className="swipe"
                                key={genderedUser.username}
                                onSwipe={(dir) => swiped(dir, genderedUser.username)}
                                onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                                <div
                                    style={{backgroundImage: "url(" + genderedUser.url + ")"}}
                                    className="card">
                                    <h3>{genderedUser.first_name}</h3>
                                </div>
                            </TinderCard>
                        )}
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
