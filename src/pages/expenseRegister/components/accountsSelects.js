import React, {useEffect, useState, useContext} from "react";
import { ExpenseContext}  from '../index.js';
import SelectBox from "../../../components/forms/select.js";

function AccountSelects(){
    /* ################################# */
    // Gets the information catalogs from userContext
    const { accountCatalog } = useContext(ExpenseContext);
    const { expenseBankAccount, setExpenseBankAccount } = useContext(ExpenseContext);
    const { expensePayMethod, setExpensePayMethod } = useContext(ExpenseContext);
    const {expenseAccountId, setExpenseAccountId } = useContext(ExpenseContext);
    
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
            // set options info
            setAccountOptions(accountCatalog.map( key => key.Name))
            setPaymentsOptions(accountCatalog[0].PaymentMethods);
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
                    setPaymentsOptions(accountDetails.PaymentMethods);
                    setExpenseAccountId(accountDetails.id)
                }}  />  
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