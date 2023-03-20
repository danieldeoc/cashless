import React, { useEffect, useState } from "react";
import PageBox from "../../components/elements/pageBox";

import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Loader from "../../components/elements/loader";
import { getDate } from "../../tools/dateTools";
import { currencySymbol, formatValueTo2Digit } from "../../tools/mathTools";
import { getAccount, getAccountBalanceHistory } from "../../firebase/accounts";


function AccountMovements(props){

    const [accountHistory, setAccountHistory] = useState(<Loader />)
    const [accountName, setAccountName] = useState(undefined)

    let title = "Movements in "+accountName;

    let param = 'accountId';
    let accountId;

    function drawHistory(history){
        if(history.length == 0){
            setAccountHistory(
                <div className="empty-page">
                    No movements registered yet
                </div>
            )
        } else {

            setAccountHistory(
                history.map(
                    (key, i) => (
                        <li key={i}>
                            {getDate(key.CreatedAt)}
                            <span className="table-list-right-side table-list-currency no-margin">
                                {formatValueTo2Digit(key.NewBalance)} {currencySymbol("Euro")}
                            </span>
                            <div className="li-container">
                                <span className="li-container-label">
                                    Movement type:<br/>
                                    <strong>{key.Type}</strong>
                                </span>
                                <span className="li-container-label">
                                    Total:<br/>
                                    <strong>{formatValueTo2Digit(key.Value)}</strong>
                                </span>
                            </div>
                        </li>
                    )
                )
            );

        }


    }

    const firstLoad = useEffect( () => {
            const urlParams = new URL(window.location.href).searchParams;
            
            if(urlParams.has(param)) {
                accountId = urlParams.get(param);
                if(accountId != undefined && 
                    accountId != null && 
                    typeof accountId === "string" && 
                    accountId.length > 3 && accountId.length < 30 ){
                    
                        const fetchData = async () => {
                            await getAccount(accountId).then(
                                async (response) => {
                                    setAccountName(response.Name);
                                }
                            )
                                
                            await getAccountBalanceHistory(accountId).then(
                                (response) => {
                                    drawHistory(response);
                                }
                            )
                        }
                        fetchData();

                } else {
                    console.warn("param may be incorrect")
                }
            } else {
                console.warn("no account to display")
            }
    }, [])

    return(
        <>
            <PageTitle text={title} />
            <PageBox>
                <SectionTitle text="Account balance" />
                <ul className="table-list">
                    {accountHistory}
                </ul>
            </PageBox>
        </>  
    )
}

export default AccountMovements;