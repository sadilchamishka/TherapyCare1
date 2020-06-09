import React, { useEffect, useState } from 'react';
import {Button,Select,MenuItem,TextField,InputLabel,FormControl,Input,Checkbox} from '@material-ui/core';
import {TableContainer,Table,TableCell,TableHead,TableRow,TableBody} from '@material-ui/core';
import './App.css';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// Styling for table cells
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

// Styling for table raws
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

// Styling for papar blocks and table
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 800,
  },
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
  const [hoursFrequencyList,setHoursFrequencyList] = useState([]);

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

  const validateDate = ()=>{
    if (duration>0){
      return true;
    } else{
      alert("Start and End Dates Mismatching");
      return false;
    }
  }

  const getToday = ()=>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();

    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    return yyyy+'-'+mm+'-'+dd;
  }

  // Create word document
  const createWordDoc = async () => {
    
    if (validateDate()){
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
        body: JSON.stringify({ data: cart, 
                               goals: attachedGoalList,
                               description:descriptionList, 
                               hours:hoursList,
                               hoursFrequncy: hoursFrequencyList, 
                               start:startDate, 
                               end:endDate, 
                               duration:duration, 
                               name:participantName, 
                               ndis:ndis, 
                               sos:sosPrepared, 
                               policy:policies, 
                               today:getToday()})
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
      setHoursFrequencyList([]);
      setDescriptionList([]);
      setStartDate("");
      setEndDate("");
      setParticipantName("");
      setNdis("");
      setSosPrepared("");
    }
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
    setEndDate(event.target.value);
    var date1 = new Date(startDate);
    var date2 = new Date(event.target.value);
    var timeDiff = date2.getTime() - date1.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDuration(diffDays);

    
  }

  // update when support category is changed from drop down menue
  const supportCategoryChange = (event) => {
    setSupportCategory(event.target.value);
  }

  // update when support item is changed from drop down menue
  const supportItemChange = (event) => {
    setSupportItem(event.target.value);
  }

  const validateEntry = () => {
    if (period=="Hours Per Plan Period"){
      if (hours==parseInt(hours, 10)){
        setHoursList(hoursList.concat(hours));
        setHoursFrequencyList(hoursFrequencyList.concat(hours.toString()));
        return true
      }else{
        alert("Invalid Hours");
        return false;}
    } else {
      if (hours==parseInt(hours, 10)){
        if (frequency==parseInt(frequency, 10)){
          var suffix=",M";
          if (period=="Hours Per Week"){
            suffix=",W";
          }
          var data = hours.toString().concat(",").concat(frequency.toString()).concat(suffix);
          setHoursList(hoursList.concat(hours*frequency));  
          setHoursFrequencyList(hoursFrequencyList.concat(data));
          return true;  
        }else{
          alert("Invalid Number of Weeks or Months");
          return false;
        }
      }else{
        alert("Inavlid Hours");
        return false;}
    }
  }
  // Add entry to the cart
  const addToCart = () => {
    if (validateEntry()){
      setCart(cart.concat([JSON.parse(itemDetails)]));          // Add support item details to the cart
      setAttachedGoalList(attachedGoalList.concat([goals]));    // Add attached goals for the item to global list of attached goals
      setDescriptionList(descriptionList.concat(description));
      // Clear variables after successfully adding to the cart
      setGoals([]);   
      setHours("");
      setFrequency(""); 
      setDescription("");  
    }   
  }

  const deleteFromCart = (event) => {
    var index = event.target.value;
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

const updateGoals = (event) => {
  setGoals(event.target.value);
};

const addCustomGoal = (event) => {
  setCustomGoal(event.target.value);
}

const displayGoals = (goals) => {
  var golasWithSpace = "";
  for (var i = 0; i < goals.length; i++) {
    golasWithSpace = golasWithSpace.concat(goals[i]).concat(", ");
  }
  return golasWithSpace;
}

const attachCustomGoal = () =>{
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
        <Select className="dropdown" value={goals} onChange={updateGoals} multiple variant="outlined">
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
        <TextField label="Add Description" value={description} className="textarea" onChange={updateDescription} variant="outlined" multiline/>
      </div>
      <br></br><br></br>
      <div>
        <Button onClick={addToCart} variant="contained" color="primary"> Add </Button>
      </div>
      <br/>
      
      <TableContainer className={classes.paper1}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Support Category Name</StyledTableCell>
            <StyledTableCell align="center">Support Item Number</StyledTableCell>
            <StyledTableCell align="center">Support ItemName</StyledTableCell>
            <StyledTableCell align="center">Goals</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Price</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item,i) => (
            <StyledTableRow>
              <StyledTableCell align="center">{item.SupportCategoryName}</StyledTableCell>
              <StyledTableCell align="center">{item.SupportItemNumber}</StyledTableCell>
              <StyledTableCell align="center">{item.SupportItemName}</StyledTableCell>
              <StyledTableCell align="center">{displayGoals(attachedGoalList[i])}</StyledTableCell>
              <StyledTableCell align="center">{descriptionList[i]}</StyledTableCell>
              <StyledTableCell align="center">{item.Price*hoursList[i]}</StyledTableCell>
              <br></br><Button value={i} onClick={deleteFromCart} variant="contained" color="secondary">Drop</Button>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
   
      {policyList.map((policy,i)=>(
        <div className="policy">
        <li><label>{policy}</label>
          <Checkbox
          value={i}
          onChange={policyChange}
          color="primary"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </li>
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