import React, { createContext, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Timestamp } from "firebase/firestore"
import { getProductCatalog, getExpensesCatalog, getAccountsCatalog, getProductUnitsCatalog, getCategoriesCatalog } from "../../globalOperators/globalGetters";

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
    const [unitsCatalog, setUnitsCatalog] = useState(undefined);
    const [categoryCatalog, setCategoryCatalog] = useState(undefined);
    
    /* ################################# */
    // REGISTRATION CONSTANTS > then, is setted information to a new expense register
    const [purchaseProductList, setPurchaseProductList] = useState([]);
    const [expenseStore, setExpenseStore] = useState(undefined); 
    const [expenseBankAccount, setExpenseBankAccount] = useState(undefined);
    const [expensePayMethod, setExpensePayMethod] = useState(undefined);
    const [totalPurchasePrice, setTotalPurchasePrice] = useState(formatValueToMoney("0.00"));
    
    // expense register object
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
    const [productMultipleRegister, setProducMultipleRegister] = useState([]) // allows to draw the multiple register

    /* ################################# */
    // First page render, gets the catalog of avaliable information
    const firstRender = useEffect( () => {
        const fetchData = async () => {
            await getProductCatalog().then(
                res => setProductsCatalog(res)
            );
            await getAccountsCatalog().then(
                res => setAccountsCatalog(res)
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
    }, [expensesCatalog])

    
    
    //////////////////////////////
    // Add a new product to the page
    function addProduct(){
        const newRegister = productMultipleRegister;
        newRegister.push(<ProductAddOn />)
        setProducMultipleRegister(
            newRegister.map( key => (
                key
            ))
        );
    }

    ///////////////////////////
    /// expense register show
    function showList(){
        console.log("Purchase changed show: ", expenseRegister) 
    }


    function calcTotalPurchasePrice(){
        let totalPurchase = 0
        if(expenseRegister.products.length > 0){
            expenseRegister.products.forEach( (product) => {
                let totalPrice = product.PriceHistory[0].TotalPrice;
                if(totalPrice.includes("€")){
                    let calc = totalPrice.split("€");
                    let toCalc = parseFloat(calc[1])
                    totalPurchase = totalPurchase + toCalc;
                }
            })
        }
        setTotalPurchasePrice(formatValueToMoney(totalPurchase))
    }

    /////////////////////////////////
    // Register Expense
    function registerExpense(){
        alert("time to register the expense")

        console.log("Add nonexistent products to the catalog / also fix the catalog page")
        console.log("Add price history to existent products in the catalog")
        console.log("add expense register to the expenses history")
        console.log("add movment to the bank account")
        console.log("update the screen")

    }

    /////////////////////////////////
    // Global Variables
    const globalVariables = {
        productsCatalog, 
        accountCatalog, 
        expensesCatalog, 
        unitsCatalog,
        categoryCatalog,

        expenseBankAccount, setExpenseBankAccount,
        expensePayMethod, setExpensePayMethod,
        expenseStore, setExpenseStore,
        
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
                    {productMultipleRegister}
                </div>
                <button onClick={addProduct}>Add Product</button>
                
                <Input
                    id="store"
                    label="Store:"
                    value={expenseStore}
                    onChangeHandler={ (storeName) => { 
                        setExpenseStore(storeName);
                       /* expenseRegister.products.forEach( (key) => {
                            console.log(key.PriceHistory[0].Store = storeName)
                        }) */
                    }}
                    />

                <AccountSelects />

                <div>
                    Total purchase: {totalPurchasePrice}
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