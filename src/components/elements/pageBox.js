import React from "react";


function PageBox(props){

    return(

        <div className="page-box">
            {props.children}
        </div>
    )
}

export default PageBox;