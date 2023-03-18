import {React, useState} from "react";


function Input(props){
        
    let inputValue = props.value;
    if(props.value === undefined) inputValue = "";
    
    const [classes, setClasses] = useState("input-text")

    if(props.classes) setClasses("input-text "+props.classes);

    
    

    return(
        <label className="input-label">
            <span>{props.label}</span>
            <input
                className={classes}
                id={props.id}
                placeholder={props.placeholder}
                defaultValue={inputValue}
                type={props.type}
                step={props.steps}
                onChange={ (e) => { 
                    props.onChangeHandler(e.target.value)
                }}
                onKeyUp={ (e) => { 
                    if(props.onKeyUpHandler){
                        props.onKeyUpHandler(e.target.value)
                    }
                }}
                
                />
        </label>
    )
}

export default Input;