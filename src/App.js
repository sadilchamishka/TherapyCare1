import React, { useEffect, useState } from 'react';
import {Button,Select,MenuItem,TextField,InputLabel,FormControl,Input,Checkbox,Icon} from '@material-ui/core';
import {TableContainer,Table,TableCell,TableHead,TableRow,TableBody} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

import './App.css';
import {withStyles,makeStyles} from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const serverURL = "http://ec2-3-17-142-114.us-east-2.compute.amazonaws.com:5000/";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[400],
    '&:hover': {
      backgroundColor: green[800],
    },
  },
}))(Button);


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


const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

// Styling for papar blocks and table
const useStyles = makeStyles((theme) => ({
  icon: {
    '& > span': {
      margin: theme.spacing(2),
    },
  },

  margin: {
    margin: theme.spacing(1),
  },
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
    maxWidth: 700,
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

  const [setting, setSetting] = useState(false);
  const [showTable, setShowTable] = useState(0);

  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);


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
  const [customGoalList,setCustomGoalList] = useState([]);
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
    const response = await fetch(serverURL.concat("supportcategoryname"));
    const data = await response.json();
    setSupportCategoryList(data.SupportCategoryName);
  };


  // Fetch goals from backend
  const getGoalsList = async ()=>{
    const response = await fetch(serverURL.concat("goals"));

    const data = await response.json();
    setgoalsList(data.goals);

    var dict = [];

    data.goals.map(goal=>{
      dict.push({label:Object.keys(goal),value:goal[Object.keys(goal)[0]]});
    });

    setOptions(dict);
  };
  // Fetch policies from backend
  const getPolicyList = async ()=>{
    const response = await fetch(serverURL.concat("policy"));
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
    const response = await fetch(serverURL.concat(`supportitemname?supportcategoryname=${supportCategory}`));
    const data = await response.json();
    setSupportItemList(data.SupportItem);
  };

  // Fetch support item details for corresponding item from the back end
  const getSupportItemDetails = async ()=>{
    const response = await fetch(serverURL.concat(`supportitemdetails?supportitem=${supportItem}&supportcategoryname=${supportCategory}`));
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

      setShowTable(0);

      var policies = "";
      for (var i = 0; i < selectedPolicies.length; i++) {
        if (selectedPolicies[i]==1){
          policies = policies.concat(policyList[i]).concat("\n");
        }
      }

      fetch(serverURL.concat("document"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },   
        body: JSON.stringify({  data: cart, 
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
      setDuration(0);
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
    var date1 = new Date(endDate);
    var date2 = new Date(event.target.value);
    var timeDiff = date1.getTime() - date2.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDuration(diffDays);
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
      if (hours/1==hours){
        setHoursList(hoursList.concat(hours));
        setHoursFrequencyList(hoursFrequencyList.concat(hours.toString()));
        return true
      }else{
        alert("Invalid Hours");
        return false;}
    } else {
      if (hours/1==hours){
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

      setShowTable(1);

      var allgoals = []
      value.map(g=>{
        allgoals.push(g.value);
      });

      customGoalList.map(g=>{
        allgoals.push(g);
      });

      setCart(cart.concat([JSON.parse(itemDetails)]));          // Add support item details to the cart
      setAttachedGoalList(attachedGoalList.concat([allgoals]));    // Add attached goals for the item to global list of attached goals
      setDescriptionList(descriptionList.concat(description));

      // Clear variables after successfully adding to the cart
      setValue([]);
      setCustomGoalList([]);   
      setHours("");
      setFrequency(""); 
      setDescription("");  
    }   
  }

  const deleteFromCart = (index) => {

    hoursList.splice(index,1);
    cart.splice(index,1);
    attachedGoalList.splice(index,1);
    descriptionList.splice(index,1)
    hoursFrequencyList.splice(index,1);

    setHoursList(hoursList);
    setCart(cart);
    setAttachedGoalList(attachedGoalList);
    setDescriptionList(descriptionList);
    setHoursFrequencyList(hoursFrequencyList);

    if (cart.length==0){
      setShowTable(0);
    }

    setDeleted(1);
  }

  const deleteCustomGoalList = (index) => {
    customGoalList.splice(index,1);
    setCustomGoalList(customGoalList);
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
        <div align="center">
          <TextField value={hours} label="Number of Hours" onChange={updateHours}></TextField>  &emsp;
          <TextField value={frequency} label="Number of Weeks" onChange={updateFrequency}></TextField>
        </div>
        )
    }else if (period=="Hours Per Month"){
      return (
        <div align="center">
          <TextField value={hours} label="Number of Hours" onChange={updateHours}></TextField> &emsp;
          <TextField value={frequency} label="Number of Months"  onChange={updateFrequency}></TextField>
        </div>
        )
    }else if (period=="Hours Per Plan Period"){
      return (
        <div align="center">
          <TextField value={hours} label="Number of Hours" onChange={updateHours}></TextField>
        </div>
        )
    }
    
  };

  const updateSetting = () =>{
    setSetting(true);
  }

  const viewSetting = () =>{
    if (setting){
      return (
        <div>
          <Input type="file" id="f1" variant="contained" color="primary"></Input>
          <ColorButton  onClick={addGoalFile} variant="contained" color="primary"> Add goals file </ColorButton>
          &emsp;
          <Input type="file" id="f2" variant="contained" color="primary"></Input>
          <ColorButton onClick={addData} variant="contained" color="primary"> Add support items </ColorButton>
        </div>
      )
    } else{
      return (
        <div align="right">
          <Button onClick={updateSetting} align="right"><i class="fa fa-gear" style = {{fontSize:40}}></i></Button>
        </div>
      )
    }
  }

const updateGoals = (opt) => {
  setValue(opt);
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
    setCustomGoalList(customGoalList.concat(customGoal));
    setCustomGoal("");
  }
}

const addGoalFile = () =>{
  let file = document.getElementById("f1").files[0];
  let formData = new FormData();

  formData.append("file", file);

  fetch(serverURL.concat("updategoals"), {method: "POST", body: formData});
  setSetting(false);
}

const addData = () =>{
  let file = document.getElementById("f2").files[0];
  let formData = new FormData();

  formData.append("file", file);
  
  fetch(serverURL.concat("updatedata"), {method: "POST", body: formData});
  setSetting(false);
}

  return (
    <div className="App">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
    <br></br>
    {viewSetting()}
    <Grid>
        <Paper className={classes.paper1}>
          <TextField value={participantName} label="Participant Name" onChange={updateParticipantName}></TextField> &emsp;
           <TextField value={ndis} label="NDIS number" onChange={updateNDIS}></TextField> &emsp;
          <TextField value={sosPrepared} label="SOS Prepared by" onChange={updatePreparedBy}></TextField> &emsp;
          <label>Start Date</label>
          <Input value={startDate} className="date" type="date" onChange={updateStartDate}/>  &emsp;
          <label>End Date</label>
          <Input value={endDate} className="date" type="date" onChange={updateEndDate}/> &emsp;
        </Paper>
    </Grid>
    <br></br> 
    <Grid>
      <Paper className={classes.paper1}>
      <div align="center">
      <FormControl className="d">
            <label><b>Select Support Category :</b></label>
            <Select className="dropdown" value={supportCategory} onChange={supportCategoryChange} variant="outlined">
            {supportCategoryList.map(category =>(
              <MenuItem value={category}>{category}</MenuItem>
            ))}
            </Select>
        </FormControl>        
      <FormControl>
            <label><b>Select Support Item :</b></label>
            <Select className="dropdown" value={supportItem} onChange={supportItemChange} variant="outlined">
            {supportItemList.map(item =>(
              <MenuItem className="special" value={item}>{item}</MenuItem>
            ))}
            </Select>
         <br></br>   
      </FormControl>
      </div>
      <div align="center">
          <Select className="textfield1" onChange={setPeriodCategory} value={period} variant="outlined">
            <MenuItem className="special" value="Hours Per Week">Hours Per Week</MenuItem>
            <MenuItem className="special" value="Hours Per Month">Hours Per Month</MenuItem>
            <MenuItem className="special" value="Hours Per Plan Period">Hours Per Plan Period</MenuItem>
          </Select>
      </div>
      {timeDiv()}
    </Paper>
  </Grid>
  <br></br> 
  <Grid>
      <Paper className={classes.paper2}>
        <label><b>Add Goals</b></label> &emsp; 
        <FormControl>
          <ReactMultiSelectCheckboxes  width={502} value={value} onChange={updateGoals} options={options} />
          <br></br>
        </FormControl>
      <div>
        <TextField className="textarea" label="Add Custom Goals" onChange={addCustomGoal} value={customGoal} variant="outlined" multiline></TextField> &emsp;
        <Button className={classes.icon} align="right"><Icon onClick={attachCustomGoal} style={{ color: green[500],fontSize: 30 }}>add_circle</Icon></Button>
        
        {customGoalList.map((item,i) => (
            <div>
              <Button value={i} onClick={()=>deleteCustomGoalList(i)}><DeleteIcon color="secondary"/></Button>
              <label>{item}</label>
            </div>   
        ))}
        </div>
      <br></br>
    </Paper>
  </Grid>
  <br></br>
  <Grid>
      <Paper className={classes.paper2}>
        <div>
          <TextField label="Add Description" value={description} className="textarea" onChange={updateDescription} variant="outlined" multiline/>
        </div>
      </Paper>
  </Grid>
      <br></br> 
      <div>
        <ColorButton onClick={addToCart} variant="contained" color="primary"> Add Entry </ColorButton>
        </div>
      <br/>
      
      {showTable == 0 ? (
        <div></div>
      ) : (
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
              <Button value={i} onClick={()=>deleteFromCart(i)}><DeleteIcon color="secondary"/></Button>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      )}

      {policyList.map((policy,i)=>(
        <div className="policy">
        <li><label>{policy}</label>
          <GreenCheckbox
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
      <br></br>
      <ColorButton onClick={createWordDoc} variant="contained" color="primary"> Submit </ColorButton>
      </div>
      <br></br>
    </div>
    
  );
}

export default App;