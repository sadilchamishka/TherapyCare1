import React, { useEffect, useState } from 'react';
import {Button,Select,MenuItem,TextField,InputLabel,FormControl,Input,Checkbox} from '@material-ui/core';
import Entry from './Entry';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  paper1: {
    maxWidth: 1200,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    textAlign: 'right',
    color: theme.palette.text.secondary,
  },
  paper2: {
    maxWidth: 750,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  paper3: {
    maxWidth: 1150,
    margin: `${theme.spacing(1)}px 25px`,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
}));


function App() {
  const classes = useStyles();

  const [supportCategoryList, setSupportCategoryList] = useState([]); // List of support category names from back end
  const [supportCategory, setSupportCategory] = useState('');         // selected current support category

  const [supportItemList, setSupportItemList] = useState([]);         // list of support item names from back end
  const [supportItem, setSupportItem] = useState('');                 // selected support item name 

  const [itemDetails, setitemDetails] = useState('');                 // Details of the selected item from back end

  const [goalsList, setgoalsList] = useState([]);                     // List of goals recived from back end
  const [policyList, setPolicyList] = useState([]);                   // List of policies recived from back end
  const [selectedPolicies,setSelectedPolicies] = useState([]);

  const [period, setPeriod] = useState("Hours Per Week");            // set period type to hours per week by default
  const [hours,setHours] = useState("");                              // number of hours per week or per month
  const [frequency,setFrequency] = useState("");                      // number of weeks or months
  const [hoursList,setHoursList] = useState([]);                     // hours list for each entry

  const [cart, setCart] = useState([]);                              // Cart holds all the entries user made

  const [goals, setGoals] = useState([]);                            // User selected goals for a support item
  const [customGoal,setCustomGoal] = useState("");                   // Custom goal the user wants attach
  const [attachedGoalList,setAttachedGoalList] = useState([]);       // All the goals user has attached for each support items

  const [description, setDescription] = useState("");
  const [descriptionList, setDescriptionList] = useState([]);


  const [participantName, setParticipantName] = useState("");  
  const [ndis, setNdis] = useState("");                              
  const [sosPrepared, setSosPrepared] = useState("");  
  const [startDate, setStartDate] = useState("");                              
  const [endDate, setEndDate] = useState("");    
  const [duration, setDuration] = useState("");                              
                          
  const [deleted, setDeleted] = useState(0);                        
                            


  // When the page loads, support category names and goals are fetching from the backend
  useEffect(()=>{
    getSupportCategoryList();
    getGoalsList();
    getPolicyList();
  },[]);

  // After support category list is set, the first element is taken as choosen support category
  useEffect(()=>{
    setSupportCategory(supportCategoryList[0]);
  },[supportCategoryList]);

  // When support category is set, start to fetch support items related to it
  useEffect(()=>{
    getSupportItemList();
  },[supportCategory]);

  // After support item list is arrived, the first element is taken as choosen item
  useEffect(()=>{
    setSupportItem(supportItemList[0]);
  },[supportItemList]);

  // When item is set, start to fetch support item details from the back end
  useEffect(()=>{
    getSupportItemDetails();
  },[supportItem]);

  useEffect(()=>{
    checkDeleted();
  },[deleted]);

  const checkDeleted = ()=>{
     if (deleted==1){
       alert("Item Deleted");
       setDeleted(0);
     }
  }

  // Fetch support category names from back end
  const getSupportCategoryList = async ()=>{
    const response = await fetch("https://therapycare.herokuapp.com/supportcategoryname");
    const data = await response.json();
    setSupportCategoryList(data.SupportCategoryName);
  };

  // Fetch goals from backend
  const getGoalsList = async ()=>{
    const response = await fetch("https://therapycare.herokuapp.com/goals");
    const data = await response.json();
    setgoalsList(data.goals);
  };

  // Fetch policies from backend
  const getPolicyList = async ()=>{
    const response = await fetch("https://therapycare.herokuapp.com/policy");
    const data = await response.json();
    setPolicyList(data.policy);
    var i;
    var policyId = []
    for (i = 0; i < data.policy.length; i++) {
      policyId.push(0);
    }
    
    setSelectedPolicies(policyId);
  };
  

  // Fetch supoort items corresponding to the support categroy from the back end
  const getSupportItemList = async ()=>{
    const response = await fetch(`https://therapycare.herokuapp.com/supportitemname?supportcategoryname=${supportCategory}`);
    const data = await response.json();
    setSupportItemList(data.SupportItem);
  };

  // Fetch support item details for corresponding item from the back end
  const getSupportItemDetails = async ()=>{
    const response = await fetch(`https://therapycare.herokuapp.com/supportitemdetails?supportitem=${supportItem}`);
    const data = await response.text();
    setitemDetails(data);
  }

  // Create word document
  const createWordDoc = async () => {
    var policies = "";
    for (var i = 0; i < selectedPolicies.length; i++) {
      if (selectedPolicies[i]==1){
        policies = policies.concat(policyList[i]).concat("\n");
      }
    }

    fetch('https://therapycare.herokuapp.com/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },   
      body: JSON.stringify({ data: cart, goals: attachedGoalList,description:descriptionList, hours:hoursList, start:startDate, end:endDate, duration:duration, name:participantName, ndis:ndis, sos:sosPrepared, policy:policies, today:"today1" })
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
    setHoursList([]);
  }

  const updateDescription = (event) => {
    setDescription(event.target.value);
  }

  const updateParticipantName = (event) => {
    setParticipantName(event.target.value);
  }

  const updateNDIS = (event) => {
    setNdis(event.target.value);
  }

  const updatePreparedBy = (event) => {
    setSosPrepared(event.target.value);
  }

  const updateStartDate = (event) => {
    setStartDate(event.target.value);
  }

  const updateEndDate = (event) => {
    var date1 = new Date(startDate);
    var date2 = new Date(event.target.value);
    var timeDiff = date2.getTime() - date1.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

    if (diffDays>0){
      setEndDate(event.target.value);
      setDuration(diffDays);
    }else{
      alert("Invalid End Date");
    }
  }

  // update when support category is changed from drop down menue
  const supportCategoryChange = (event) => {
    setSupportCategory(event.target.value);
  }

  // update when support item is changed from drop down menue
  const supportItemChange = (event) => {
    setSupportItem(event.target.value);
  }

  // Add entry to the cart
  const addToCart = () => {
      if (frequency==""){
        setHoursList(hoursList.concat(hours))
      }else{
        setHoursList(hoursList.concat(hours*frequency))           // Total work hours add to hours list
      }
      setCart(cart.concat([JSON.parse(itemDetails)]));          // Add support item details to the cart
      setAttachedGoalList(attachedGoalList.concat([goals]));    // Add attached goals for the item to global list of attached goals
      setDescriptionList(descriptionList.concat(description));
      // Clear variables after successfully adding to the cart
      setGoals([]);   
      setHours("");
      setFrequency(""); 
      setDescription("");  
  }

  const deleteFromCart = (index) => {
    hoursList.splice(index,1);
    cart.splice(index,1);
    attachedGoalList.splice(index,1);
    descriptionList.splice(index,1)

    setHoursList(hoursList);
    setCart(cart);
    setAttachedGoalList(attachedGoalList);
    setDescriptionList(descriptionList);

    setDeleted(1);
  }

  // Update period category when user change drop down menue
  const setPeriodCategory = (event) => {
    setPeriod(event.target.value);
  }

  // Update hours when user type number of hours
  const updateHours = (event) => {
    setHours(event.target.value);
  };
  
  // Update frequency when user type number of week or months
  const updateFrequency = (event) => {
    setFrequency(event.target.value);
  };

  const policyChange = (event) => {
    var value = selectedPolicies[event.target.value];
    if (value==0) {
      selectedPolicies[event.target.value] = 1;
    } else{
      selectedPolicies[event.target.value] = 0;
    }
    setSelectedPolicies(selectedPolicies);
  };

  // Return corresponding text boxes when user select period from drop down menue
  const timeDiv = () => {
    if (period=="Hours Per Week"){
      return (
        <div>
          <TextField value={hours} label="Number of Hours" onChange={updateHours}></TextField>  &emsp;
          <TextField value={frequency} label="Number of Weeks" onChange={updateFrequency}></TextField>
        </div>
        )
    }else if (period=="Hours Per Month"){
      return (
        <div>
          <TextField value={hours} label="Number of Hours" onChange={updateHours}></TextField> &emsp;
          <TextField value={frequency} label="Number of Months"  onChange={updateFrequency}></TextField>
        </div>
        )
    }else if (period=="Hours Per Plan Period"){
      return (
        <div>
          <TextField value={hours} label="Number of Hours" onChange={updateHours}></TextField>
        </div>
        )
    }
    
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 80;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 650
      }
    },
    getContentAnchorEl: null
  
  };

const updateGoals = (event) => {
  setGoals(event.target.value);
};

const addCustomGoal = (event) => {
  setCustomGoal(event.target.value);
}

const attachCustomGoal = (event) =>{
  if (customGoal===""){
    alert("No Goal set");
  }else{
    setGoals(goals.concat(customGoal));
    alert("Successfully attached custom goal: ".concat(customGoal));
    setCustomGoal("");
  }
}

  return (
    <div className="App">
    <br></br>
    <Grid>
        <Paper className={classes.paper1}>
          <TextField value={participantName} label="Participant Name" onChange={updateParticipantName}></TextField> &emsp;
           <TextField value={ndis} label="NDIS number" onChange={updateNDIS}></TextField> &emsp;
          <TextField value={sosPrepared} label="SOS Prepared by" onChange={updatePreparedBy}></TextField> &emsp;
          <label>Start Date</label>
          <Input value={startDate} className="textfield" type="date" onChange={updateStartDate}/>  &emsp;
          <label>End Date</label>
          <Input value={endDate} className="textfield" type="date" onChange={updateEndDate}/> &emsp;
        </Paper>
    </Grid>
    <br></br> 
    <Grid>
      <Paper className={classes.paper1}>
        <FormControl className="d">
            <InputLabel><b>Select Support Category :</b></InputLabel>
            <Select className="dropdown" value={supportCategory} onChange={supportCategoryChange} variant="outlined">
            {supportCategoryList.map(category =>(
              <MenuItem value={category}>{category}</MenuItem>
            ))}
            </Select>
        </FormControl>

        <FormControl>
          <InputLabel><b>Select Support Item :</b></InputLabel>
            <Select className="dropdown" value={supportItem} onChange={supportItemChange} variant="outlined">
            {supportItemList.map(item =>(
              <MenuItem className="special" value={item}>{item}</MenuItem>
            ))}
            </Select>
        </FormControl>
      
        <FormControl>
        <InputLabel><b>Select Period:</b></InputLabel>
          <Select className="textfield" onChange={setPeriodCategory} value={period} variant="outlined">
            <MenuItem className="special" value="Hours Per Week">Hours Per Week</MenuItem>
            <MenuItem className="special" value="Hours Per Month">Hours Per Month</MenuItem>
            <MenuItem className="special" value="Hours Per Plan Period">Hours Per Plan Period</MenuItem>
          </Select>
        </FormControl>

      {timeDiv()}
    </Paper>
  </Grid>
  <br></br> 
  <Grid>
      <Paper className={classes.paper2}>
        <FormControl>
        <InputLabel><b>Add Goals</b></InputLabel>
        <Select className="dropdown" value={goals} onChange={updateGoals} multiple MenuProps={MenuProps} variant="outlined">
            {goalsList.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      <div>
        <TextField className="textarea" label="Add Custom Goals" onChange={addCustomGoal} value={customGoal} variant="outlined" multiline></TextField> &emsp;
        <Button onClick={attachCustomGoal} variant="outlined" color="primary"> Attach Custom Goal </Button>
      </div>
        
      <br></br><br></br>
    </Paper>
  </Grid>
      <div>
        <TextField value={description} className="textarea" onChange={updateDescription} variant="outlined" multiline/>
      </div>
      <br></br><br></br>
      <div>
        <Button onClick={addToCart} variant="contained" color="primary"> Add </Button>
      </div>
      <br/>
      
      <div className="policy">
        {cart.map((item,i) =>(
          <Entry
          supportCategory={item.SupportCategoryName}
          supportItemNumber={item.SupportItemNumber}
          SupportItemName={item.SupportItemName}
          goals={attachedGoalList[i]}
          price={item.Price*hoursList[i]}
          index={i}
          deleteFunction={deleteFromCart}
          />
        ))}
      </div>  
  
      {policyList.map((policy,i)=>(
        <div className="policy">
          <label>{policy}</label>
          <Checkbox
          value={i}
          onChange={policyChange}
          color="primary"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>  
      ))}
      <br></br>
      <div>
      <Button onClick={createWordDoc} variant="contained" color="primary"> Submit </Button>
      </div>
      <br></br>
    </div>
    
  );
}

export default App;