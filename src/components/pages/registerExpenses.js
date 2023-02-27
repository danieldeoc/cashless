import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
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
function RegisterExpenses(){    
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

    /* ########################## */
    // Form Constants
    const [bankAccounts, setBankAccounts] = useState([]);
    const [accountCatalog, setAccountCatalog] = useState([]);
    const [payMethods, setPayMethods] = useState([]);
    const [weightUnits, setWeightUnits] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productListOptions, setProductListOptions] = useState([]);
    
    /* ########################## */
    // Interface Constants
    const [listExpenses, setListExpenses] = useState(["Wait..."])

    /* ########################## */
    // Expense Constants
    const [expenseName, setExpenseName] = useState("")

    function getBankAccounts(){
        let bankAccountLIst = [];
        let accountCatalog = [];
        const queryList = query(collection(db, "bank_accounts"), orderBy('Name', 'asc')) 
        getDocs(queryList).then( (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                if(doc.data().Status === true){
                    bankAccountLIst.push( {...doc.data(), id: doc.id} )
                    
                    accountCatalog.push({
                         Account: doc.data().Name,
                         Currency: doc.data().Currency,
                         PayMethods: doc.data().PaymentMethods
                    })
                }
            });
            setAccountCatalog(accountCatalog)
            setPayMethodsChange(accountCatalog, accountCatalog[0].Account)
            setBankAccounts(
                bankAccountLIst.map( (key, i) => (
                    <option key={i}>
                        {key.Name}
                    </option>
                ))
            );
        });
    }

    /* ########################## */
    // Get the paymethods of an account
    function setPayMethodsChange(catalog, AccountName){
        const accountFind = catalog.find( ({Account}) => Account === AccountName);
        setPayMethods(
            accountFind.PayMethods.map( (payM, i) => (
                <option key={i} >{payM}</option>
            ))  
        )
    }

    /* ########################## */
    // Get units
    function getProductUnits(){
        getDoc(doc(db, "settings", "product_settings"))
            .then( (snap) => (
            setWeightUnits(
                snap.data().Weights.map( (key, i) => (
                    <option key={i}>{key}</option>
                ))
            )
        ))
    }

    /* ########################## */
    // Get product list cache
    async function getProducts(){
        let productCatalog = [];
        const queryList = query(collection(db, "products_catalog"), orderBy('Name', 'asc')) 
        await getDocs(queryList).then( (snapshot) => {              
            snapshot.docs.forEach((doc) => {
                productCatalog.push({ ...doc.data(), id: doc.id})
            })
            setProductList(productCatalog);
            produceProductFilter(productCatalog)
        })
        
    }

    /* ########################## */
    // Generates quick filter
    function produceProductFilter(catalog){
        console.log(productList)
        setProductListOptions(
            catalog.map( (product, i) => (
                <li key={i} onClick={ () => { setExpenseName(product.Name) } }>{product.Name}</li>
            ))

        )
    }

    /* ########################## */
    // Add filter functionalit
    function filterList(product){
        console.log(product)
        const addBt = document.getElementById("quickAddNewProduc")
        const list = document.querySelectorAll(".optionList li")
        const buttonShow = productList.find( ({Name}) => Name.includes(product) );
        
        if(buttonShow != undefined){
            addBt.classList.add("hide")
        } else {
            addBt.classList.remove("hide")
        }
        list.forEach( (node) => {
            if(node.textContent.includes(product) && product.length > 0){
                node.classList.add("show")
            } else {
                node.classList.remove("show")
            }
        })
        
    }
 
    /* ########################## */
    // Get expenses
    function getExpenses(){
        const expensesList = []
        
    }

    /* ########################## */
    // Add and expense
    function addExpense(){

    }

    useEffect( () => {
        getProducts();
        getBankAccounts();
        getProductUnits();
        getExpenses();
    }, [])

    return(
        <>
        
            <h1>New Expense</h1>
            <form>
                <div className="productGroup">
                    <input name="Product" defaultValue={expenseName} onKeyUp={ (e) => { filterList(e.target.value) } } />
                    <div className="productFilter">
                        <ul className="optionList">
                            {productListOptions}
                        </ul>
                    </div>
                    <button type="button" id="quickAddNewProduc">Add</button>
                </div>
            </form>
            <div className="categorySelector">
                <select>
                    <option></option>
                </select>
                <div className="subCategorySelector">
                    <input type="checkbox" /> SubCategory
                </div>
            </div>
            Price: <input type="number" />
            Amount: <input type="number" />
            Amount type: 
            <select>
                {weightUnits}
            </select>
            Bank Account:
            <select onChange={ (e) => { setPayMethodsChange(accountCatalog, e.target.value) } }>
                {bankAccounts}
            </select>
            Payment Method:
            <select>
                {payMethods}
            </select>


            <button>Save</button>

        
            <h2>Registered Expenses</h2>
            {listExpenses}


        </>
    )
}

export default RegisterExpenses;