import React, {useState } from 'react';
import TextField from '@material-ui/core/TextField';
import {Button, Grid} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const serverURL = "https://therapycare.herokuapp.com/";

export default function User({useremail,name,role}) {

    const useStyles = makeStyles((theme) => ({
      paper: {
        maxWidth: 700,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    }));

    const classes = useStyles();

    const [email, setEmail] = useState(useremail);
    const [userrole, setuserRole] = useState(role);
    const [password, setPassword] = useState("");
    
    const updateUserProfile = async () => {
        var token = window.localStorage.getItem("authkey");
        const response = await fetch(serverURL.concat("updateuser"), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },   
          body: JSON.stringify({  email: email,
                                  name:name, 
                                  password: password,
                                  token:token
                                  })
        });        
      };
    
    const deleteUserProfile = async () => {
    var token = window.localStorage.getItem("authkey");
    const response = await fetch(serverURL.concat("deleteuser"), {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },   
        body: JSON.stringify({  name: name, 
                                token:token
                                })
       });        
    };
      
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleEditClose = () => {setOpenEdit(false);};
    const handleDeleteClose = () => {setOpenDelete(false);};


    const changeEmail = (event)=> {
        setEmail(event.target.value);
    };

    const changePassword = (event)=> {
        setPassword(event.target.value);
    };

    const editUserDetails = ()=> {
        setOpenEdit(true);
    };

    const deleteUserDetails = ()=> {
        setOpenDelete(true);
    };

    const allowEdit = ()=> {
        setOpenEdit(false);
        updateUserProfile();
    };

    const blockEdit = ()=> {
        setOpenEdit(false);
    };

    const allowDelete = ()=> {
        setOpenDelete(false);
        deleteUserProfile();
    };

    const blockDelete = ()=> {
        setOpenDelete(false);
    };

    const adminDeleteButton = ()=> {
        if (userrole=="general"){
            return (<Button onClick={deleteUserDetails}><DeleteIcon color="secondary"/></Button>)
        }
    };

  return (
    <div>
          <Grid container spacing={4}>
              &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;
              <Grid item xs={2}>
                <Paper className={classes.paper}><TextField style = {{width: 200}} value={name}/></Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper className={classes.paper}><TextField style = {{width: 350}} value={email}  onChange = {changeEmail}/></Paper>
              </Grid>
              <Grid item xs={2}>
                <Paper className={classes.paper}><TextField type="password" value={password}  onChange = {changePassword}/></Paper>
              </Grid>
              <Button onClick={editUserDetails}><CreateIcon color="primary"/></Button>
              {adminDeleteButton()}
        </Grid>
        <br></br>
        
        <Dialog
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby="edit-dialog-title"
            aria-describedby="edit-dialog-description">
        
            <DialogTitle id="edit-dialog-title">{"Edit user profile"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="edit-dialog-description">
                Genaral user {name} profile will be updated
            </DialogContentText>
            </DialogContent>
        <DialogActions>
          <Button onClick={blockEdit} color="primary">
            No
          </Button>
          <Button onClick={allowEdit} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
        </Dialog>

        <Dialog
            open={openDelete}
            onClose={handleDeleteClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description">
        
            <DialogTitle id="delete-dialog-title">{"Delete user profile"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="delete-dialog-description">
                Genaral user {name} profile will be deleted
            </DialogContentText>
            </DialogContent>
        <DialogActions>
          <Button onClick={blockDelete} color="primary">
            No
          </Button>
          <Button onClick={allowDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
        </Dialog>
    </div>
  );
}