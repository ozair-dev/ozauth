import React from 'react';
import {Link, Redirect} from "react-router-dom"
import axios from 'axios'
export default class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {
				name: "",
				username: "",
				password: "",
				confirmPassword: ""
			},
			warning: ""
		}
	}
	handleChange = (e)=>{
		this.setState({warning: ""})
		let formData = this.state.formData;
		formData[e.target.name] = e.target.value
		this.setState({formData: formData})
	}
	handleSubmit = (e)=>{
		e.preventDefault();
		this.setState({warning: ""})
		let formData = this.state.formData;
		if(!formData.name) return this.setState({warning: "Name is required"})
		else if(!formData.username) return this.setState({warning: "Username is required"})
		else if(!formData.password) return this.setState({warning: "Password is required"})
		else if(!formData.confirmPassword) return this.setState({warning: "Re-enter the password"})
		else if(formData.password!==formData.confirmPassword) return this.setState({warning: "Password didn't match"});
		this.setState({warning: ""})
		delete formData.confirmPassword;
		axios.post("/api/user/signup", formData)
		.then(res=>this.props.history.push("/login"))
		.catch(err=>this.setState({warning: "Username is already taken"}))

	}
	render() {
		if(this.props.state.loggedIn) return (<Redirect to="/logout" />)
	  	return (
	    <div>
			<form onSubmit={this.handleSubmit}>
				<input name="name" value={this.state.formData.name} onChange={this.handleChange} type='text' className="block mx-auto mt-4 w-3/4 sm:w-2/4 border-solid border-b-2 border-purple-300 p-2 focus:border-purple-800 placeholder-purple-500 focus:outline-none" placeholder="Enter Your Name" />			
				<input name="username" value={this.state.formData.username} onChange={this.handleChange} type='text' className="block mx-auto mt-4 w-3/4 sm:w-2/4 border-solid border-b-2 border-purple-300 p-2 focus:border-purple-800 placeholder-purple-500 focus:outline-none" placeholder="Choose a Username" />
				<input name="password" value={this.state.formData.password} onChange={this.handleChange} type='password' className="block mx-auto mt-4 w-3/4 sm:w-2/4 border-solid border-b-2 border-purple-300 p-2 focus:border-purple-800 placeholder-purple-500 focus:outline-none" placeholder='Enter the Password' />
				<input name="confirmPassword" value={this.state.formData.confirmPassword} onChange={this.handleChange} type='password' className="block mx-auto mt-4 w-3/4 sm:w-2/4 border-solid border-b-2 border-purple-300 p-2 focus:border-purple-800 placeholder-purple-500 focus:outline-none" placeholder='Re-enter the Password' />
				{this.state.warning && <p className="font-mono text-center text-red-700">{this.state.warning}</p>}
				<button className="block mx-auto mt-4 w-auto px-2 text-2xl text-purple-800 border-solid border-b-2 border-purple-900 focus:outline-none">Signup</button>
			</form>
			<p className='text-center mt-2 block mx-auto w-3/4 sm:w-2/3'>Already have an account? <Link to="/login" className="text-purple-800 underline">Login</Link></p>

	    </div>
	  )
	}
}
