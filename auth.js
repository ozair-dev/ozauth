const passport = require("passport")
const LocalStrategy = require("passport-local")
const FacebookStrategy = require('passport-facebook')
const GoogleStrategy = require("passport-google-oauth20")
const GithubStrategy = require('passport-github').Strategy
const bcrypt = require('bcrypt')
const ObjectID = require("mongodb").ObjectID
module.exports = (userDB)=>{

	passport.use(
		new LocalStrategy((username, password, done)=>{
			userDB.findOne({username: username}, (err, user)=>{
				if(!user) return done(null, false, {message: "Invalid User"});
				if(!bcrypt.compareSync(password, user.password)) return done(null, false, {message: "Invalid Password"});
				delete user.password
				done(null, user)
			})
		})
	)

	 passport.use(new GithubStrategy({
	    clientID: process.env.GITHUB_CLIENT_ID,
	    clientSecret: process.env.GITHUB_CLIENT_SECRET,
	    callbackURL: process.env.GITHUB_CALLBACK_URL
	  }, function(accessToken, refreshToken, profile, cb){
	  	userDB.findOneAndUpdate({username: profile.id},{
	  		$setOnInsert: {
	  			name: profile.username,
	  			username: profile.id
	  		},
	  		$set: {
	  			last_login: new Date(),
	  		},
			$inc: {
		      login_count: 1
		    }
	  	},{upsert: true, new: true}, (err, data)=>{
	  		if(err) return console.log(err);
	  		console.log(data.value)
	  		cb(null, data.value)
	  	}
	  	)
	  }))

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
				callbackURL: process.env.FACEBOOK_CALLBACK_URL,
				profileFields: ['email', 'name']
			},
			(accessToken, refreshToken, profile, done)=>{
				let profileData = profile._json;
				let name = `${profileData.first_name} ${profileData.last_name}`
				userDB.findOneAndUpdate({username: profileData.id},
					{
						$setOnInsert: {
							name: name,
							username: profileData.id
						},
						$set: {
							last_login: new Date(),
						},
						$inc: {
					      login_count: 1
					    }
					}, 
					{
						upsert: true,
						new: true
					}, (err, user)=>{
						if(err) return done(null, false);
						done(null, user.value) 
					}
				)
			}
		)
	)

	passport.use(
		new GoogleStrategy(
		{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL,
		userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
	}, (accessToken, refreshToken, profile, cb)=>{
		let profileData = profile._json
		userDB.findAndModify({
			username: profileData.email
		},{}, {
			$setOnInsert: {
				username: profileData.email,
				name: profileData.name
			},
			$set: {
				last_login: new Date()
			},
			$inc: {
		      login_count: 1
		    }
		},
		{upsert: true,new: true},(err, user)=>{
			if(err) return console.log(err);
			console.log("user", user)
			cb(null, user.value)
		})
	}))

	passport.serializeUser((user, done)=>{
		console.log("Serializing User")
		done(null, user._id)
	})
	passport.deserializeUser((id, done)=>{
		console.log("Deserializing User")
		userDB.findOne({_id: new ObjectID(id)}, (err, user)=>{
			if(err) return done(null, err);
			if(user.password) delete user.password;
			done(null, user)
		})
	})
}