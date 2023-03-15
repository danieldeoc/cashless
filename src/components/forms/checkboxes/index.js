import React from "react";

function CheckBoxGroups(props){
    if(props.data){
        var i = 0;
        var listChecks = props.data.map( (data, i) => (
            <label key={i}>
                <input 
                    id={props.id+"_"+props.data} 
                    type="checkbox" 
                    onClick={() => {
                        props.OnClickHandler(data)
                    }} />
                    {data}
            </label>
        ));
    } else {
        var listChecks = "loading...";
    }
    return(
        <>
            {listChecks}
        </>
    )
}

export default CheckBoxGroups;