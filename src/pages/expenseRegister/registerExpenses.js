import React, { createContext, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { getProductCatalog, getProductUnits,getExpensesCatalog, getAccountsCatalog, getCategoriesCatalog } from "../../globalOperators/globalGetters";

import ProductAddOn from "./components/productAddOn";
import SelectBox from "../../components/forms/select";
import Input from "../../components/forms/input";

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
            Account: {Bank account list}
            Account payment Method: {Bank payment method}
        }
    On it register it must:
        a) add a new produc to the catalog if it does not exist
        b) perform a bank balance update
        c) update bank current value

*/


export const ExpenseContext = createContext();



function RegisterExpenses(){  
    
    // FIREBASE CONFIG
    const firebaseConfig = {
        apiKey: "AIzaSyD6txBIF18GfL7EvXyouaADDFqK9rJd6cA",
        authDomain: "cashless-appdoc.firebaseapp.com",
        projectId: "cashless-appdoc",
        storageBucket: "cashless-appdoc.appspot.com",
        messagingSenderId: "3827619937",
        appId: "1:3827619937:web:4b0bedbaa556b077897220",
        measurementId: "G-9Y22LJCR68"
    };
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore();
    const collectionRef = "expenses";
    const colRef = collection(db, collectionRef);
    

    /* ################################# */
    // EXPENSE REGISTRATION CONSTANTS
    const [unitsCatalog, setUnitsCatalog] = useState(["Wait..."]);
    const [productsCatalog, setProductsCatalog] = useState([]);
    const [accountCatalog, setAccountsCatalog] = useState([]);
    const [categoriesCatalog, setCategoriesCatalog] = useState(["Wait..."]);
    const [expensesCatalog, setExpensesCatalog] = useState(["Wait..."])

    
    

    /* ################################# */
    // PAGE CONSTANTS
    const [listExpenses, setListExpenses] = useState(["Wait..."]);
    
    const [expenseStore, setExpenseStore] = useState("");
    const [expenseBankAccount, setExpenseBankAccount] = useState("");
    const [expensePayMethod, setExpensePayMethod] = useState("");
    const [paymentsOptions, setPaymentsOptions] = useState(["Wait..."])

    /* ################################# */
    // PAGE RENDER
    // once    
    const firstRender = useEffect( () => {
        console.log("First render")
        const fetchData = async () => {
            const getPU = await getProductUnits();
            const getPC = await getProductCatalog();
            const getCt = await getAccountsCatalog();
            const getCC = await getCategoriesCatalog();
            const getEC = await getExpensesCatalog("default")

            setUnitsCatalog(getPU);
            setProductsCatalog(getPC);
            setAccountsCatalog(getCt);
            setCategoriesCatalog(getCC);
            setExpensesCatalog(getEC);
        }
        fetchData();
    }, []);

    const [productRegister, setProducRegister] = useState([])

    ////////////////
    // draw the list of expenses
    const draw = useEffect( () => {
        if(expensesCatalog[0] !== "Wait..."){
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

            
            setPaymentsOptions(
                accountCatalog[0].PaymentMethods
            ) 
            setExpenseBankAccount(accountCatalog[0].Name)
            setExpensePayMethod(accountCatalog[0].PaymentMethods[0])
        }
    }, [expensesCatalog, productRegister])
    
    
    function addProduct(){
        const newRegister = productRegister;
        newRegister.push(<ProductAddOn />)
        setProducRegister(
            newRegister.map( key => (
                key
            ))
        );
    }

    /////////////////////////////////
    /* RETURN */
    return(
        <>
        <ExpenseContext.Provider value={ {unitsCatalog, productsCatalog, accountCatalog, categoriesCatalog, expensesCatalog } }>

            <h1>New Expense</h1>
            <div className="addNewExpense">
                <div id="productsBox">
                    <ProductAddOn />
                    {productRegister}
                </div>

                <button onClick={addProduct}>Add Product</button>

                <ul>
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
                            setExpenseBankAccount(key)
                        }}  />  

                    <SelectBox 
                        label="Payment Method: "
                        options={paymentsOptions}
                        onChangeHandler={ (key) => { 
                            setExpensePayMethod(key)
                        }}  />   
            </div>
            <h2>List of Expenses</h2>
            <ul>
                {listExpenses}
            </ul>

        </ExpenseContext.Provider>
        
        </>
    )
}
export default RegisterExpenses;