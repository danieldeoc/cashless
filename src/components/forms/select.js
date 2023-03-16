import React, { useState } from "react";


function SelectBox(props){
    
    const waiter = <option>Wait...</option>;
    const selectOptions = [];
    const [id, setId] = useState(props.id);
    
    let classes = "input-select ";
    if(props.classes) classes = classes+props.classes;
    
    if(props.defaultOption){
        selectOptions.push(props.defaultOption)
    }

    if(props.options !== undefined ){
        props.options.forEach(key => {
            selectOptions.push(key)
        });
    } else {
        console.error("Props options is undefined, its not an array or istn loaded yet")
    } 
    
    
    

    return(
        <label className="input-label select-input">
            <span>{props.label}</span>
            <select 
                className={classes}
                id={id}
                value={props.value}
                onChange={ (e) => { 
                   props.onChangeHandler(e.target.value)
                }}>
                {selectOptions.map( (optionKey, i) => (
                    <option key={i} value={optionKey}>{optionKey}</option>  
                ))}
            </select>
        </label>
    )
}

export default SelectBox;