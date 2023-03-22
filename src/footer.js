import React from "react";
import { getAuthCredentias } from "./firebase/auth";

function Footer(){
    const loged = getAuthCredentias()
    let link;
    if(loged.id){
        link = <a href="mailto:appdoc11@gmail.com">Any issue? Send us a mail.</a>
    }

    return(
        <footer>
            {link}
        </footer>
    )
}

export default Footer;