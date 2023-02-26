import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"

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
    const [bankPaymentsMethods, setBankPaymentsMethods] = useState([]);


    function addBankAccount(){
        addDoc(colRef, {
            Name: bankName,
            InitialDeposit: initialDeposit,
            Currency: bankCurrency,
            PaymentMethods: bankPaymentsMethods,
            Status: bankStatus,
            CreatedAt: serverTimestamp()
        }).then(() => {
            
            console.log("New Bank Created")
        }).catch( err => console.log(err))
    }


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

            function multiOptionsSet(value){
                console.log(value)
                //setBankPaymentsMethods()
            }

    return(
        <>
            Bank Accounts
            {bankName} / {bankCurrency} / {initialDeposit} / {bankPaymentsMethods} 
            <div className="addBankAccount">
                Bank: <input type="text" onChange={ (e) => { setBankName(e.target.value) } } />
                Initial Deposit: <input type="number" onChange={ (e) => { setInitialDeposit(e.target.value) } } /> 
                Currency: <select  onChange={ (e) => { setBankCurrency(e.target.value) } }>
                    <option>Euro</option>
                    <option>Real</option>
                    <option>Dolar</option>
                    <option>Libra</option>
                </select>
                PaymentMethods:
                <select multiple  onChange={ (e) => { multiOptionsSet(e.target.value) } }>
                    <option>Cash</option>
                    <option>Account Debit</option>
                    <option>Debit Card</option>
                </select>
            </div>
        
        
        </>




    )
}

export default BankAccounts;