const PORT = 8000
const express = require('express')
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')
const axios = require('axios')
const base64 = require('uuid-base64')
require('dotenv').config()

const uri = process.env.URI
const JWT_SECRET = process.env.JWT_SECRET

const app = express()
app.use(cors())
app.use(express.json())

// Default
app.get('/', (req, res) => {
    res.json('Hello to my app')
})

const verify_cf_token = async(curUsername, curCFToken, CFJWTToken) => {
    try {
        const { username, token } = await jwt.verify(CFJWTToken, JWT_SECRET)
        const CFres = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`)
        const firstName = CFres.data.result[0].firstName
        if(username === curUsername && token === curCFToken && firstName === token){
            return true
        } else{
            return false
        }
    } catch(error){
        return false
    }
}

const checkRootLogin = async(req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedUsername = jwt.verify(token, JWT_SECRET).username
        const username = (req.method == 'GET') ? req.query.username : req.body.username
        if(username !== decodedUsername){
            throw new Error("Cookie mismatch")
        }
        req.token = token 
        next()
    } catch(e){
        res.status(401).send({error: "Authentication Problem"})
    }
}

// Sign up to the Database
app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri)
    let {username, password, CFToken, CFJWTToken} = req.body
    
    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        if(await verify_cf_token(username, CFToken, CFJWTToken)){
            await client.connect()
            const database = client.db('app-data')
            const users = database.collection('users')
    
            const existingUser = await users.findOne({username})
    
            if (existingUser) {
                return res.status(409).send('User already exists. Please login')
            }
    
            const data = {
                user_id: generatedUserId,
                username: username,
                hashed_password: hashedPassword
            }
    
            await users.insertOne(data)
    
            const token = jwt.sign({username}, JWT_SECRET, {})
            return res.status(201).json({token, username})
        } else{
            return res.status(401).json('Token did not match. Please generate a token and set this as your CF first name')
        }
    } catch (err) {
        console.log(err)
        return res.status(401).json('Token did not match. Please generate a token and set this as your CF first name')
    } finally {
        await client.close()
    }
})


app.get('/get_cf_token', async (req, res) => {
    try {
        const username = req.query.username
        const token = uuidv4()
        const jwt_token = jwt.sign({username, token}, JWT_SECRET, {})
        response = {
            CF_token: token,
            jwt_token: jwt_token
        }
        res.send(response)
    } catch(error){
        console.log(error)
    }
})



// Log in to the Database
app.post('/login', async (req, res) => {
    const client = new MongoClient(uri)
    const {username, password} = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({username})
        const correctPassword = user && await bcrypt.compare(password, user.hashed_password)

        if (user && correctPassword) {
            const token = jwt.sign({username}, JWT_SECRET,{})
            res.status(201).json({token, username})
        } else{
            res.status(400).json('Invalid Credentials')
        }
    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

// Get individual user
app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const username = req.query.username

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {username}
        const user = await users.findOne(query)
        res.send(user)

    } finally {
        await client.close()
    }
})

// Update User with a match
app.put('/addmatch', checkRootLogin, async (req, res) => {
    const client = new MongoClient(uri)
    const {username, matchedUserName} = req.body
    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {username}
        const updateDocument = {
            $push: {matches: {username: matchedUserName}}
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
})

// Get all Users in the Database
app.get('/all-users', async (req, res) => {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)

    } finally {
        await client.close()
    }
})

// Get all Users by usernames in the Database
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const usernames = JSON.parse(req.query.usernames)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'username': {
                            '$in': usernames
                        }
                    }
                }
            ]

        const foundUsers = await users.aggregate(pipeline).toArray()

        res.json(foundUsers)

    } finally {
        await client.close()
    }
})

// Get all the Gendered Users in the Database
app.get('/gendered-users', async (req, res) => {
    const client = new MongoClient(uri)
    const gender = req.query.gender

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = {gender_identity: {$eq: gender}}
        const foundUsers = await users.find(query).toArray()
        res.json(foundUsers)

    } finally {
        await client.close()
    }
})

// Update a User in the Database
app.put('/user', checkRootLogin, async (req, res) => {
    const client = new MongoClient(uri)
    const {username, formData} = req.body
    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = {username}

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            },
        }

        const insertedUser = await users.updateOne(query, updateDocument)

        res.json(insertedUser)

    } finally {
        await client.close()
    }
})

// Get Messages by from_username and to_username
app.get('/messages', checkRootLogin, async (req, res) => {
    const {username, correspondingUsername} = req.query
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const query = {
            $or: [
                {from_username: username, to_username: correspondingUsername},
                {from_username: correspondingUsername, to_username: username}
            ]
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})

// Add a Message to our Database
app.post('/message', checkRootLogin, async (req, res) => {
    const client = new MongoClient(uri)
    const {username, message} = req.body
    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const insertedMessage = await messages.insertOne({from_username: username, ...message})
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})


app.listen(PORT, () => console.log('server running on PORT ' + PORT))
