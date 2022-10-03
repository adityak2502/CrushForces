res = await axios.get('http://localhost:8000/get_cf_token', { params: { username: username} })


client = new MongoClient(uri)
username = req.query.username
client.connect()
database = client.db('app-data')
tokens = database.collection('cf-auth-token')
query = {username: username}
user = await tokens.findOne(query)
token = uuidv4()