import React, { useEffect, useState } from "react";

import { serverTimestamp } from "firebase/firestore"
import { addBankAccount, getAccountsCatalog, deletBankAccount, getPaymentsCatalog, getCurrecyCatalog, getAccountMovments } from "../../firebase/accounts";
import CheckBoxGroups from "../../components/forms/checkboxes";

import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Input from "../../components/forms/input";
import SelectBox from "../../components/forms/select";
import PrimaryButton from "../../components/elements/buttons/primaryButton";
import Alert from "../../components/elements/messages/alert";
import Loader from "../../components/elements/loader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import ConfirmDialog from "../../components/elements/messages/confirm";
import { defineCurrencySymbols } from "../../tools/moneyTools";
import { getDate } from "../../tools/dateTools";
import { formatValueTo2Digit } from "../../tools/mathTools";
import { Link} from "react-router-dom";

function BankAccounts(){

    /* ############################# */
    // Catalogs
    const [accountsCatalog, setAccountsCatalog] = useState(undefined);
    const [payOptions, setPayOptions] = useState(undefined);
    
    const [currencyCatalog, setCurrencyCatalog] = useState(undefined);

    /* ############################# */
    // Account Constants
    const [bankName, setBankName] = useState("");
    const [initialDeposit, setInitialDeposit] = useState(0);
    const [bankCurrency, setBankCurrency] = useState("Euro");
    const [bankCurrencySymbol, setBankCurrencySymbol] = useState("€");
    const [bankStatus, setBankStatus] = useState(true);
    const [bankPaymentsMethods, setBankPaymentsMethods] = useState([]);
    
    /* ############################# */
    // Interface constants
    const [currencyOptions, setCurrencyOptions] = useState(undefined);
    const [listBankAccounts, setListBankAccounts] = useState(<Loader />);

    

    const newBankAccount = {
        Name: bankName,
        InitialDeposit: initialDeposit,
        CurrentFunds: initialDeposit,
        Currency: bankCurrency,
        CurrencySymbol: bankCurrencySymbol,
        PaymentMethods: bankPaymentsMethods,
        Status: bankStatus,
        CreatedAt: serverTimestamp()
    };

    //////////////////////
    // messages
    const [returningAlerts, setReturningAlerts] = useState("");


    /* ############################# */
    // Get Catalogs
    const firstLoad = useEffect(() => {
        getAccountsCatalog().then( (res) => {
            setAccountsCatalog(res);
        });
        getPaymentsCatalog().then((res) => {
            setPayOptions(res)
        })        
        getCurrecyCatalog().then( (res) => {
            setCurrencyCatalog(res)
        })

        
    }, []);

    const updateAccountCatalog = useEffect(() => {
        pageDraw();
    }, [accountsCatalog]);

    /* ############################# */
    // Draw page
    function pageDraw(){
        if(accountsCatalog){
            if(accountsCatalog[0] == "No accounts registered yet"){
                setListBankAccounts(
                    accountsCatalog.map( (key, i) => (
                        <li className="empty-list">
                            {key}
                        </li>
                        )
                    )
                )
            } else {

                setListBankAccounts(
                    accountsCatalog.map( (key, i) => (
                        <li key={i}>
                            {key.Name}
                            
    
                            <span 
                                className="delete-item-list" 
                                onClick={ () => { 
                                    if(key.Name != "Paper Money"){
                                        setReturningAlerts(
                                            <ConfirmDialog 
                                                message="Do you realy want to delete this account?"
                                                onConfirmHandler={() => { 
                                                    deleteBankAccountCall(key.id, key.Name)
                                                }}
                                                onDenyHandle={denyDelete}
                                                />)
                                                
                                    } else {
                                        alert("Fisical money account cannot be deleted.")
                                    }
                                }}>
                                <FontAwesomeIcon icon={faX} />
                            </span>
    
                            <span className="fundsDisplay">
                                {key.CurrencySymbol} {formatValueTo2Digit(key.CurrentFunds) }
                            </span>
                            
                            <div className="table-subline">
                                <Link className="miniBtn no-margin" to={`/bankaccounts/movements/addmoney?accountId=${key.id}`}>Add money</Link>
                            </div>

                            <div className="li-container">
                                <span className="li-container-label">
                                    <strong>Curerncy:</strong> <br/>
                                    {key.Currency} | {key.CurrencySymbol}
                                </span>
                                <span className="li-container-label">
                                    <strong>Initial Deposit:</strong> <br/>
                                    {key.InitialDeposit}
                                </span>
                                <span className="li-container-label">
                                    <strong>Payment Methods:</strong> <br/>
                                    
                                    {key.PaymentMethods.map( (method) => method+", ")}
                                </span>
                                <span className="li-container-label">
                                    <strong>Opening Date:</strong> <br/>
                                    {getDate(key.CreatedAt)}
                                </span>
                                <Link to={"/bankaccounts/movements?accountId="+key.id}>Check movements</Link>
                            </div>
                            
                        </li>
                    ))
                );            
            }
        }
    }

    /* ############################# */
    // Delet account
    function deleteBankAccountCall(id){
        
            deletBankAccount(id).then( 
                (response) => {
                    setReturningAlerts(
                        <Alert
                            message={response.message}
                            classes={response.classes}
                            display={response.display}
                            />
                    );
                    if( response.classes != "error" && response.classes != "warning"){
                        getAccountsCatalog().then( (res) => {
                            setAccountsCatalog(res);
                        })
                    }
                })
        
    } 
    

    function denyDelete(){
        setReturningAlerts(null);
    }

    /* ############################# */
    // Payment Methods     
    function checksClick(data){
        if(bankPaymentsMethods.includes(data)){
            let removal = bankPaymentsMethods.indexOf(data);
            bankPaymentsMethods.splice(removal, 1);
        } else {
            bankPaymentsMethods.push(data)
        }
    }

    

    

    const currencySet = useEffect( () => {
        setCurrencyOptions(currencyCatalog);
    }, [currencyCatalog])

    return(
        <>
            <PageTitle text="Accounts" />
            <PageBox>
                <SectionTitle text="Add a new account" />

                <Input 
                    id="accountName"
                    type="text"
                    label="Account name:"
                    placeholder="Insert a name"
                    value={bankName} 
                    onChangeHandler={(result) => { 
                        setBankName(result) ;
                    }}
                    />

                <Input 
                    id="initial"
                    type="number"
                    label="Initial Deposit:"
                    placeholder="Insert a initial deposit"
                    value={initialDeposit} 
                    onChangeHandler={(result) => { 
                        setInitialDeposit(Number(result))
                    }}
                    />

                <SelectBox
                    options={currencyOptions}
                    id="currencyOptions"
                    label="Select a currency"
                    onChangeHandler={(res) => { 
                        setBankCurrency(res) 
                        setBankCurrencySymbol(defineCurrencySymbols(res))
                    }} />
                
                <CheckBoxGroups
                    label="Payment Methods:"
                    id="ckGroup_1"
                    data={payOptions}
                    OnClickHandler={res => checksClick(res)} />

                <PrimaryButton
                    label="Add New Account"
                    onClickHandler={() => { 
                        setReturningAlerts(<Loader type="fullscreen" /> )
                        setListBankAccounts(<Loader />)
                        addBankAccount(newBankAccount).then(
                            (response) => {
                                setReturningAlerts(
                                    <Alert
                                        message={response.message}
                                        classes={response.classes}
                                        display={response.display}
                                        />
                                );
                                getAccountsCatalog().then( (res) => {
                                    setBankName("")
                                    setInitialDeposit("")
                                    setBankCurrency("Euro")
                                    setBankCurrencySymbol("€")
                                    setBankStatus(true)
                                    setBankPaymentsMethods([])

                                    setAccountsCatalog(res);

                                    document.getElementById("accountName").value = "";
                                    document.getElementById("initial").value = 0;
                                    document.getElementById("currencyOptions").value = currencyCatalog[0];

                                    document.getElementById("ckGroup_1_Debit Card").checked = false;
                                    document.getElementById("ckGroup_1_Account Debit").checked = false;

                                    
                                    


                                })
                            })                        
                        }} /> 
            </PageBox>
               
            <PageBox>
                <SectionTitle text="Avaliable accounts" />
                <ul className="table-list">
                    {listBankAccounts}
                </ul>
            </PageBox>
            {returningAlerts}    
        </>
    )
}

export default BankAccounts;