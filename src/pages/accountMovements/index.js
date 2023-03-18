import React, { useEffect } from "react";

function AccountMovements(props){

    let param = 'accountId';
    let accountId;

    const firstLoad = useEffect( () => {
        const urlParams = new URL(window.location.href).searchParams;
        
        if(urlParams.has(param)) {
            accountId = urlParams.get(param);
            if(accountId != undefined && accountId != null && typeof accountId === "string" && accountId.length > 3 && accountId.length < 30 ){
                console.warn("param correct")
            } else {
                console.warn("param may be incorrect")
            }
        } else {
            console.warn("no account to display")
        }
    }, [])

    return(
        <>
            Account history {accountId} {param}
        </>
    )
}

export default AccountMovements;