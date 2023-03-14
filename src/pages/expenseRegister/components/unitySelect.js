import React, { useContext, useEffect, useRef, useState } from "react";

import { ExpenseContext } from "..";

function UnitSelect(props){
    const { unitsCatalog } = useContext(ExpenseContext)
    
    const [unitsOptions, setUnitsOptions] = useState([]);
    const productAmmountType = useRef();


    ////////////
    // updates in catalog unit
    const pageUpdates = useEffect( () => {
        if(unitsCatalog !== undefined){
            setUnitsOptions(
                unitsCatalog.map( (key, i) => (
                    <option key={i}>{key}</option>
                ))
            )
        }    
    }, [unitsCatalog])


    return(
        <label>
            Product Ammount Type:
            <select 
                ref={productAmmountType}
                onChange={ (e) => {
                    props.onChangeHandler( productAmmountType.current.value)
                }} >
                {unitsOptions}
            </select>
        </label>
    )
}
export default UnitSelect;