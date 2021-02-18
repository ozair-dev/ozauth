const router = require("express").Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
module.exports = (userDB)=>{
	router.get("/", (req, res)=>{
		if(req.user){
			res.send(req.user)
		}else{
			 res.status(400).send("NO");
		}
	})
	router.post("/", passport.authenticate('local'), (req, res)=>{
		res.send(req.user)
	})
	router.post("/signup", (req, res)=>{
		let user = req.body;
		let hash = bcrypt.hashSync(user.password, 12)
		user.password = hash;
		userDB.findOne({username: user.username},(err, data)=>{
			if(err) return console.log(err);
			if(data) return res.status(400).send("Already exists");
			userDB.insertOne(user, (err, data)=>{
				if(err) return console.log(err);
				res.send(data.ops[0])
			})
		})
	})

	router.get("/auth/facebook", passport.authenticate('facebook'))
	router.get("/auth/facebook/callback", passport.authenticate('facebook'), (req, res)=>{
		res.redirect("/api/user")
	})
	router.get("/auth/google", passport.authenticate("google", {scope: ['profile', 'email']}))
	router.get("/auth/google/callback", passport.authenticate('google'), (req, res)=>{
		res.redirect("/api/user")
	})
	router.get("/auth/github", passport.authenticate("github"))
	router.get("/auth/github/callback", passport.authenticate("github"), (req, res)=>{
		res.redirect("/api/user")
	})
	router.get("/logout", (req, res)=>{
		if(req.user){
			console.log("logging out")
			req.logout()
		}else{
			console.log("Already logged out")
		}
		res.end()
	})
	return router;
}