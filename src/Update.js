import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';

const serverURL = "https://therapycare.herokuapp.com/";

export default function Update() {

    useEffect(()=>{
        getUsers();
      },[]);

    const getUsers = async ()=>{
      const response = await fetch(serverURL.concat("users"));
      const data = await response.json();
      data.users.map((user)=>{
        setState((prevState) => {
          const data = [...prevState.data];
          data.push(user);
          return { ...prevState, data };
        });
      });
    };

    const [state, setState] = useState({
      columns: [
        { title: 'UserName', field: 'name' },
        { title: 'Email', field: 'email' },
        { title: 'Password', field: 'password'},
      ],
      data: [],
    });

    const updateUserProfile = async (newData) => {
      var token = window.localStorage.getItem("authkey");
      const response = await fetch(serverURL.concat("updateuser"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },   
        body: JSON.stringify({  email: newData.email,
                                name:newData.name, 
                                password: newData.password,
                                token:token
                                })
      });        
    };
  
  const deleteUserProfile = async (dropdata) => {
  var token = window.localStorage.getItem("authkey");
  const response = await fetch(serverURL.concat("deleteuser"), {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },   
      body: JSON.stringify({  name: dropdata[0].name, 
                              token:token
                              })
     });        
  };

    return (
        <div>
        <MaterialTable
        title=""
        columns={state.columns}
        data={state.data}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  setState((prevState) => {
                    const data = [...prevState.data];
                    updateUserProfile(newData);
                    newData.password = "";
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                setState((prevState) => {
                  const data = [...prevState.data];
                  deleteUserProfile(data.splice(data.indexOf(oldData), 1));
                  return { ...prevState, data };
                });
              }, 600);
            }),
        }}
      />
        </div>
        
    );
}