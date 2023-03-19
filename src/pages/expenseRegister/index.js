import React, { createContext, useCallback, useEffect, useState } from "react";
import { getAnalytics } from "firebase/analytics";
import { getProductUnitsCatalog } from "../../globalOperators/globalGetters";
import { getAccountsCatalog } from "../../firebase/accounts";

import { currencySymbol, formatValueTo2Digit, formatValueToMoney } from "../../tools/mathTools.js";
import ProductAddOn from "./components/productAddOn";

import AccountSelects from "./components/accountsSelects";

import { expenseRegisterProcess } from "./tools/expenseRegister";

import { getProductCatalog } from "../../firebase/productRegistration";
import { getCategoriesCatalog } from "../../firebase/categories";
import { deleteExpense, getExpensesCatalog } from "../../firebase/expenseRegistration";

import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Input from "../../components/forms/input";

import PrimaryButton from "../../components/elements/buttons/primaryButton";
import Alert from "../../components/elements/messages/alert";
import Loader from "../../components/elements/loader";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import ConfirmDialog from "../../components/elements/messages/confirm";
import { getDate } from "../../tools/dateTools";


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

    const [generalId, setGeneralId] = useState(1);
    
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
    const [listExpenses, setListExpenses] = useState(<Loader />); // draw the expense list
    const [productMultipleRegister, setProducMultipleRegister] = useState([]) // allows to draw the multiple register

    //////////////////////
    // messages
    const [returningAlerts, setReturningAlerts] = useState("");

    /* ################################# */
    // First page render, gets the catalog of avaliable information
    async function fetchData(){
        await getProductCatalog().then(
            res => setProductsCatalog(res)
        );
        await getAccountsCatalog().then(
            (res) => {
                setAccountsCatalog(res)
                setExpenseBankCurrency(currencySymbol("Euro") );                    
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
    const firstRender = useEffect( () => {
        fetchData()
    }, []);



    ///////////////////////
    // Delet Functions
    function denyDelete(){
        setReturningAlerts(null);
    }

    let allowDelete = true;
    function deleteExpenseItemList(key){
        if(typeof key !== "string"){
            console.log("infos:", key)

            let bank = accountCatalog.find( ({Name}) => Name == key.account);
            let deleteInfos = {
                expenseId: key.id,
                bankId: bank.id,
                products: key.products
            }
            const deleteOption = <span 
                    className="delete-item-list" 
                    onClick={ () => { 
                        setReturningAlerts(
                            <ConfirmDialog 
                                message="Do you realy want to delete this expense register?"
                                onConfirmHandler={() => { 
                                    
                                    // delete expense
                                    deleteExpense(deleteInfos).then(
                                        (response) => {
                                            setReturningAlerts(
                                                <Alert
                                                    message={response.message}
                                                    classes={response.classes}
                                                    display={response.display}
                                                    />
                                            );
                                            setTimeout(() => {
                                                window.location.href = "/expenses"
                                            }, 4000)

                                        }
                                    )
                                }}
                                onDenyHandle={denyDelete}
                                />)
                        }}>
                    <FontAwesomeIcon icon={faX} />
                </span>
            if(allowDelete){
                allowDelete = false;
                return deleteOption;
            }
        }
    }

    ///////////////////////////////
    // return products from the catalog
    function getProductsFromCatalog(products){
        if(productsCatalog && products){
            let list = [];
            products.forEach( (key, i) => {
                let product = productsCatalog.find( ({id}) => id == key)
                if(product){
                    list.push(<div key={i} className="product-name">{product.Name}  <span className="product-price">{product.LastPrice}{expenseBankCurrency}</span></div>);
                } else {
                    return "No data avaliable..."
                }
            })
            return list; 
        }
    }

    /////////////////////////
    // Once with data, it populates and updates the interface on data change
    const draw = useEffect( () => {
        // draw the list of expenses
        if(accountCatalog && categoryCatalog && expensesCatalog){
            /// redirects if there are not accounts or categories
            if(
                accountCatalog[0] == "No accounts registered yet" || 
                categoryCatalog[0] == "No categories registered yet"
            )
            {   
                console.error("You're not ready to be here.")
                window.location.href = "/expenses/registernotavaliable";
            } 


            // sets a blank screen if there are no expenses yet
            if(expensesCatalog[0] == "No expenses registered yet"){
                setListExpenses(
                    expensesCatalog.map( (key, i) => ( 
                        <li key={i} className="empty-list">  
                            {key}
                        </li>
                    ))
                )
            // if there are expenses, draw the list
            } else {
                setListExpenses(
                    expensesCatalog.map( key => ( 
                        <li key={key.id}>  
                            {key.store}
                            {deleteExpenseItemList(key)}
                            <span className="table-list-right-side table-list-currency">
                                {key.totalExpense} {expenseBankCurrency}
                            </span>
                            <div className="li-container">
                                <span className="li-container-label">
                                    <strong>Products:</strong> <br/>
                                    {getProductsFromCatalog(key.products)}
                                </span>
                                <span className="li-container-label">
                                    <strong>Account:</strong> <br/>
                                    {key.account} by {key.paymenMethod}
                                </span>
                                <span className="li-container-label">
                                    <strong>Date:</strong> <br/>
                                    {getDate(key.CreatedAt)}
                                </span>

                            </div>
                        </li>
                    ))
                ); 
            };                
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

    //////////////////////
    // set total expense cost
    function calcTotalPurchasePrice(){
        let totalPurchase = 0;
        expenseRegister.products.forEach( key => {
            totalPurchase = Number(totalPurchase) +  Number(key.TotalPrice);
        })
        setTotalPurchasePrice(formatValueTo2Digit(totalPurchase)); 
    }

    /////////////////////////////////
    // Register Expense
    async function registerExpense(){
        setReturningAlerts(<Loader type="fullscreen" /> )
        setPurchaseProductList(<Loader />)
        await expenseRegisterProcess(expenseRegister, productsCatalog).then(
            (response) => {
                setReturningAlerts(
                    <Alert
                        message={response.message}
                        classes={response.classes}
                        display={response.display}
                        />
                );
                setTimeout(() => {
                    window.location.href = "/expenses"
                }, 4000)
            }
        )
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

    function show(){
        console.log(expenseRegister)
    }

    /////////////////////////////////
    /* INTERFACE */
    return(       
        <ExpenseContext.Provider value={globalVariables}>
            <button onClick={show}>Show</button>
            <PageTitle text="Expenses" />
            <PageBox>
                <SectionTitle text="Add a new expense" />  
                <div id="productsBox" className="product-register-box">
                    <ProductAddOn generalId={"1"} />
                    {productMultipleRegister}
                <PrimaryButton
                    label="Add product"
                    classes="green"
                    onClickHandler={addProduct} />
                </div>

                <Input
                    id="store"
                    label="Store:"
                    placeholder="Store you are buying it"
                    value={expenseStore}
                    onChangeHandler={ (storeName) => { 
                        setExpenseStore(storeName);
                    }}
                    />   
            
                <AccountSelects /> 
            
                <div className="read-field-value money">
                    Total:  {totalPurchasePrice} {expenseBankCurrency}
                </div>

                <PrimaryButton
                        label="Add purchase"
                        onClickHandler={registerExpense} />
            </PageBox>

            <PageBox>
                <SectionTitle text="Expenses" />
                <ul className="table-list">
                    {listExpenses}
                </ul>
            </PageBox>
            {returningAlerts}  
        </ExpenseContext.Provider>
        
    )
}
export default RegisterExpenses;