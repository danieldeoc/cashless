import React, { useRef } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

function Alert(props){

    const alertBox = useRef();
    
    let message = props.message;
    if(!message) message= "Undefined message";

    let classes = "alert-message";
    if(props.classes) classes = classes+" "+props.classes;

    let display = props.display;
    if(!display) display = false
    if(display){
        setTimeout( () => {
            alertBox.current.classList.add("display")
            setTimeout( () => {
                if(alertBox){
                    alertBox.current.classList.remove("display")
                }
            }, 3000)
        }, 1000)
    }
    
    

    function hideAlert(){
        setTimeout( () => {
            alertBox.current.classList.remove("display")
        }, 100)
    }
    return(
        <div
            id="randomMessage" 
            ref={alertBox}
            className={classes}>
            {message}
            <span onClick={hideAlert}>
                <FontAwesomeIcon icon={faX} />
            </span>
        </div>
    )
}

export default Alert;