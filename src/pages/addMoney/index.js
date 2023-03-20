import React, { useState, useEffect } from "react";

import PageTitle from "../../components/elements/texts/pageTitle";
import PageBox from "../../components/elements/pageBox";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Loader from "../../components/elements/loader";
import Input from "../../components/forms/input";
import { getDate } from "../../tools/dateTools";
import { currencySymbol, formatValueTo2Digit } from "../../tools/mathTools";
import { getAccount, addMoneyToBank } from "../../firebase/accounts";
import PrimaryButton from "../../components/elements/buttons/primaryButton";
import { serverTimestamp } from "firebase/firestore";
import Alert from "../../components/elements/messages/alert";


function AddMoney(props){

    const [account, setAccount] = useState(undefined)
    const [deposit, setDeposit] = useState(0)
    const [origin, setOrigin] = useState(undefined)
    const [title, setTitle] = useState(undefined)


    let param = 'accountId';
    const urlParams = new URL(window.location.href).searchParams;
    const accountId = urlParams.get(param);
    //////////////////////
    // messages
    const [returningAlerts, setReturningAlerts] = useState("");
    
    
    const firstLoad = useEffect( () => {

        
        
        if(urlParams.has(param)) {
            
            if(accountId != undefined && 
                accountId != null && 
                typeof accountId === "string" && 
                accountId.length > 3 && accountId.length < 30 ){
                
                    const fetchData = async () => {
                        await getAccount(accountId).then(
                            async (response) => {
                                console.log(response)
                                setAccount(response);

                                

                                setTitle("Add money to "+response.Name+" account");
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
                <SectionTitle text="Add money" />

                <Input 
                    type="text"
                    label="Origin:"
                    placeholder="Insert a name"
                    value={origin} 
                    onChangeHandler={(result) => { 
                        setOrigin(result)
                    }}
                    />
                
                <Input 
                    type="number"
                    label="Deposit:"
                    placeholder="Insert a value"
                    value={deposit} 
                    onChangeHandler={(result) => { 
                        setDeposit(Number(result))
                    }}
                    />

                <PrimaryButton
                    label="Add money"
                    onClickHandler={ async () => { 
                        setReturningAlerts(<Loader type="fullscreen" /> )

                        let newBalance = {
                            CreatedAt: serverTimestamp(),
                            Origin: origin,
                            Type: "deposit",
                            Value: deposit,
                            LastBalance: account.CurrentFunds,
                            NewBalance: Number(account.CurrentFunds + deposit)
                        }
                        await addMoneyToBank(accountId, newBalance).then(
                            (response) => {
                                setReturningAlerts(
                                    <Alert
                                        message={response.message}
                                        classes={response.classes}
                                        display={response.display}
                                        />
                                );
                            })

                        }} /> 

            </PageBox>
            {returningAlerts}   
        </>
    )
}

export default AddMoney;