import React, { useEffect, useState } from "react";
import { getAuthCredentias } from "../../firebase/auth";
import { getAccountsCatalog } from "../../firebase/accounts";

import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import { Link } from "react-router-dom";
import Loader from "../../components/elements/loader";


function Dashboard(){

    const [accountsCatalog, setAccountsCatalog] = useState(undefined)
    const [accountsList, setAccountsList] = useState(<Loader />)
    const credentials = getAuthCredentias();

    const userName = credentials.name;
    console.log(credentials)
    ///////////////
    // texts
    const welcome = `Welcome, ${userName}`;


    const loadPage = useEffect( () => {
        const fetchData = async () => {
            await getAccountsCatalog().then(
                (response) => {
                    setAccountsCatalog(response);
                    console.log(response)
                }
            )
        }
        fetchData();
    }, [])

    function returnAccountLink(id){
        const link = "/bankaccounts/movements?accountId="+id;
        return <Link to={link}>Check movements</Link>
    }

    const accountsCatalogAvaliable = useEffect( () => {
        if(accountsCatalog) {
            console.log(accountsCatalog, accountsCatalog.length)
            if(accountsCatalog.length > 0){
                setAccountsList(
                    accountsCatalog.map( (key) => (
                        <div className="card">
                            <h3>{key.Name}</h3>
                            <span className="balance">{key.CurrencySymbol} {key.CurrentFunds}</span>
                            {returnAccountLink(key.id)}
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
            
                <SectionTitle text="Your accounts status" />
                {accountsList}
                

            
        </>
    )
}

export default Dashboard;