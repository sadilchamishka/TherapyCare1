import React, { useEffect, useState } from 'react';
import User from './User';
import { InputLabel } from '@material-ui/core';

const serverURL = "https://therapycare.herokuapp.com/";

export default function Update() {

    useEffect(()=>{
        getUsers();
      },[]);

    const [users, setUsers] = useState([]);

    const getUsers = async ()=>{
        const response = await fetch(serverURL.concat("users"));
        const data = await response.json();
        setUsers(data.users);
    };

    return (
        <div>
            <h1>Therapycare Staff</h1>
            <div align="center">
            <h3>Email &emsp; &emsp;  &emsp; &emsp; &emsp; &emsp;  &emsp; &emsp; &emsp; &emsp;  Username &emsp; &emsp; &emsp; &emsp;  &emsp; &emsp; Password</h3>
            </div>
            {users.map((user)=>(
                <User email={user[0]} name={user[1]} role={user[2]}/>
            ))}
        </div>
        
    );
}