import React from "react";
import PrimaryButton from "../buttons/primaryButton";

function ConfirmDialog(props){

    let message = props.message;
    if(!message) message = "Do you want to confirm this action?";

    return(
        <div className="window-overlay">
            <div className="confirm-dialog">
                <p>{message}</p>
                <PrimaryButton classes="red" label="Yes" onClickHandler={props.onConfirmHandler} />
                <PrimaryButton classes="green" label="No" onClickHandler={props.onDenyHandle} />
            </div>
        </div>
    )
}

export default ConfirmDialog;