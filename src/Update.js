import React, { useEffect, useState } from 'react';
import User from './User';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
            <br></br>
            <Grid container spacing={4}> &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;
              <Grid item xs={2}>
                <InputLabel>User Name</InputLabel>
              </Grid>
              <Grid item xs={3}>
                <InputLabel>Email</InputLabel>
              </Grid>
              <Grid item xs={2}>
                <InputLabel>Password</InputLabel>
              </Grid>
            </Grid>
            {users.map((user)=>(
                <User useremail={user[0]} name={user[1]} role={user[2]}/>
            ))}
        </div>
        
    );
}