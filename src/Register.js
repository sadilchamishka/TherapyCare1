import React, {useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Button,TextField,Select,MenuItem,Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const serverURL = "https://therapycare.herokuapp.com/";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("general");


  const registerUser = async () => {
    var token = window.localStorage.getItem("authkey");
    const response = await fetch(serverURL.concat("registeruser"), {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },   
        body: JSON.stringify({  email: email,
                                name:username,
                                password:password,
                                role:role, 
                                token:token
                                })
       });  
       
    setEmail("");
    setUsername("");
    setPassword("");
    setRole("general");
    };


  const updateEmail = (event)=>{
    setEmail(event.target.value);
  }; 

  const updateUsername = (event)=>{
    setUsername(event.target.value);
  }; 

  const updatePassword = (event)=>{
    setPassword(event.target.value);
  }; 

  const updateRole = (event)=>{
    setRole(event.target.value);
  }; 
    
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register User
        </Typography>
        <br></br>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={username}
                variant="outlined"
                required
                fullWidth
                label="User Name"
                autoFocus
                onChange={updateUsername}
              />
            </Grid>

            <Grid item xs={12}>
              <Select fullWidth value={role} onChange={updateRole} variant="outlined">
                <MenuItem value="general">General User</MenuItem>
                <MenuItem value="admin">Admin User</MenuItem>
              </Select>
            </Grid>
        
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={updateEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={updatePassword}
              />
            </Grid>
          
          </Grid>
          <Button
            type="submit"
            fullWidth
            onClick={registerUser}
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Register
          </Button>
      </div>
    </Container>
  );
}