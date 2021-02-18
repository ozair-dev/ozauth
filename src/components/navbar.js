import React from 'react';
import {ImUser} from "react-icons/im"
import {IoMdAdd} from "react-icons/io"
const Navbar = (props) => {	
  return (
    <div>
    	<nav className="w-screen h-14 bg-purple-100 fixed top-0 flex items-center">
	        <div className='w-2/4 sm:w-3/4'>
	        	<button onClick={()=>props.history.push("/")} className="ml-4 text-purple-800 text-3xl font-bold focus:outline-none ">
		        	Home
		        </button>
	        </div>
	        <div className='text-purple-800 flex items-center justify-around w-2/4 sm:w-1/4'>
	        	<button className="opacity-0 focus:outline-none bg-purple-200 p-1.5 rounded-full active:bg-purple-300 active:text-purple-800 " > 
	        		<IoMdAdd className="text-4xl" />
	        	</button>
	        	<button onClick={()=>props.history.push("/login") } className="focus:outline-none" >
	        		<ImUser className='text-4xl' />
	        	</button>
	        	

	        </div>
	    </nav>
    </div>
  )
}

export default Navbar;
