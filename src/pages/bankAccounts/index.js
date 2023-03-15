import React, { useEffect, useState } from "react";

import { serverTimestamp } from "firebase/firestore"
import { addBankAccount, getAccountsCatalog, deletBankAccount, getPaymentsCatalog, getCurrecyCatalog } from "../../firebase/accounts";
import CheckBoxGroups from "../../components/forms/checkboxes";
import SelectBox from "../../components/forms/select";

function BankAccounts(){

    const [accountsCatalog, setAccountsCatalog] = useState(undefined);
    const [paymentsCatalog, setPaymentsCatalog] = useState(undefined);
    const [currencyCatalog, setCurrencyCatalog] = useState(undefined)
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
    const [payOptions, setPayOptions] = useState(undefined);
    const [currencyOptions, setCurrencyOptions] = useState(undefined);
    const [listBankAccounts, setListBankAccounts] = useState(undefined);

    const newBankAccount = {
        Name: bankName,
        InitialDeposit: initialDeposit,
        CurrentFunds: initialDeposit,
        Currency: bankCurrency,
        CurrencySymbol: bankCurrencySymbol,
        PaymentMethods: bankPaymentsMethods,
        Status: bankStatus,
        CreatedAt: serverTimestamp()
    }
    /* ############################# */
    // Add an account
    function createAccount(){

        addBankAccount(newBankAccount).then((res) => {
            window.location.href = "/bankaccounts"
        })
    }

    /* ############################# */
    // Payment Methods     
    function checksClick(data){
        console.log(data, bankPaymentsMethods)
        if(bankPaymentsMethods.includes(data)){
            console.log("includes", data, bankPaymentsMethods)
            let removal = bankPaymentsMethods.indexOf(data);
            bankPaymentsMethods.splice(removal, 1);
        } else {
            console.log("not includes", bankPaymentsMethods)
            bankPaymentsMethods.push(data)
        }
        console.log("result", bankPaymentsMethods)
    }

    /* ############################# */
    // Get Bank Accounts
    const firstLoad = useEffect(() => {
        getAccountsCatalog().then( (res) => {
            setAccountsCatalog(res);
            console.log(res)
        });

        getPaymentsCatalog().then((res) => {
            console.log(res)
            setPaymentsCatalog(res)
        })        
        getCurrecyCatalog().then( (res) => {
            setCurrencyCatalog(res)
        })
    }, []);

    const updateAccountCatalog = useEffect(() => {
        if(accountsCatalog){
            setListBankAccounts(
                accountsCatalog.map( (key, i) => (
                    <li key={i}>
                        {key.Name}
                        {key.Currency}
                        {key.CurrencySymbol}
                        {key.InitialDeposit}
                        {key.CurrentFunds}
                        {key.PaymentMethods}
                        {key.Status}
                        {Date(key.CreatedAt)}
                        <i onClick={ () => { 
                            deletBankAccount(key.id).then( (res) => {
                                setAccountsCatalog(res);
                            }) } }>X</i>
                    </li>
                ))
            );
            setPayOptions(paymentsCatalog);
            
        }
    }, [accountsCatalog, currencyCatalog, paymentsCatalog]);

    const currencySet = useEffect( () => {
        setCurrencyOptions(currencyCatalog);
    }, [currencyCatalog])

function show(){
    console.log(newBankAccount)
}
    return(
        <>
            Bank Accounts
            <button onClick={show}>Show</button>
            <div className="addBankAccount">
                Bank: <input type="text" value={bankName} onChange={ (e) => { setBankName(e.target.value) } } />
                Initial Deposit: <input type="number" value={initialDeposit} onChange={ (e) => { setInitialDeposit(Number(e.target.value)) } } /> 
                Currency: 
                <SelectBox
                    options={currencyOptions}
                    onChangeHandler={(res) => { setBankCurrency(res) }} />
                
                PaymentMethods:
                <div className="paymethodsOptions">
                    <CheckBoxGroups
                        id="ckGroup_1"
                        data={payOptions}
                        OnClickHandler={res => checksClick(res)} />

                </div>
            </div>
            <button onClick={createAccount}>Save</button>
            <h2>Avaliable Bank Accounts</h2>
            <ul>
                {listBankAccounts}
            </ul>
        </>
    )
}

export default BankAccounts;