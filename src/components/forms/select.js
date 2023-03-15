import React, { useState } from "react";


function SelectBox(props){
    
    if(props.options !== undefined){
        var options = props.options.map( (option, i) => (
            <option key={i}>{option}</option>
        ))
    } else if( props.options === undefined || props.options[0] == "Wait")   {
        var options =  <option>No options</option>;
    } else {
        var options =  <option>Wait...</option>;
    }
    return(
        <label>
            {props.label}
            <select 
                value={props.value}
                onChange={ (e) => { 
                    
                    props.onChangeHandler(e.target.value)
                }}>
                {options}
            </select>
        </label>
    )
}

export default SelectBox;