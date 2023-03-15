import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore"

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

const collectionRef = "bank_accounts";
const colRef = collection(db, collectionRef);


/* The bank account register it will contain:
        bank account:
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

/* ################################## */
// GET PAYMENT OPTIONS
// Return the default list of payment options
/* ########################## */
export async function getPaymentsCatalog(){
    const docSnap = await getDoc(doc(db, "settings", "account_settings"));
    if (docSnap.exists()) {
        return docSnap.data().payment_options;
    } else {
        // doc.data() will be undefined in this case
        console.error("No such document!");
        return "";
    }
}

/* ################################## */
// GET CURRENCY OPTIONS
// Return the default list of avaliable currencys
/* ########################## */
export async function getCurrecyCatalog(){
    const docSnap = await getDoc(doc(db, "settings", "account_settings"));
    if (docSnap.exists()) {
        return docSnap.data().currency_options;
    } else {
        // doc.data() will be undefined in this case
        console.error("No such document!");
        return "";
    }
}

/* ################################## */
// CREATE BANK ACCOUNT
// Create a Bank Account
/* ########################## */
export async function addBankAccount(data){
    await addDoc(colRef, data).then(() => {
        console.log("New Bank Created");        
    }).catch( err => console.log(err))
}

/* ################################## */
// GET CATALOG
// Return a list of all existing bank accounts
/* ########################## */
export async function getAccountsCatalog(){
    let bankCatalog = []
    const queryList = query(collection(db, collectionRef), orderBy('Name', 'asc')) 
    await getDocs(queryList).then( (snapshot) => {
        snapshot.docs.forEach( (doc) => {
            if(doc.data().Status === true){
                bankCatalog.push( {...doc.data(), id: doc.id} )
            }
        });        
    }).catch( (err) => {
        console.log("err")
    });
    return bankCatalog;
}

/* ################################## */
// DELETE BANK ACCOUNT
// Deletes a bank account and returns a new catalog
/* ########################## */
export async function deletBankAccount(id){
        const docRef = doc(db, collectionRef, id);
        await deleteDoc(docRef)
            .then( () => {
                console.log("Bank Account Deleted");

                return getAccountsCatalog();
                
            }).catch( (err) => console.log(err))
    }


    
/* ################################## */
// GET BANK STATUS
// Return the current status of a bank account
/* ########################## */
export async function getAccountStatus(id){
    const docSnap = await getDoc(doc(db, collectionRef, id));
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        alert("Inexistent bank account");
        return undefined;
    }
}


/* ################################## */
// Add Bank Expense
// Add a register to the bank balance and updates the bank current balance
/* ########################## */
export async function addBankExpense(bankId, expenseData){
    console.log(bankId, expenseData)
    ////////////////////////
    // Add Debit Movment Registration
    let ref = collection(db, collectionRef, bankId, "balance");
    await addDoc(ref, expenseData)
        .then((balanceItem) => {
            console.log("New balance added", balanceItem)

            ////////////////////////
            // Updates bank balance
            const ref = doc(db, collectionRef, bankId);
            updateDoc(ref, {
                CurrentFunds: expenseData.NewBalance 
            }).then( (newBalance) => {
                console.log(newBalance, "Bank balance updated");
                
            }).catch( err => console.log(err));

        }).catch( err => console.log(err))
    
}
