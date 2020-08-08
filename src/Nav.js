import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';
import Tooltip from "@material-ui/core/Tooltip";

function Nav() {

    const navStyle = {
        color:'white'
    };

    const logout = ()=>{
        localStorage.removeItem("authkey");
        document.location.href="/";
      }

    return (
        <nav>
            <ul className="nav-links">
                <Link style={navStyle} to="/"> <i class="fa fa-home" style = {{fontSize:40}}></i> </Link> 
                <Link style={navStyle} to="/register"> <i class="fa fa-plus-circle" style = {{fontSize:40}}></i> </Link>
                <Link style={navStyle} to="/update"> <i class="fa fa-users" style = {{fontSize:40}}></i> </Link>
                <Link style={navStyle} to="/setting"> <i class="fa fa-gear" style = {{fontSize:40}}></i> </Link>
                <Link style={navStyle} to="/"> <i onClick={logout} class="fa fa-sign-out" style = {{fontSize:40}}></i></Link> 
            </ul>
        </nav>
    )
}

export default Nav;