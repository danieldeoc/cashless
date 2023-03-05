import React, { useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { getProductCatalog, getProductUnits,getExpensesCatalog, getAccountsCatalog, getCategoriesCatalog } from "../../globalOperators/globalGetters";
import InputAutoComplete from "../../components/forms/inputAutocomplet";
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
    // EXPENSE CONSTANTS
    const [expenseName, setExpenseName] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expenseSubCategory, setExpenseSubCategory] = useState("");
    const [expenseAmmount, setExpenseAmmount] = useState(1);
    const [expenseAmmountType, setExpenseAmmountType] = useState("");
    const [expensePrice, setExpensePrice] = useState("0,00");
    const [expenseTotalPrice, setExpenseTotalPrice] = useState("0,00");
    const [expenseStore, setExpenseStore] = useState("");
    const [expenseBankAccount, setExpenseBankAccount] = useState("");
    const [expensePayMethod, setExpensePayMethod] = useState("");

    /* ################################# */
    // PAGE CONSTANTS
    const [listExpenses, setListExpenses] = useState(["Wait..."]);
    
    const [subCategoriesOptions, setSubCategoriesOptions] = useState(["Wait..."])
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
            setExpenseCategory( categoriesCatalog[0].Name);
            setExpenseSubCategory( categoriesCatalog[0].Childs)
            setExpenseAmmountType( unitsCatalog[0])
            setSubCategoriesOptions(
                categoriesCatalog[0].Childs
            );
            setPaymentsOptions(
                accountCatalog[0].PaymentMethods
            )
            setExpenseBankAccount(accountCatalog[0].Name)
            setExpensePayMethod(accountCatalog[0].PaymentMethods[0])

        }
    }, [expensesCatalog])

    ///////////////////////
    // products exange
    const producVariablesChange = useEffect(() => {
        
        let expenseFinder = productsCatalog.find( 
            ({Name}) => Name === expenseName
        );
        if(expenseFinder !== undefined){

            console.log("ex", expenseFinder);
    
            setExpenseCategory(expenseFinder.category);
            setExpenseSubCategory(expenseFinder.Childs)

          //  subCategoriesOptions( expenseFinder.Childs)
        }

    }, [expenseName])




    /////////////////////////////////
    /* RETURN */
    return(
        <>
            <ul>
                <li>Nome: {expenseName} </li>
                <li>Categoria: {expenseCategory} </li>
                <li>Sub-categoria: {expenseSubCategory} </li>
                <li>Ammount: {expenseAmmount} </li>
                <li>Ammount type: {expenseAmmountType} </li>
                <li>Price: {expensePrice}</li>
                <li>Total price: {expenseTotalPrice}</li>
                <li>Store: {expenseStore} </li>
                <li>Bank: {expenseBankAccount}</li>
                <li>Payment Method: {expensePayMethod}</li>
            </ul>
        

            <h1>New Expense</h1>
            <div className="addNewExpense">
                <blockquote>
                    <h3>Product</h3>
                    <InputAutoComplete 
                        id="productCatalogFilter" 
                        value={expenseName}
                        list={productsCatalog}
                        onChangeHandler={ (key) => { 
                            setExpenseName(key);
                        }}
                         />
                    <SelectBox 
                        label="Categoria:"
                        value={expenseCategory}
                        options={categoriesCatalog.map( key => key.Name )} 
                        onChangeHandler={ (key) => { 
                            console.log(key, categoriesCatalog)
                            setSubCategoriesOptions("");
                            setExpenseCategory(key);
                            let subOptions = categoriesCatalog.find(({Name}) => Name === key)
                            setExpenseSubCategory(subOptions.Childs[0])
                            setSubCategoriesOptions(subOptions.Childs)
                        }}/>
                    <SelectBox 
                        label="Sub-categoria"
                        options={ subCategoriesOptions }
                        onChangeHandler={ (key) => { 
                            setExpenseSubCategory(key)
                        }} />

                    

                    <Input
                        id="ammount"
                        label="Ammount:"
                        value={expenseAmmount}
                        onChangeHandler={ (key) => { 
                            setExpenseAmmount(key)
                        }}
                        />

                    <SelectBox 
                        label="Units"
                        options={unitsCatalog}
                        onChangeHandler={ (key) => { 
                            setExpenseAmmountType(key)
                        }}  />

                    <Input
                        id="price"
                        label="Price per unit:"
                        value={expensePrice}
                        onChangeHandler={ (key) => { 
                            setExpensePrice(key)
                            let totalPrice = key * expenseAmmount;
                            //let formatedPrice = totalPrice.replace(",", ".");
                            setExpenseTotalPrice(totalPrice)
                        }}
                        />

                    <span>
                        {expenseTotalPrice}
                    </span>

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
                        label="Account"
                        options={paymentsOptions}
                        onChangeHandler={ (key) => { 
                            setExpensePayMethod(key)
                        }}  />      

                </blockquote>
            </div>
            <h2>List of Expenses</h2>
            <ul>
                {listExpenses}
            </ul>
        </>
    )
}
export default RegisterExpenses;