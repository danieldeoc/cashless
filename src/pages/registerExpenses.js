import React, { useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { getProductCatalog, getProductUnits,getExpensesCatalog, getAccountsCatalog, getCategoriesCatalog } from "../globalOperators/globalGetters";
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
    const [productUnits, setProductUnits] = useState([]);
    const [productsCatalog, setProductsCatalog] = useState([]);
    const [accountCatalog, setAccountsCatalog] = useState([]);
    const [categoriesCatalog, setCategoriesCatalog] = useState([]);
    const [expensesCatalog, setExpensesCatalog] = useState(["Wait..."])

    /* ################################# */
    // EXPENSE CONSTANTS
    const [expenseName, serExpenseName] = useState("");
    const [expenseCategory, setExpenseCategory] = useState([]);
    const [expenseSubCategories, setExpenseSubCategories] = useState([]);
    const [expensePrice, setExpensePrice] = useState("0,00");
    const [expenseAmmount, setExpenseAmmount] = useState(1);
    const [expenseAmmountType, setExpenseAmmountType] = useState("");
    const [expenseStore, setExpenseStore] = useState("");
    const [expenseBankAccount, setExpenseBankAccount] = useState("");
    const [expensePayMethod, setExpensePayMethod] = useState("");

    /* ################################# */
    // PAGE CONSTANTS
    const [listExpenses, setListExpenses] = useState(["Wait..."])

    /* ################################# */
    // PAGE RENDER
    // once
    async function getValues(){
        
    }
    
    const firstRender = useEffect( () => {
        console.log("First render")
        const fetchData = async () => {
            const getPU = await getProductUnits();
            const getPC = await getProductCatalog();
            const getCt = await getAccountsCatalog();
            const getCC = await getCategoriesCatalog();
            const getEC = await getExpensesCatalog("default")

            setProductUnits(getPU);
            setProductsCatalog(getPC);
            setAccountsCatalog(getCt);
            setCategoriesCatalog(getCC);
            setExpensesCatalog(getEC);
        }
        fetchData();
    }, []);
    
    // dependencies
    const registrationData = [
        productUnits, 
        productsCatalog, 
        accountCatalog, 
        categoriesCatalog, 
        expensesCatalog]

    const registrationRender = useEffect( () => {
        console.log("Var updates")
        /*
        console.log("Product Units: ", productUnits);
        console.log("Product Catalogs: ", productsCatalog)
        console.log("Accounts Catalogs: ", accountCatalog)
        console.log("Categories Catalogs: ", categoriesCatalog)
        console.log("Expenses Catalogs: ", expensesCatalog)
        */
        
    }, [registrationData]);  

    const draw = useEffect( () => {
        console.log("init", listExpenses, expensesCatalog)
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
        }
    }, [expensesCatalog])


    /////////////////////////////////
    /* RETURN */
    return(
        <>
            <ul>
                {listExpenses}
            </ul>
        </>
    )
}

export default RegisterExpenses;