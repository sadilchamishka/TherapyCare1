import React from 'react';

import './Entry.css';

const Entry = ({supportCategory,supportItemNumber,SupportItemName,HoursPerWeek,duration,price}) => {
    return(
        <div className="entry">
         <p>{supportCategory}</p>
         <p>{supportItemNumber}</p>
         <p>{SupportItemName}</p>
         <p>{HoursPerWeek}</p>
         <p>{duration}</p>
         <p>{price}</p>
        </div>
    );
};

export default Entry;