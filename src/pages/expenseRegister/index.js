import React, { createContext, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Timestamp } from "firebase/firestore"
import { getProductCatalog, getExpensesCatalog, getAccountsCatalog } from "../../globalOperators/globalGetters";

import ProductAddOn from "./components/productAddOn";
import SelectBox from "../../components/forms/select";
import Input from "../../components/forms/input";
import { formatValueToMoney } from "../../customOperators/mathOperators";

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
    const loadingMsg = "Wait...";
    
    const [productsCatalog, setProductsCatalog] = useState([loadingMsg]);
    const [accountCatalog, setAccountsCatalog] = useState([loadingMsg]);
    
    const [expensesCatalog, setExpensesCatalog] = useState([loadingMsg]);

    const [multiForm, setMultiForm] = useState("")
  
    
    /* ################################# */
    // REGISTRATION CONSTANTS > then, is setted information to a new expense register
    const [purchaseProductList, setPurchaseProductList] = useState([]);

    const [totalPurchasePrice, setTotalPurchasePrice] = useState(null);

    const [expenseStore, setExpenseStore] = useState(""); // get the
    const [expenseBankAccount, setExpenseBankAccount] = useState("");
    const [expensePayMethod, setExpensePayMethod] = useState("");
    const [paymentsOptions, setPaymentsOptions] = useState([loadingMsg]);
    
    /* ################################# */
    // PAGE CONSTANTS > then, is setted the interface constants
    const [listExpenses, setListExpenses] = useState([loadingMsg]); // draw the expense list


    /* ################################# */
    // First page render, gets the catalog of avaliable information
    const firstRender = useEffect( () => {
        const fetchData = async () => {
            await getProductCatalog().then(
                (res) =>{
                    setProductsCatalog(res);
                    setMultiForm(<ProductAddOn />)
                }
            );
            const getCt = await getAccountsCatalog();            
            const getEC = await getExpensesCatalog("default")

           
            setAccountsCatalog(getCt);
            setExpensesCatalog(getEC);
        }
        fetchData();
    }, []);

    const [productRegister, setProducRegister] = useState([])

    /////////////////////////
    // Once with data, it populates and updates the interface on data change
    const draw = useEffect( () => {
        
        // draw the list of expenses
        if(expensesCatalog[0] !== loadingMsg){
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

            // update the form whit options
            setPaymentsOptions(accountCatalog[0].PaymentMethods);
            setExpenseBankAccount(accountCatalog[0].Name);
            setExpensePayMethod(accountCatalog[0].PaymentMethods[0]);
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
        console.log("Purchase changed show: ", purchaseProductList) 
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
    /* INTERFACE */
    return(
        
        
        <ExpenseContext.Provider value={ {productsCatalog, accountCatalog, expensesCatalog, totalPurchasePrice, setTotalPurchasePrice, purchaseProductList, setPurchaseProductList, calcTotalPurchasePrice } }>
            <button onClick={showList}>LIst</button>
            <h1>New Expense</h1>
            <div className="addNewExpense">
                <div id="productsBox">
                    {multiForm}
                    
                    {productRegister}
                </div>
                <button onClick={addProduct}>Add Product</button>

                <ul>
                    <li>Total {totalPurchasePrice}</li>
                    <li>Store: {expenseStore} </li>
                    <li>Bank: {expenseBankAccount}</li>
                    <li>Payment Method: {expensePayMethod}</li>
                </ul>
                
                <Input
                    id="store"
                    label="Store:"
                    value={expenseStore}
                    onChangeHandler={ (key) => { 
                        setExpenseStore(key)
                    }}
                    />

                <SelectBox 
                    label="Account"
                    options={accountCatalog.map( key => key.Name)}
                    onChangeHandler={ (key) => { 
                        let accountDetails = accountCatalog.find( ({Name}) => Name == key )
                        setExpensePayMethod(accountDetails.PaymentMethods[0])
                        setExpenseBankAccount(key)
                    }}  />  

                <SelectBox 
                    label="Payment Method: "
                    options={paymentsOptions}
                    value={expensePayMethod}
                    onChangeHandler={ (key) => { 
                        setExpensePayMethod(key)
                    }}  />   
            </div>
            <h2>List of Expenses</h2>
            <ul>
                {listExpenses}
            </ul>
        </ExpenseContext.Provider>
        
    )
}
export default RegisterExpenses;