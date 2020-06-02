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
  const [hours,setHours] = useState([]);
  const [hourslist,setHoursList] = useState([]);


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
    setitemDetails(data);
  }

  const supportCategoryChange = (event) => {
    setSupportCategory(event.target.value);
    getSupportItemList();
  }

  const supportItemChange = (event) => {
    setSupportItem(event.target.value);
    getSupportItemDetails();
  }


  const addToCart = (event) => {
    var obj = JSON.parse(itemDetails);
    if (obj.Price==0){
      setHoursList(hourslist.concat(0));
      setCart(cart.concat([obj]));
    }
    else{
      if (hours==""){
        alert("Please add Hours");
      }else{
        setHoursList(hourslist.concat(hours));
        setCart(cart.concat([obj]));
        setHours("");
      }
    }
    
  }

  const updateHours =(event) => {
    var data = event.target.value;
    if (data == parseInt(data, 10)){setHours(data);}
    else{ alert("Hours should be an integer");}
  }

  const createWordDoc = async (event) => {
    
    fetch('https://therapycare.herokuapp.com/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },   
      body: JSON.stringify({ data: entry })
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
        <select value={supportCategory} onChange={supportCategoryChange}>
        {supportCategoryList.map(category =>(
          <option value={category}>{category}</option>
        ))}
        </select>
      </div>
      
      <div>
        <select value={supportItem} onChange={supportItemChange}>
        {supportItemList.map(item =>(
          <option value={item}>{item}</option>
        ))}
        </select>
      </div>
      <br/>
      <div>
      <textarea value={itemDetails} rows="3" cols="100"></textarea>
      <br/>
      <label> Hours : </label>
      <input type="text" value={hours} onChange={updateHours}></input>
      </div>
      
      <div>
          <button onClick={addToCart}>Add</button>
      </div>

      <div>
      
      </div>
        {entry.map((item,i) =>(
          <Entry
          supportCategory={item.SupportCategoryName}
          supportItemNumber={item.SupportItemNumber}
          SupportItemName={item.SupportItemName}
          price={item.Price*hourslist[i]}
          />
        ))}
      <div>
          <button onClick={createWordDoc}>Submit</button>
      </div>

    </div>
  );
}

export default App;
