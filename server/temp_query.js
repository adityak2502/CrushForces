res = await axios.get('http://localhost:8000/get_cf_token', { params: { username: username} })

res = await axios.get('http://localhost:8000/user', { params: {username: Username} })

axios.post('http://localhost:8000/signup', { username, password, CFToken, CFJWTToken }).catch(error => {
    x = error.response.data
});

res2 = await axios.get('http://localhost:8000/')

axios.get('http://localhost:8000/').then( res => {
    console.log(res.data)
  }).catch( err => {
    console.log(err)
})


app.get('/', (req, res) => {
  res.json('Hello to my app')
})


client = new MongoClient(uri)
username = req.query.username
client.connect()
database = client.db('app-data')
tokens = database.collection('cf-auth-token')
query = {username: username}
user = await tokens.findOne(query)
token = uuidv4()

jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
  console.log("verified")
})

const handleResponse = async() => {
  try{
    res = await axios.post('http://localhost:8000/signup', { username, password, CFToken, CFJWTToken })
  } catch(error){
  }
}


matchedUserNames = ["adityagamer"]
res = await axios.get("http://localhost:8000/users", {params: { usernames: JSON.stringify(matchedUserNames) },})