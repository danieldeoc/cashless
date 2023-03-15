import React from "react";


function PageTitle(props){
    return(
        <h1 className="page-title">
            {props.text}
            <span></span>
        </h1>
    )
}

export default PageTitle