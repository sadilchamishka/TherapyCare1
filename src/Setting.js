import React from 'react';
import './Nav.css';
import {Button,Input} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const serverURL =  "https://therapycare.herokuapp.com/";

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
    paper1: {
      maxWidth: 730,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.secondary,
    }
  }));

const displayMSG = (msg) =>{
  if (msg=="Success"){
    alert("Successful");
  } else{
    alert("Failed");
  }
};
  
function Setting() {
    const classes = useStyles();

    const addGoalFile = async () =>{
        let file = document.getElementById("f1").files[0];
        let formData = new FormData();
        formData.append("file", file);
        const response = await fetch(serverURL.concat("updategoals"), {method: "POST", body: formData});
        const data = await response.text();
        displayMSG(data);
    }

    const addData = async () =>{
        let file = document.getElementById("f2").files[0];
        let formData = new FormData();
        formData.append("file", file);
        const response = await fetch(serverURL.concat("updatedata"), {method: "POST", body: formData});
        const data = await response.text();
        displayMSG(data);
    }

    const addPolicies = async () =>{
        let file = document.getElementById("f3").files[0];
        let formData = new FormData();
        formData.append("file", file);
        const response = await fetch(serverURL.concat("updatepolicy"), {method: "POST", body: formData});
        const data = await response.text();
        displayMSG(data);
    }

    return (
        <div>
        <br></br>
            <Grid>
                <Paper className={classes.paper1}>
                    <Input type="file" id="f1" color="primary"></Input>  &emsp;
                    <ColorButton style={{float: 'right'}}  onClick={addGoalFile} variant="contained" color="primary"> Add goals file </ColorButton>
                </Paper>
                <br></br>
                <Paper className={classes.paper1}>
                    <Input type="file" id="f2"  color="primary"></Input>  &emsp;
                    <ColorButton style={{float: 'right'}} onClick={addData} variant="contained" color="primary"> Add support items </ColorButton>
                </Paper>
                <br></br>
                <Paper className={classes.paper1}>
                    <Input type="file" id="f3"  color="primary"></Input>  &emsp;
                    <ColorButton style={{float: 'right'}} onClick={addPolicies} variant="contained" color="primary"> Add policies </ColorButton>
                </Paper>
            </Grid>
      </div>
    )
}

export default Setting;