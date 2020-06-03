import React, { useEffect, useState } from 'react';
import Entry from './Entry';
import './App.css';

function App() {

  const [supportCategoryList, setSupportCategoryList] = useState([]);
  const [supportItemList, setSupportItemList] = useState([]);
  const [supportCategory, setSupportCategory] = useState('');
  const [supportItem, setSupportItem] = useState('');
  const [itemDetails, setitemDetails] = useState('');
  const [cart, setCart] = useState([]);
  const [entry,setEntry] = useState([]);
  const [hoursperWeek,setHoursPerWeek] = useState("");
  const [duration,setDuration] = useState("");

  const [hoursPerWeekList,sethoursPerWeekList] = useState([]);
  const [durationList,setDurationList] = useState([]);


  useEffect(()=>{
    getSupportCategoryList();
  },[]);

  useEffect(()=>{
    setSupportCategory(supportCategoryList[0]);
  },[supportCategoryList]);

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

  const getSupportItemList = async ()=>{
    const response = await fetch(`https://therapycare.herokuapp.com/supportitemname?supportcategoryname=${supportCategory}`);
    const data = await response.json();
    var items = new Array();
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
    console.log(data);
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
    var obj = JSON.parse(itemDetails);
    if (obj.Price==0){
      setDurationList(durationList.concat(0));
      sethoursPerWeekList(hoursPerWeekList.concat(0));
      setCart(cart.concat([obj]));
    }
    else{
      if (hoursperWeek==""){
        alert("Please add Hours");
      }else{
        setDurationList(durationList.concat(duration));
        sethoursPerWeekList(hoursPerWeekList.concat(hoursperWeek));
        setCart(cart.concat([obj]));
      }
    }
    
  }

  const updateHoursPerWeek =(event) => {
    var data = event.target.value;
    if (data == parseInt(data, 10)){setHoursPerWeek(data);}
    else{ alert("Hours should be an integer");}
  }

  const updatDuration =(event) => {
    var data = event.target.value;
    setDuration(data);
  }

  const createWordDoc = async (event) => {
    
    fetch('https://therapycare.herokuapp.com/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },   
      body: JSON.stringify({ data: entry, hoursperweek: hoursPerWeekList, duration: durationList })
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
  }

  return (
    <div className="App">
      <h1>TherapyCare</h1>
      <div>
        <label> Select Support Category : </label>
        <select value={supportCategory} onChange={supportCategoryChange}>
        {supportCategoryList.map(category =>(
          <option value={category}>{category}</option>
        ))}
        </select>
      </div>
      
      <div>
        <label> Select Support Item : </label>
        <select value={supportItem} onChange={supportItemChange}>
        {supportItemList.map(item =>(
          <option value={item}>{item}</option>
        ))}
        </select>
      </div>
      <br/>
      <div>
      <textarea value={itemDetails} rows="3" cols="100"></textarea>
      <br/><br></br>
      <label> Hours per Week: </label>
      <input type="text" value={hoursperWeek} onChange={updateHoursPerWeek}></input>

      <label> Duration: </label>
      <input type="text" value={duration} onChange={updatDuration}></input>
      </div>
      <br/>
      <div>
          <button onClick={addToCart}>Add</button>
      </div>
      <br/>
      <div>
        <br/>
        <div align="left">
        <label className="label"> supportCategory </label>
        <label className="label"> supportItemNumber </label>
        <label className="label"> SupportItemName  </label>
        <label className="label"> HoursPerWeek </label>
        <label className="label"> duration </label>
        <label className="label"> price </label>
        </div>
        
        {entry.map((item,i) =>(
          <Entry
          supportCategory={item.SupportCategoryName}
          supportItemNumber={item.SupportItemNumber}
          SupportItemName={item.SupportItemName}
          HoursPerWeek={hoursPerWeekList[i]}
          duration={durationList[i]}
          price={item.Price*hoursPerWeekList[i]*durationList[i]}
          />
        ))}
      </div>  
      
      <div>
          <button onClick={createWordDoc}>Submit</button>
      </div>

    </div>
  );
}

export default App;