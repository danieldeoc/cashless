import React, {useEffect, useState, useContext} from "react";
import { ExpenseContext}  from '../index.js';
import SelectBox from "../../../components/forms/select.js";
import { currencySymbol } from "../../../tools/mathTools.js";

function AccountSelects(){
    /* ################################# */
    // Gets the information catalogs from userContext
    const { accountCatalog } = useContext(ExpenseContext);
    const { expenseBankAccount, setExpenseBankAccount } = useContext(ExpenseContext);
    const { expensePayMethod, setExpensePayMethod } = useContext(ExpenseContext);
    const { expenseAccountId, setExpenseAccountId } = useContext(ExpenseContext);
    const { expenseBankAccountBalance, setExpenseBankAccountBalance } = useContext(ExpenseContext);

    const [accountFunds, setAccountFunds] = useState(0);
    const [accountSymbol, setAccountSymbol] = useState("");
    
    /* ################################# */
    // Interface constants
    const [accountOptions, setAccountOptions] = useState(["Wait..."])
    const [paymentsOptions, setPaymentsOptions] = useState(["Wait..."]);

    /* ################################# */
    // Initial load
    const setAccounts = useEffect( () => {
        if( accountCatalog !== undefined){
            // set product added info
            setExpenseAccountId(accountCatalog[0].id)
            setExpenseBankAccount(accountCatalog[0].Name)
            setExpensePayMethod(accountCatalog[0].PaymentMethods[0]);
            setExpenseBankAccountBalance(accountCatalog[0].CurrentFunds)
            // set options info
            setAccountOptions(accountCatalog.map( key => key.Name))
            setPaymentsOptions(accountCatalog[0].PaymentMethods);

            setAccountFunds(accountCatalog[0].CurrentFunds)
            setAccountSymbol(accountCatalog[0].CurrencySymbol)
        }
    }, [accountCatalog])

    return(
        <>
            <SelectBox 
                label="Account"
                options={accountOptions}
                onChangeHandler={ (key) => { 
                    let accountDetails = accountCatalog.find( ({Name}) => Name == key )
                    setExpenseBankAccount(key)
                    setExpensePayMethod(accountDetails.PaymentMethods[0])
                    setExpenseBankAccountBalance(accountDetails.CurrentFunds)

                    setPaymentsOptions(accountDetails.PaymentMethods);
                    setExpenseAccountId(accountDetails.id)
                    setAccountFunds(accountDetails.CurrentFunds)
                    setAccountSymbol(accountDetails.CurrencySymbol)
                }}  />  

            <div className="read-field-value money">
                    Avaliable:  {accountFunds} {accountSymbol}
            </div>

            <SelectBox 
                label="Payment Method: "
                options={paymentsOptions}
                value={expensePayMethod}
                onChangeHandler={ (key) => { 
                   setExpensePayMethod(key)
                }}  />   
        </>
    )
}
export default AccountSelects;