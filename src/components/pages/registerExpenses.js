import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
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
    const [productCategories, setProductCategories] = useState([]);
    const [productCategoriesCatalog, setProductCategoriesCatalog] = useState([]);
    const [productSubCategories, setProductSubCategories] = useState([]);
    
    /* ########################## */
    // Interface Constants
    const [listExpenses, setListExpenses] = useState(["Wait..."])

    /* ########################## */
    // Expense Constants
    const [expenseName, setExpenseName] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expenseSubCategories, setExpenseSubCategories] = useState([]);
    const [expensePrice, setExpensePrice] = useState(0.00);
    const [expenseAmmount, setExpenseAmmount] = useState(1);
    const [expenseAmmountType, setExpenseAmmountType] = useState("")
    const [expenseBankAccount, setExpenseBankAccount] = useState("");
    const [expensePayMethod, setExpensePayMethod] = useState("");



    /* ########################## */
    // Get the list of bank accounts
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
            setExpenseBankAccount(accountCatalog[0].Account)
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
        setExpensePayMethod( accountFind.PayMethods[0])
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
                ),
                setExpenseAmmountType(snap.data().Weights[0])
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
                <li key={i} onClick={ () => { 
                    setExpenseName(product.Name);
                    document.getElementById("expenseName").value = product.Name;
                    let li = document.querySelectorAll(".optionList li")
                    li.forEach( (node) => {
                        node.classList.remove("show")
                    })
                } }>{product.Name}</li>
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
        setExpenseName(product)
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
    // Get categories
    async function getProductCategories(){
        const categories = []; 
        const queryList = query(collection(db, "categories"), orderBy('Name', 'asc')) 
        await getDocs(queryList).then( (snapshot) => {              
            snapshot.docs.forEach((doc) => {
                categories.push({ ...doc.data(), id: doc.id})
            })
            
            setProductCategoriesCatalog(categories);
            setProductCategories(
                categories.map((key, i) => (
                    <option key={i}>
                        {key.Name}
                    </option>
                ))
            );
            setSubCategories(categories[0].Name, categories)
            setExpenseCategory(categories[0].Name)
        }).catch( (err) => {
            console.log("err")
        });
    }
    
    /* ########################## */
    // Define subcategories
    function setSubCategories(category, catalog){
        setProductSubCategories("");
        const subCatsCatalog = catalog.find( ({Name}) => Name == category );
        if( subCatsCatalog.Childs.length > 0){
            // clean the subcategories
            const selector = document.querySelector(".subCategorySelector");
            selector.childNodes.forEach( (item) => {
                item.childNodes[0].checked = false;
            })
            
            // set the subcategories
            setProductSubCategories(
                subCatsCatalog.Childs.map( (item, i) => (
                    <label key={i}>
                        <input type="checkbox" value={item} onClick={ () => {
                        manageSubCategories({item})
                    }}/>{item}
                    </label>
                )),
            )
        } else {
            setProductSubCategories([]);
        }
        setExpenseSubCategories([]);
    }
 
    /* ########################## */
    // Manange subcategories
    function manageSubCategories(subCategories){
        let subCategoriesTemp = [];
        const selector = document.querySelector(".subCategorySelector");
        selector.childNodes.forEach( (item) => {
            if( item.childNodes[0].checked) {
                subCategoriesTemp.push(item.childNodes[0].value)
            }
        });
        setExpenseSubCategories(subCategoriesTemp)
    }

    /* ########################## */
    // Get expenses
    async function getExpenses(){
        const expensesList = []
        const queryList = query(colRef, orderBy('Name', 'asc')) 
        await getDocs(queryList).then( (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                expensesList.push( {...doc.data(), id: doc.id} )
            });
            setListExpenses(
                expensesList.map( (key) => (
                    <li>
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
            )
        })
        
    }

    /* ########################## */
    // Add and expense
    async function addExpense(){
        await addDoc(colRef, {
            Name: expenseName,
            Category: expenseCategory,
            SubCategories: expenseSubCategories,
            Price: expensePrice,
            Ammount: expenseAmmount,
            AmmountType: expenseAmmountType,
            Account: expenseBankAccount,
            PaymentMethod: expensePayMethod,
            CreatedAt: serverTimestamp()
        }).then( (res) => {
            console.log("Expense Added", res)
            getExpenses();
        }).catch( (err) => console.log(err))
    }

    useEffect( () => {
        getProducts();
        getProductCategories();
        getBankAccounts();
        getProductUnits();
        getExpenses();
    }, [])

    return(
        <>
        
            <h1>New Expense</h1>

            {expenseName} / {expenseCategory} / {expenseSubCategories} / {expensePrice} / {expenseAmmount} / {expenseAmmountType} / {expenseBankAccount} / {expensePayMethod}
            <form>
                <div className="productGroup">
                    <input id="expenseName" name="Product" defaultValue={expenseName} onKeyUp={ (e) => { filterList(e.target.value) } } />
                    <div className="productFilter">
                        <ul className="optionList">
                            {productListOptions}
                        </ul>
                    </div>
                    <button type="button" id="quickAddNewProduc">Add</button>
                </div>
            </form>
            <div className="categorySelector">
                <select onChange={(e) => { 
                    setSubCategories(e.target.value, productCategoriesCatalog); 
                    setExpenseCategory(e.target.value)
                }}>
                    {productCategories}
                </select>
                <div className="subCategorySelector">
                    {productSubCategories}
                    
                </div>
            </div>
            Price: <input type="number" value={expensePrice} onChange={ (e) => { setExpensePrice(e.target.value) }} />
            Amount: <input type="number" value={expenseAmmount}  onChange={ (e) => { setExpenseAmmount(e.target.value) }} />
            Amount type:  
            <select onChange={ (e) => { setExpenseAmmountType(e.target.value) }} >
                {weightUnits}
            </select>
            Bank Account:
            <select onChange={ (e) => { 
                setPayMethodsChange(accountCatalog, e.target.value);
                setExpenseBankAccount(e.target.value)
                let account = accountCatalog.find( ({Account}) => Account === e.target.value)
                console.log()
                setExpensePayMethod(account.PayMethods[0])
            } }>
                {bankAccounts}
            </select>
            Payment Method:
            <select onChange={ (e) => { setExpensePayMethod(e.target.value) }}>
                {payMethods}
            </select>


            <button onClick={addExpense}>Save</button>

        
            <h2>Registered Expenses</h2>
            <ul>
                {listExpenses}
            </ul>


        </>
    )
}

export default RegisterExpenses;