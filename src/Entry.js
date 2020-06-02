import React from 'react';

import './Entry.css';

const Entry = ({supportCategory,supportItemNumber,SupportItemName,price}) => {
    return(
        <div className="entry">
         <p>{supportCategory}</p>
         <p>{supportItemNumber}</p>
         <p>{SupportItemName}</p>
         <p>{price}</p>
        </div>
    );
};

export default Entry;