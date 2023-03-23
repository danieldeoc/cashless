import React from "react";
import Loader from "../../elements/loader";

function CheckBoxGroups(props){
    if(props.data){
        var i = 0;
        var listChecks = props.data.map( (data, i) => (
            <div className="checkbox-line" key={i}>
                <input 
                    className="inputCheck"
                    id={props.id+"_"+data} 
                    type="checkbox" 
                    onClick={() => {
                        props.OnClickHandler(data)
                    }} />
                    {data}
            </div>
        ));
    } else {
        var listChecks = <Loader />;
    }
    return(
        <label className="input-label checkbox-group">
            <span className="label-title"> {props.label}</span>
            {listChecks}
        </label>
    )
}

export default CheckBoxGroups;