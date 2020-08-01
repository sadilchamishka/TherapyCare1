import React, { useEffect, useState } from 'react';

import Dashboard from './Dashboard';
import Nav from './Nav';
import Register from './Register';
import Update from './Update';
import Setting from './Setting';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { green } from '@material-ui/core/colors';

const serverURL = "https://therapycare.herokuapp.com/";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[400],
    '&:hover': {
      backgroundColor: green[800],
    },
  },
}))(Button);

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

  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const updateName = (event) => {
    setName(event.target.value);
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
      body: JSON.stringify({  name: name, 
                              password: password
                              })
    });

    setName("");
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

  const logout = ()=>{
    localStorage.removeItem("authkey");
    window.location.reload();
  }
  
  const authenticated = () => {
    if (role=="admin"){
      return (
        <Router>
            <Nav/>
              <Switch>
                <Route path="/" exact component={Dashboard}/>
                <Route path="/register" component={Register}/>
                <Route path="/update" component={Update}/>
                <Route path="/setting" component={Setting}/>
              </Switch>
        </Router>
        )
    } else if (role=="general"){
      return (<div>
                <div align="right"><i onClick={logout} class="fa fa-sign-out" style = {{fontSize:40}}></i></div>
                <Dashboard/>
            </div>)
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
            id="name"
            label="User Name"
            name="name"
            onChange = {updateName}
            autoComplete="name"
            autoFocus
            value={name}
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
            value={password}
          />
    
          <ColorButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={logIn}
            className={classes.submit}
          >
            Sign In
          </ColorButton>
      </div>
    </Container>)
    }
    
  };
  
  return (
    <div>{authenticated()}</div>
  );
}

export default App;