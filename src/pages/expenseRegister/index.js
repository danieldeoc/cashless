import React, { createContext, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Timestamp } from "firebase/firestore"
import { getProductCatalog, getExpensesCatalog, getAccountsCatalog } from "../../globalOperators/globalGetters";

import ProductAddOn from "./components/productAddOn";
import SelectBox from "../../components/forms/select";
import Input from "../../components/forms/input";
import { formatValueToMoney } from "../../customOperators/mathOperators";
import AccountSelects from "./components/accountsSelects";

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
    
    /* ################################# */
    // REGISTRATION CONSTANTS > then, is setted information to a new expense register
    const [expenseStore, setExpenseStore] = useState(undefined); // get the
    
    const [purchaseProductList, setPurchaseProductList] = useState([]);
    const [expenseBankAccount, setExpenseBankAccount] = useState(undefined);
    const [expensePayMethod, setExpensePayMethod] = useState(undefined);
    
    const [totalPurchasePrice, setTotalPurchasePrice] = useState(undefined);
    
    const expenseRegister = {
        products: purchaseProductList,
        store: expenseStore,
        account: expenseBankAccount,
        paymenMethod: expensePayMethod,
        totalExpense: totalPurchasePrice
    }
    
    
    /* ################################# */
    // PAGE CONSTANTS > then, is setted the interface constants
    const [listExpenses, setListExpenses] = useState(["Wait..."]); // draw the expense list


    /* ################################# */
    // First page render, gets the catalog of avaliable information
    const firstRender = useEffect( () => {
        const fetchData = async () => {
            await getProductCatalog().then(
                (res) =>{
                    setProductsCatalog(res);
                }
            );
            await getAccountsCatalog().then(
                (res) => {
                    setAccountsCatalog(res);
                }
            )


            const getEC = await getExpensesCatalog("default")

           
            
            setExpensesCatalog(getEC);
        }
        fetchData();
    }, []);

    const [productRegister, setProducRegister] = useState([])

    /////////////////////////
    // Once with data, it populates and updates the interface on data change
    const draw = useEffect( () => {
        
        // draw the list of expenses
        if(expensesCatalog !== undefined){
            setListExpenses(
                expensesCatalog.map( key => ( 
                    <li key={key.id}>  
                        {key.Name} 
                        {key.Category}
                        {key.SubCategories}
                        {key.Price}
                        {key.Ammount}
                        {key.AmmountType}
                        {key.Account}
                        {key.PaymentMethod}
                        {Date(key.CreatedAt)}
                    </li>
                ))
            ); 

            
        }
    }, [expensesCatalog, productRegister])

    //////////////////////////////////////
    // updates product list and final calcs
    const totalsAndProducList = useEffect(() => {
        console.log("Purchase changed: ", purchaseProductList)
    }, [purchaseProductList])
    
    
    //////////////////////////////
    // Add a new product to the page
    function addProduct(){
        const newRegister = productRegister;
        newRegister.push(<ProductAddOn />)
        setProducRegister(
            newRegister.map( key => (
                key
            ))
        );
    }

    function showList(){
        console.log("Purchase changed show: ", expenseRegister) 
    }

    function calcTotalPurchasePrice(){
        if(purchaseProductList.length == 1){
            let newTotalPurchase = purchaseProductList[0].PriceHistory[0].Price;
            setTotalPurchasePrice(newTotalPurchase)
        } else {
            var newTotalPurchase = 0;
            purchaseProductList.map( (key) => {
                let value = key.PriceHistory[0].Price;
                let newValue = value.split("€")
                newTotalPurchase = parseFloat(newTotalPurchase) + parseFloat(newValue[1]);
                setTotalPurchasePrice( formatValueToMoney(newTotalPurchase) )
            })
        }
    }

    /////////////////////////////////
    // Global Variables
    const globalVariables = {
        productsCatalog, 
        accountCatalog, 
        expensesCatalog, 

        expenseBankAccount, setExpenseBankAccount,
        expensePayMethod, setExpensePayMethod,
        
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
                    <ProductAddOn />
                    {productRegister}
                </div>
                <button onClick={addProduct}>Add Product</button>
                
                <Input
                    id="store"
                    label="Store:"
                    value={expenseStore}
                    onChangeHandler={ (key) => { 
                        setExpenseStore(key)
                    }}
                    />

                <AccountSelects />
            </div>
            <h2>List of Expenses</h2>
            <ul>
                {listExpenses}
            </ul>
        </ExpenseContext.Provider>
        
    )
}
export default RegisterExpenses;