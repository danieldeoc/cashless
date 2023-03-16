import React from "react";

function PrimaryButton(props){
    let classes = "btn primary ";
    if(props.classes) classes = classes+props.classes;
    
    return(
        
        <button
            className={classes}
            onClick={ (event) => {
                props.onClickHandler()
            }}>
            {props.label}
        </button>
        
    )
}

export default PrimaryButton;