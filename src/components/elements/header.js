import React, { useCallback, useEffect, useState } from "react";
import Navigator from "./navigator";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faX } from '@fortawesome/free-solid-svg-icons'

function Header(){

    const [icon, setIcon] = useState(<FontAwesomeIcon icon={faBars} />)
    const [menuStats, setMenuStats] = useState(false)
    
    
    
    const menuHandler = useCallback( () => {
        const navigator = document.getElementById("navigator").classList;
        if(menuStats === false){
            setIcon(<FontAwesomeIcon icon={faX} />)
            navigator.add("show");
            setMenuStats(true)
        } else {
            setIcon(<FontAwesomeIcon icon={faBars} />)
            navigator.remove("show")
            setMenuStats(false)
        }
    }, [icon])
    
    const render = useEffect( () => {
        const navigator = document.getElementById("navigator").classList;
        document.querySelectorAll("#navigator a").forEach( key => {
            key.addEventListener("click", () => {
                navigator.remove("show");
                setIcon(<FontAwesomeIcon icon={faBars} />)
            })

        })
    }, [])
    


    return(
        <>
            <header>
                Cashless
                <span className="menu" onClick={() => menuHandler() }>
                    {icon}
                </span>
            </header>
            <Navigator />
        </>
    )
}

export default Header;