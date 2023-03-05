import {React, useState} from "react";


function Input(props){
    const [inputValue, setInputValue] = useState(props.value);
    return(
        <label>
            {props.label}
            <input
                id={props.id}
                placeholder={props.placeholder}
                value={inputValue}
                onChange={ (e) => { 
                    setInputValue(e.target.value);
                    props.onChangeHandler(e.target.value)
                }}
                />
        </label>
    )
}

export default Input;