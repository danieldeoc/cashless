import React from "react";
import loader from "../../../images/loader.svg";

function Loader(props){
    let type = props.type;

    const loadIco = <img src={loader} alt="Loading, please, wait." />;
    <div class="loader loader--style3" title="2">
    
  </div>
  
    let classLoader;
    if(type == "fullscreen"){
        classLoader = "block-page-loader window-overlay";
    } else {
        classLoader = "loadBox";

    }
    return(
        <div className={classLoader}>{loadIco}</div>
    )
}

export default Loader;