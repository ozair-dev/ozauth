import React from 'react';
import {Link, Redirect} from "react-router-dom"
import {FcGoogle} from 'react-icons/fc'
import {AiFillFacebook, AiFillGithub} from 'react-icons/ai'
import axios from 'axios'
export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			formData: {
				username: "",
				password: ""
			},
			warning: ""
		}
	}
	handleChange = (e)=>{
		let data = this.state.formData
		data[e.target.name] = e.target.value;
		this.setState({formData: data})
	}
	handleSubmit=(e)=>{
		e.preventDefault();
		let formData = this.state.formData;
		if(!formData.username) return this.setState({warning: "Username is required"})
		else if(!formData.password) return this.setState({warning: "Password is required"});
		this.setState({warning: ""})
		axios.post("/api/user", formData)
		.then(res=>(res.data && this.props.updateUser(res.data)))
		.catch(err=>this.setState({warning: "Invalid username or password"}))
	}
	render() {
		if(this.props.state.loggedIn) return(<Redirect to="/logout" />)
		return (
			<div className="mt-4">
				<a href="http://localhost:5000/api/user/auth/google" className='block w-3/4 sm:w-2/4 mt-6 mx-auto border-solid border-2 border-purple-200 leading-none rounded-md shadow-md'><p className='text-3xl h-10 text-center flex items-center justify-center'><FcGoogle  className="-ml-7 mr-2" /><p className="text-2xl font-mono">Google</p></p></a>
				<a href="http://localhost:5000/api/user/auth/facebook" className='block w-3/4 sm:w-2/4 mt-6 mx-auto border-solid border-2 border-purple-200 leading-none rounded-md shadow-md'><p className='text-3xl h-10 text-center flex items-center justify-center'><AiFillFacebook className="mr-2 text-blue-800" /><p className="text-2xl font-mono">Facebook</p></p></a>
				<a href="http://localhost:5000/api/user/auth/github" className='block w-3/4 sm:w-2/4 mt-6 mx-auto border-solid border-2 border-purple-200 leading-none rounded-md shadow-md'><p className='text-3xl h-10 text-center flex items-center justify-center'><AiFillGithub className="-ml-8 mr-2" /><p className="text-2xl font-mono">Github</p></p></a>
				<p className='w-3/4 sm:w-2/3 text-purple-600 text-center font-mono mt-4 block mx-auto text-md'>Or Login With Email Address</p>
				<form onSubmit={this.handleSubmit}>
					<input name="username" value = {this.state.formData.username} onChange={this.handleChange} type='text' className="block mx-auto mt-4 w-3/4 sm:w-2/4 border-solid border-b-2 border-purple-300 p-2 focus:border-purple-800 placeholder-purple-500 focus:outline-none" placeholder="Enter Your Username" />
					<input name="password" value={this.state.formData.password} onChange={this.handleChange} type='password' className="block mx-auto mt-4 w-3/4 sm:w-2/4 border-solid border-b-2 border-purple-300 p-2 focus:border-purple-800 placeholder-purple-500 focus:outline-none" placeholder='Enter Your Password' />
					{this.state.warning && <p className="font-mono text-center text-red-700">{this.state.warning}</p>}
					<button className="block mx-auto mt-4 w-auto px-2 text-2xl text-purple-800 border-solid border-b-2 border-purple-900 focus:outline-none">Login</button>
				</form>
				<p className='text-center mt-2 block mx-auto w-3/4 sm:w-2/3'>Don't have an account? <Link to="/signup" className="text-purple-800 underline">Signup</Link></p>
			</div>
		);
	}
}
