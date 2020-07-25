import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';

function Nav() {

    const navStyle = {
        color:'white'
    };

    return (
        <nav>
            <ul className="nav-links">
                <Link style={navStyle} to="/"> <li>Home</li> </Link> 
                <Link style={navStyle} to="/register"> <li>Register User</li> </Link>
                <Link style={navStyle} to="/update"> <li>Update User</li> </Link> 
            </ul>
        </nav>
    )
}

export default Nav;