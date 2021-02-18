const router = require("express").Router();
const user = require("./user")
module.exports = (userDB)=>{
	router.get("/", (req, res)=>{
		res.send("Working")
	})
	router.use("/user", user(userDB))
	return router
}