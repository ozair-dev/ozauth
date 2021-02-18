import React from 'react';
import {Redirect} from "react-router-dom"
import axios from 'axios'
const Logout = (props) => {
	let handleLogout=()=>{
		axios.get("/api/user/logout")
		.then(res=>props.updateUser(null))
		.catch(err=>console.log(err))
	}
  	return props.state.loggedIn? (<buton onClick={handleLogout} className="select-none w-40 text-center block mx-auto mt-8 p-2 text-xl font-sans text-white bg-purple-700 rounded">Logout</buton>):(<Redirect to='/login' />)
}

export default Logout;