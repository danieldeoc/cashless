import {React, useState} from "react";


function Input(props){
    const [inputValue, setInputValue] = useState(props.value);
    if( props.type == "number"){
        const steps = "steps='0.01'"
    } else {
        const steps = " "
    }
    return(
        <label>
            {props.label}
            <input
                id={props.id}
                placeholder={props.placeholder}
                value={inputValue}
                type={props.type}
                step={props.steps}
                onChange={ (e) => { 
                    setInputValue(e.target.value);
                    props.onChangeHandler(e.target.value)
                }}
                onKeyUp={ (e) => {
                    props.onKeyUpHandler(e.target.value)
                }}
                />
        </label>
    )
}

export default Input;