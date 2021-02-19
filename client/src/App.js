import React from 'react';
import {Switch, Route, withRouter, Link} from 'react-router-dom'
import axios from 'axios'
import './App.css';
import Navbar from "./components/navbar"
import Login from './components/login'
import Signup from "./components/signup"
import Logout from "./components/logout"
export default withRouter(
  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loggedIn: false,
        user: {}
      }
    }

    updateUser=(user)=>{
      if(user)this.setState({loggedIn:true, user:user})
      else this.setState({loggedIn:false, user: {}})
    }

    componentDidMount(){
      axios.get("/api/user")
      .then(res=>this.updateUser(res.data))
      .catch(err=>console.log("No user"))
    }
    render() {
      return (
        <div className="App pt-16">
          <Navbar history={this.props.history} />
          <Switch>
            <Route path="/" exact render={()=>(<div>
              <p className="text-5xl font-mono text-purple-500 text-center font-extrabold">Welcome</p>
              {this.state.loggedIn?(<p className="font-mono text-2xl mt-4 text-purple-700 text-center">Hy <b>{this.state.user.name}</b>, How Are You!</p>):
              (<Link  className="w-3/4 sm:w-2/4 block mx-auto shadow-md p-2 border-solid border-2 border-purple-400 rounded-md mt-8 font-mono text-center text-lg text-purple-700" to="/login">Go To Login Page</Link>)}
            </div>) } />
            <Route path="/login" render={()=><Login state={this.state} history={this.props.history} updateUser = {this.updateUser} /> } />
            <Route path="/signup" render={()=><Signup state={this.state} history= {this.props.history} /> } />
            <Route path="/logout" render={()=><Logout state={this.state} updateUser={this.updateUser} /> } />
          </Switch>
        </div>
      );
    }
  }
)
