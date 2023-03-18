import React, { useRef, useState, forwardRef  } from "react";


function SelectBox(props){
    
    const waiter = <option>Wait...</option>;
    const selectOptions = [];
    const [id, setId] = useState(props.id);

    const selectRef = useRef()
    
    let classes = "input-select ";
    if(props.classes) classes = classes+props.classes;
    
    if(props.defaultOption){
        selectOptions.push(props.defaultOption)
    }

    if(props.options !== undefined ){
        let defineOptions;
        if(typeof props.options === "string"){
            defineOptions = [props.options]
        }  else {
            defineOptions = props.options
        }
        defineOptions.forEach(key => {
            selectOptions.push(key)
        });
    } else {
        console.warn("Props options is undefined, or its not an array or it was not loaded yet")
    } 


    return(
        <label className="input-label select-input">
            <span>{props.label}</span>
            <select 
                className={classes}
                id={id}
                ref={selectRef}
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