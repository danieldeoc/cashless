import React, { createContext, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Timestamp } from "firebase/firestore"
import { getProductUnitsCatalog } from "../../globalOperators/globalGetters";
import { getAccountsCatalog } from "../../firebase/accounts";

import { currencySymbol, formatValueToMoney } from "../../tools/mathTools.js";
import ProductAddOn from "./components/productAddOn";
import Input from "../../components/forms/input";
import AccountSelects from "./components/accountsSelects";

import { expenseRegisterProcess } from "./tools/expenseRegister";

import { getProductCatalog } from "../../firebase/productRegistration";
import { getCategoriesCatalog } from "../../firebase/categories";
import { getExpensesCatalog } from "../../firebase/expenseRegistration";

/* 
    in order to register a new expenses it will:
    a) perform a produc catalog search
    b) register the following information:
        {
            Date: data da despesa
            Product: {A product from the catalog or a new one}
            Category: {a list or preseted from the product}
            Price: The value of the product
            Ammount: How much product
            Ammount Unit: [un, kg, l]
            Product Total price: price * amount
            Purchase total price: sum of all products total prices
            Account: {Bank account list}
            Account payment Method: {Bank payment method}
        }
    On it register it must:
        a) add a new produc to the catalog if it does not exist
        b) perform a bank balance update
        c) update bank current value

*/
export const ExpenseContext = createContext();

////////////////////////////////
// COMPONENT
function RegisterExpenses(){  
    
    /* ################################# */
    // First, I get the catalog of avaliable information
    const [productsCatalog, setProductsCatalog] = useState(undefined);
    const [accountCatalog, setAccountsCatalog] = useState(undefined);
    const [expensesCatalog, setExpensesCatalog] = useState(undefined);
    const [unitsCatalog, setUnitsCatalog] = useState(undefined);
    const [categoryCatalog, setCategoryCatalog] = useState(undefined);
    
    /* ################################# */
    // REGISTRATION CONSTANTS > then, is setted information to a new expense register
    const [purchaseProductList, setPurchaseProductList] = useState([]);
    const [expenseStore, setExpenseStore] = useState(undefined); 
    const [expenseBankAccount, setExpenseBankAccount] = useState(undefined);
    const [expenseAccountId, setExpenseAccountId] = useState(undefined);
    const [expenseBankCurrency, setExpenseBankCurrency] = useState(undefined)
    const [expensePayMethod, setExpensePayMethod] = useState(undefined);
    const [totalPurchasePrice, setTotalPurchasePrice] = useState(formatValueToMoney("0.00"));

    const [generalId, setGeneralId] = useState(1)
    
    // expense register object
    const expenseRegister = {
        products: purchaseProductList,
        store: expenseStore,
        accountId: expenseAccountId,
        account: expenseBankAccount,
        currency: expenseBankCurrency,
        paymenMethod: expensePayMethod,
        totalExpense: totalPurchasePrice
    }
    
    /* ################################# */
    // PAGE CONSTANTS > then, is setted the interface constants
    const [listExpenses, setListExpenses] = useState(["Wait..."]); // draw the expense list
    const [productMultipleRegister, setProducMultipleRegister] = useState([]) // allows to draw the multiple register

    /* ################################# */
    // First page render, gets the catalog of avaliable information
    const firstRender = useEffect( () => {
        const fetchData = async () => {
            await getProductCatalog().then(
                res => setProductsCatalog(res)
            );
            await getAccountsCatalog().then(
                (res) => {
                    setAccountsCatalog(res)
                    setExpenseBankCurrency( currencySymbol("Euro") );
                    console.log(res)
                }
            )
            await getProductUnitsCatalog().then(
                res => setUnitsCatalog(res)
            );   
            await getCategoriesCatalog().then(
                res => setCategoryCatalog(res)
            )
            await getExpensesCatalog("default").then(
                res => setExpensesCatalog(res)
            )
        }
        fetchData();
    }, []);


    /////////////////////////
    // Once with data, it populates and updates the interface on data change
    const draw = useEffect( () => {
        // draw the list of expenses
        console.log(expensesCatalog)
        if(expensesCatalog !== undefined){
            setListExpenses(
                expensesCatalog.map( key => ( 
                    <li key={key.id}>  
                        {key.products} 
                        {key.store}
                        {expenseBankCurrency}{key.totalExpense}
                        {key.account}
                        {key.paymentMethod}
                        {Date(key.CreatedAt)}
                    </li>
                ))
            ); 
        }
    }, [expensesCatalog])

    
    
    //////////////////////////////
    // Add a new product to the page
    function addProduct(){
        setGeneralId( generalId + 1)
        const newRegister = productMultipleRegister;
        newRegister.push(<ProductAddOn  generalId={generalId + 1} />)
        setProducMultipleRegister(
            newRegister.map( key => (
                key
            ))
        );
    }

    ///////////////////////////
    /// expense register show
    function showList(){
        console.log("Expenses: ", expenseRegister) 
        console.log("Catalog: ", productsCatalog) 
    }

    //////////////////////
    // set total expense cost
    function calcTotalPurchasePrice(){
        let totalPurchase = 0;
        expenseRegister.products.forEach( key => {
            totalPurchase = totalPurchase + key.TotalPrice;
        })
        setTotalPurchasePrice(totalPurchase); 
    }

    /////////////////////////////////
    // Register Expense
    function registerExpense(){
        expenseRegister.products.forEach( key => {
            if(key.Store === undefined ){
                key.Store = expenseStore
            }
        })

        expenseRegisterProcess(expenseRegister, productsCatalog, accountCatalog)
    };


    /////////////////////////////////
    // Global Variables
    const globalVariables = {
        productsCatalog, 
        accountCatalog, 
        expensesCatalog, 
        unitsCatalog,
        categoryCatalog,

        expenseBankAccount, setExpenseBankAccount,
        expenseAccountId, setExpenseAccountId,
        expensePayMethod, setExpensePayMethod,
        expenseStore, setExpenseStore,
        expenseBankCurrency,
        
        purchaseProductList, setPurchaseProductList, 
        totalPurchasePrice, setTotalPurchasePrice, 
        calcTotalPurchasePrice 
    } 

    /////////////////////////////////
    /* INTERFACE */
    return(       
        <ExpenseContext.Provider value={globalVariables}>
            <button onClick={showList}>LIst</button>
            <h1>New Expense</h1>
            <div className="addNewExpense">
                <div id="productsBox">
                    <ProductAddOn generalId={"1"} />
                    {productMultipleRegister}
                </div>
                <button onClick={addProduct}>Add Product</button>
                
                <Input
                    id="store"
                    label="Store:"
                    value={expenseStore}
                    onChangeHandler={ (storeName) => { 
                        setExpenseStore(storeName);
                    }}
                    />

                <AccountSelects />

                <div>
                    Total purchase:  {totalPurchasePrice} {expenseBankCurrency}
                </div>

                <button onClick={registerExpense}>Register Expense</button>
            </div>
            <h2>List of Expenses</h2>
            <ul>
                {listExpenses}
            </ul>
        </ExpenseContext.Provider>
        
    )
}
export default RegisterExpenses;