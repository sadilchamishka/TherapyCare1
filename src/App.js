import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [supportCategoryList, setSupportCategoryList] = useState([]);
  const [supportItemList, setSupportItemList] = useState([]);
  const [supportCategory, setSupportCategory] = useState('');
  const [supportItem, setSupportItem] = useState('');
  const [itemDetails, setitemDetails] = useState('');


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

  return (
    <div className="App">
      <div>
        <select value={supportCategory} onChange={supportCategoryChange}>
        {supportCategoryList.map(category =>(
          <option value={category}>{category}</option>
        ))}
        </select>
      </div>
      
      <div>
        <select value={supportItemList[0]} onChange={supportItemChange}>
        {supportItemList.map(item =>(
          <option value={item}>{item}</option>
        ))}
        </select>
      </div>
      
      <div>
      <p>{itemDetails}</p>
      </div>

    </div>
  );
}

export default App;
