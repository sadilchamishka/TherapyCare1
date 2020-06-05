import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

import Entry from './Entry';
import './App.css';

function App() {

  const [supportCategoryList, setSupportCategoryList] = useState([]);
  const [goalsList, setgoalsList] = useState([]);

  const [supportItemList, setSupportItemList] = useState([]);
  const [supportCategory, setSupportCategory] = useState('');

  const [supportItem, setSupportItem] = useState('');
  const [itemDetails, setitemDetails] = useState('');
  const [cart, setCart] = useState([]);
  const [entry,setEntry] = useState([]);
  const [hoursperWeek,setHoursPerWeek] = useState(0);
  const [duration,setDuration] = useState(0);

  const [tempGoal,setTempGoal] = useState("");
  const [customGoal,setCustomGoal] = useState("");

  const [hoursPerWeekList,sethoursPerWeekList] = useState([]);
  const [durationList,setDurationList] = useState([]);

  const [attacheLocalGoalList,setAttachedLocalGoalList] = useState([]);
  const [attachedGoalList,setAttachedGoalList] = useState([]);



  useEffect(()=>{
    getSupportCategoryList();
  },[]);

  useEffect(()=>{
    getGoalsList();
  },[]);

  useEffect(()=>{
    setSupportCategory(supportCategoryList[0]);
  },[supportCategoryList]);

  useEffect(()=>{
    setTempGoal(goalsList[0]);
  },[goalsList]);

  useEffect(()=>{
    getSupportItemList();
  },[supportCategory]);

  useEffect(()=>{
    setSupportItem(supportItemList[0]);
  },[supportItemList]);

  useEffect(()=>{
    getSupportItemDetails();
  },[supportItem]);

  useEffect(()=>{
    setEntry(cart);
  },[cart]);

  useEffect(()=>{
    setDuration("");
  },[durationList]);

  useEffect(()=>{
    setHoursPerWeek("");
  },[hoursPerWeekList]);

  
  const getSupportCategoryList = async ()=>{
    const response = await fetch("https://therapycare.herokuapp.com/supportcategoryname");
    const data = await response.json();
    setSupportCategoryList(data.SupportCategoryName);
  };

  const getGoalsList = async ()=>{
    const response = await fetch("https://therapycare.herokuapp.com/goals");
    const data = await response.json();
    setgoalsList(data.goals);
  };
  
  const getSupportItemList = async ()=>{
    const response = await fetch(`https://therapycare.herokuapp.com/supportitemname?supportcategoryname=${supportCategory}`);
    const data = await response.json();
    var items = [];
    var index = 0;
    
    data.SupportItem.map(item => {
      items[index] = item.ItemName;
      index = index + 1;
    });

    setSupportItemList(items);
  };

  const getSupportItemDetails = async ()=>{
    const response = await fetch(`https://therapycare.herokuapp.com/supportitemdetails?supportitem=${supportItem}`);
    const data = await response.text();
    setitemDetails(data);
  }

  const supportCategoryChange = (event) => {
    setSupportCategory(event.target.value);
  }

  const supportItemChange = (event) => {
    setSupportItem(event.target.value);
    getSupportItemDetails();
  }


  const addToCart = (event) => {

      if (hoursperWeek==""){
        alert("Please add Hours");
      }
      else if (duration==""){
        alert("Please add Duartion");
      }
      else{
        if (hoursperWeek == parseInt(hoursperWeek, 10)){

          if (duration == parseInt(duration, 10)){
            setDurationList(durationList.concat(duration));
            sethoursPerWeekList(hoursPerWeekList.concat(hoursperWeek));
            setCart(cart.concat([JSON.parse(itemDetails)]));
            setAttachedGoalList(attachedGoalList.concat([attacheLocalGoalList]));
            setAttachedLocalGoalList([]);
          }
          else{ alert("Duration should be an integer"); }
          
        }
        else{ alert("Hours should be an integer");}
        
      }    
  }

  const updateHoursPerWeek = (event) => {
    setHoursPerWeek(event.target.value);
  }

  const updatDuration =(event) => {
    setDuration(event.target.value);
  }

  const addGoal = (event) => {
    setTempGoal(event.target.value);
  }

  const addCustomGoal = (event) => {
    setCustomGoal(event.target.value);
  }

  const attachGoal = (event) =>{
    if (tempGoal===""){
      alert("No Goal set");
    }else{
      setAttachedLocalGoalList(attacheLocalGoalList.concat(tempGoal));
      alert("Successfully attached the goal: ".concat(tempGoal));
      setTempGoal("");
    }
  }

  const attachCustomGoal = (event) =>{
    if (customGoal===""){
      alert("No Goal set");
    }else{
      setAttachedLocalGoalList(attacheLocalGoalList.concat(customGoal));
      alert("Successfully attached custom goal: ".concat(customGoal));
      setCustomGoal("");
    }
  }

  const createWordDoc = async (event) => {
    
    fetch('https://therapycare.herokuapp.com/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },   
      body: JSON.stringify({ data: entry, hoursperweek: hoursPerWeekList, duration: durationList, goals: attachedGoalList })
    }).then(response => {
              response.blob().then(blob => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = 'summery.docx';
              a.click();
          });
    });
    
    setCart([]);
    setAttachedGoalList([]);
  }

  return (
    <div className="App">
    <br></br><br></br>
      <div>
        <label><b>Select Support Category :</b>  </label>
        <select value={supportCategory} onChange={supportCategoryChange}>
        {supportCategoryList.map(category =>(
          <option value={category}>{category}</option>
        ))}
        </select>
      </div>
      <br></br>
      <div>
        <label> <b>Select Support Item : </b></label>
        <select value={supportItem} onChange={supportItemChange}>
        {supportItemList.map(item =>(
          <option value={item}>{item}</option>
        ))}
        </select>
      </div>
      <div>
      <br/>
      <label> <b>Hours per Week:</b> </label>
      <input type="text" value={hoursperWeek} onChange={updateHoursPerWeek} placeholder="0"></input>

      <label> <b>Duration:</b> </label>
      <input type="text" value={duration} onChange={updatDuration} placeholder="0"></input>
      </div>
      <br></br>
      <div>
        <label> <b>Select Goal :</b></label>
          <select className="goal" value={tempGoal} onChange={addGoal}>
          {goalsList.map(item =>(
            <option value={item}>{item}</option>
          ))}
          </select>

          <Button onClick={attachGoal} variant="outlined" color="primary"> Attach Goal </Button>
      </div>
            <br></br>
      <div>
      <label> <b>Add Custom Goals:</b> </label>
      <input type="text" onChange={addCustomGoal} value={customGoal}></input>
      <Button onClick={attachCustomGoal} variant="outlined" color="primary"> Attach Custom Goal </Button>
      </div>
      
      <br/>
      <div>
      <Button onClick={addToCart} variant="contained" color="primary"> Add </Button>
      </div>
      <br/>
      <div>
        <br/>
        <div align="left">
        <label className="label"> <b>supportCategory</b> </label>
        <label className="label"> <b>supportItemNumber</b> </label>
        <label className="label"> <b>SupportItemName</b>  </label>
        <label className="label"> <b>HoursPerWeek</b> </label>
        <label className="label"> <b>duration</b> </label>
        <label className="label"> <b>price</b> </label>
        </div>
        <br></br>
        {entry.map((item,i) =>(
          <Entry
          supportCategory={item.SupportCategoryName}
          supportItemNumber={item.SupportItemNumber}
          SupportItemName={item.SupportItemName}
          HoursPerWeek={hoursPerWeekList[i]}
          duration={durationList[i]}
          price={item.Price*hoursPerWeekList[i]*durationList[i]*4}
          />
        ))}
      </div>  
      
      <div>
      <Button onClick={createWordDoc} variant="contained" color="primary"> Submit </Button>
      </div>

    </div>
  );
}

export default App;