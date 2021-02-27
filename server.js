process.env.MONGO_URI="mongodb://ozair_ayaz:ozair_03235146562@cluster0-shard-00-00.m4fyc.mongodb.net:27017,cluster0-shard-00-01.m4fyc.mongodb.net:27017,cluster0-shard-00-02.m4fyc.mongodb.net:27017/auth?ssl=true&replicaSet=atlas-92jndn-shard-0&authSource=admin&retryWrites=true&w=majority"
process.env.FACEBOOK_CLIENT_ID="203742888108497";
process.env.FACEBOOK_CLIENT_SECRET="642045368df770d3a3d2b4028788aad8";
process.env.FACEBOOK_CALLBACK_URL="https://ozauth.herokuapp.com/api/user/auth/facebook/callback";
process.env.GOOGLE_CLIENT_ID="893366708424-hqn0as5nnr3u05pesd8n7mnls4gonsa6.apps.googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET="gFyF5mPo8RCF31gtclbtUNia";
process.env.GOOGLE_CALLBACK_URL="https://ozauth.herokuapp.com/api/user/auth/google/callback";
process.env.GITHUB_CLIENT_ID="968ba55ef1b55b634023"
process.env.GITHUB_CLIENT_SECRET="5ff7724e9a9ce79f83fdbd497db4609d6868d1a4"
process.env.GITHUB_CALLBACK_URL="https://ozauth.herokuapp.com/api/user/auth/github/callback"
const express = require("express")
const api = require("./routes/api")
const bodyParser = require("body-parser")
const morgan = require('morgan')
const session = require('express-session')
const cors = require('cors')
const path = require("path")
const passport = require('passport')
const myDB = require("./connection")
const auth = require("./auth")
const MongoStore = require('connect-mongo')(session)
const store = new MongoStore({url: process.env.MONGO_URI})
var port = process.env.PORT || 5000
const app = express();
app.use(
	session({
		secret: "pptx",
		store: store,
		resave: true, 
		saveUninitialized: true,
		cookie: {
			maxAge: 2592000000
		}
	})
)
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan('dev'))

myDB(async (client) => {
	let userDB = await client.db('practice').collection('users');
	auth(userDB)
	if (process.env.NODE_ENV === 'production') {
	    app.use(express.static('client/build'));
	}
	app.use("/api", api(userDB))
	app.get("*", (req, res)=>{
		res.redirect("/")
	})
	}).catch((e)=>{
    app.route('/').get((req, res)=>{
    	res.send("Error loading the page")
    })
})

app.listen(port, ()=>{
	console.log("Listening on port "+port)
})