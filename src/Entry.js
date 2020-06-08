import React from 'react';
import {Button} from '@material-ui/core';
import './Entry.css';

const Entry = ({supportCategory,supportItemNumber,SupportItemName,HoursPerWeek,duration,goals,price,index,deleteFunction}) => {
    return(
        <div className="entry">
         <p>{supportCategory}</p>
         <p>{supportItemNumber}</p>
         <p>{SupportItemName}</p>
         <p>{HoursPerWeek}</p>
         <p>{duration}</p>
         <p>{goals}</p>
         <p>{price}</p>
         <Button onClick={()=> deleteFunction(index)} variant="contained" color="secondary">Drop</Button>
        </div>
    );
};

export default Entry;