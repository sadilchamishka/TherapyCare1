import React, { useEffect, useState } from 'react';

import Dashboard from './Dashboard';
import Nav from './Nav';
import Register from './Register';
import Update from './Update';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function App() {

  useEffect(()=>{
    var token = window.localStorage.getItem("authkey");
    getRole(token);
  },[]);

  const classes = useStyles();

  const [start, setStart] = useState(0);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateEmail = (event) => {
    setEmail(event.target.value);
  }

  const updatePassword = (event) => {
    setPassword(event.target.value);
  }

  const logIn = async () => {
    const response = await fetch(serverURL.concat("login"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },   
      body: JSON.stringify({  email: email, 
                              password: password
                              })
    });

    setEmail("");
    setPassword("");
    
    const data = await response.text();
    console.log(data);
    if (data=="Invalid"){
      console.log("invalid");
    }else{
      window.localStorage.setItem("authkey", data);
      getRole(data);
    }
  }

  const getRole = async (token) => {
    console.log("validate token");
    const response = await fetch(serverURL.concat("auth"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },   
      body: JSON.stringify({ token: token })
    });

    const data = await response.text();
    console.log(data);
    if (data=="Invalid token"){
      console.log("Invalid token");
    }else if(data=="Signature expired"){
      setRole("");
    }else{
      setRole(data);
    }
  }


  const authenticated = () => {
    if (role=="admin"){
      return (
        <Router>
            <Nav/>
              <Switch>
                <Route path="/" exact render={(props) => <Dashboard {...props} userrole={role} />}/>
                <Route path="/register" component={Register}/>
                <Route path="/update" component={Update}/>
              </Switch>
        </Router>
        )
    } else if (role=="general"){
      return (<Dashboard userrole={role}/>)
    } else {
      return(<Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange = {updateEmail}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange = {updatePassword}
            autoComplete="current-password"
          />
    
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={logIn}
            className={classes.submit}
          >
            Sign In
          </Button>
      </div>
    </Container>)
    }
    
  };
  
  return (
    <div>{authenticated()}</div>
  );
}

export default App;