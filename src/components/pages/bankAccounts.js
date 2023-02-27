import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
    /* In the bank account register it will:
        Add new bank accounts:
            {
                id:
                Name:
                InitialDeposit: $
                Currency:
                PaymentMethods: []
                Status: true|false // if open or closed
                Movments: // a collection of movments containing
                    {
                        date:
                        movmentType:
                        operatingValue:
                        payMethod:
                        position:
                    }
            }
    */

function BankAccounts(){

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
    const collectionRef = "bank_accounts";
    const colRef = collection(db, collectionRef);

    /* ############################# */
    // Account Constants
    const [bankName, setBankName] = useState("");
    const [initialDeposit, setInitialDeposit] = useState(0);
    const [bankCurrency, setBankCurrency] = useState("Euro");
    const [bankStatus, setBankStatus] = useState(true);
    const [bankPaymentsMethods, setBankPaymentsMethods] = useState(["Account Debit"]);
    
    /* ############################# */
    // Interface constants
    const [listBankAccounts, setListBankAccounts] = useState(["Wait..."]);

    /* ############################# */
    // Add an account
    function addBankAccount(){
        addDoc(colRef, {
            Name: bankName,
            InitialDeposit: initialDeposit,
            CurrentFunds: initialDeposit,
            Currency: bankCurrency,
            PaymentMethods: bankPaymentsMethods,
            Status: bankStatus,
            CreatedAt: serverTimestamp()
        }).then(() => {
            setBankName("");
            setInitialDeposit(0.00);
            setBankCurrency("Euro");
            setBankPaymentsMethods(["Account Debit"]);
            document.getElementById("bankCurrency").value = "Euro";
            document.getElementById("cash").checked = false;            
            document.getElementById("accountdebit").checked = true;
            document.getElementById("debitCard").checked = true;
            getBankAccounts();
            console.log("New Bank Created")
        }).catch( err => console.log(err))
    }

    /* ############################# */
    // Payment Methods 
    function payMethodsCheck(){
        let payMethods = []
        const payBox = document.querySelector(".paymethodsOptions");
        const cash = document.getElementById("cash").checked;
        if(cash === true ? payMethods.push("cash") : "");
        const accountDebit = document.getElementById("accountdebit").checked;
        if(accountDebit === true ? payMethods.push("Account Debit") : "");
        const debitCard = document.getElementById("debitCard").checked;
        if(debitCard === true ? payMethods.push("Debit Card") : "");
        setBankPaymentsMethods(payMethods)
    }

    /* ############################# */
    // Get Bank Accounts
    function getBankAccounts(){
        const bankAccountLIst = [];
        const queryList = query(colRef, orderBy('Name', 'asc')) 
        getDocs(queryList).then( (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                bankAccountLIst.push( {...doc.data(), id: doc.id} )
            });
            setListBankAccounts(
                bankAccountLIst.map( (key, i) => (
                    <li key={i}>
                        {key.Name}
                        {key.Currency}
                        {key.InitialDeposit}
                        {key.CurrentFunds}
                        {key.PaymentMethods}
                        {key.Status}
                        {Date(key.CreatedAt)}
                        <i onClick={ () => { deletBankAccount(key.id) } }>X</i>
                    </li>
                ))
            );
                
        });
    }

    /* ############################# */
    // Delet Bank Accounts
    function deletBankAccount(id){
        const docRef = doc(db, collectionRef, id);
        deleteDoc(docRef)
            .then( () => {
                console.log("deleted");
                getBankAccounts();
            }).catch( (err) => console.log(err))
    }

    useEffect( () => {
        getBankAccounts();
    }, [])

    return(
        <>
            Bank Accounts
            {bankName} / {bankCurrency} / {initialDeposit} / {bankPaymentsMethods} 
            <div className="addBankAccount">
                Bank: <input type="text" value={bankName} onChange={ (e) => { setBankName(e.target.value) } } />
                Initial Deposit: <input type="number" value={initialDeposit} onChange={ (e) => { setInitialDeposit(e.target.value) } } /> 
                Currency: <select id="bankCurrency" onChange={ (e) => { setBankCurrency(e.target.value) } }>
                    <option>Euro</option>
                    <option>Real</option>
                    <option>Dolar</option>
                    <option>Libra</option>
                </select>
                PaymentMethods:
                <div className="paymethodsOptions">
                    <input id="cash" type="checkbox" onClick={payMethodsCheck} /> Cash
                    <input id="accountdebit" defaultChecked="true" name="accountdebit" type="checkbox"  onClick={payMethodsCheck} /> Account Debit
                    <input id="debitCard" name="debitcard" type="checkbox"  onClick={payMethodsCheck} /> Debit Card
                </div>
            </div>
            <button onClick={addBankAccount}>Save</button>
            <h2>Avaliable Bank Accounts</h2>
            <ul>
                {listBankAccounts}
            </ul>
        </>
    )
}

export default BankAccounts;