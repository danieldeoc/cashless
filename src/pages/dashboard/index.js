import React, { useContext, useEffect, useState } from "react";
import { getAuthCredentias } from "../../firebase/auth";
import { getAccountsCatalog } from "../../firebase/accounts";

import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import { Link } from "react-router-dom";
import Loader from "../../components/elements/loader";
import { formatValueTo2Digit, formatValueToMoney } from "../../tools/mathTools";
import { CredentialsContext } from "../../app";


function Dashboard(){

    const [accountsCatalog, setAccountsCatalog] = useState(undefined)
    const [accountsList, setAccountsList] = useState(<Loader />)
    const [totalAvaliable, setTotalAvaliable] = useState(<Loader />)

    //const credentials = getAuthCredentias();
    const { credentials } = useContext(CredentialsContext)

    console.log(credentials)
    const userName = credentials.name;
    ///////////////
    // texts
    const welcome = `Welcome, ${userName}`;


    function defineTotalAvaliable(catalog){
        let totalFunds = 0;
        catalog.forEach(account => {
            totalFunds = totalFunds + account.CurrentFunds
        });
        setTotalAvaliable( formatValueToMoney(totalFunds) )
    }

    const loadPage = useEffect( () => {
        const fetchData = async () => {
            await getAccountsCatalog().then(
                (response) => {
                    setAccountsCatalog(response);
                    defineTotalAvaliable(response)
                }
            )
        }
        fetchData();
    }, [])

    function returnAccountLink(id){
        const link = "/bankaccounts/movements?accountId="+id;
        return <Link className="miniBtn no-margin" to={link}>Check movements</Link>
    }

   
    const accountsCatalogAvaliable = useEffect( () => {
        if(accountsCatalog) {
            console.log(accountsCatalog, accountsCatalog.length)
            if(accountsCatalog.length > 0){
                setAccountsList(
                    accountsCatalog.map( (key, i) => (
                        <div className="card" key={i}>
                            <h3>{key.Name}</h3>
                            <span className="balance">{key.CurrencySymbol} {formatValueTo2Digit(key.CurrentFunds)}</span>
                            <div className="table-subline">
                                {returnAccountLink(key.id)} <Link className="miniBtn no-margin" to={`/bankaccounts/movements/addmoney?accountId=${key.id}`}>Add money</Link>
                            </div>
                        </div>
                    ))
                )
            } else {

            }
        }
    }, [accountsCatalog])

    return(
        <>
            <PageTitle text={welcome} />

            <div className="card">
                <h3>Total avaliable:</h3>
                <span className="balance">{totalAvaliable}</span>
            </div>
            
                <SectionTitle text="Accounts balances:" />
                {accountsList}
                

            
        </>
    )
}

export default Dashboard;