import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, where, Timestamp } from "firebase/firestore"
import { returnMessage } from "../tools/alertTools";
import { getAuthCredentias } from "./auth";

const firebaseConfig = {
    apiKey: "AIzaSyC1BQg_aO360A1QUQiQaOAOatwBQqu6lu8",
    authDomain: "cashless-20f70.firebaseapp.com",
    projectId: "cashless-20f70",
    storageBucket: "cashless-20f70.appspot.com",
    messagingSenderId: "735776965674",
    appId: "1:735776965674:web:22b9fae0f28ca91603af53",
    measurementId: "G-JF2X1KH38Z"
  };
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

const credentials = getAuthCredentias();
const userDb = "userdb_"+credentials.id;
const superDocRef = "accounts_catalog";
const collectionRef = "bank_accounts";
const colRef = collection(db, userDb, superDocRef, collectionRef);


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
// GET CATALOG
// Return a list of all existing bank accounts
/* ########################## */
export async function getAccountsCatalog(){
    let bankCatalog = [];
    const queryList = query(colRef, orderBy('Name', 'asc')) 
    await getDocs(queryList).then( 
        (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                if(doc.data().Status === true){
                    bankCatalog.push( {...doc.data(), id: doc.id} )
                }
            });        
    }).catch( (err) => {
        console.error(err)
    }).finally(
        () => {
            if(bankCatalog.length == 0){
                bankCatalog = ["No accounts registered yet"]
            }  
        }
    );
    return bankCatalog;
}

//////////////
// Return Product
export async function getAccount(id){
    let account;    
    await getDoc(doc(db, userDb, superDocRef, collectionRef, id))
        .then( (response) => {          
            account = response.data();
        }).catch( (err) => {
            console.error(err);
        });   
    return account;
}



/* ################################## */
// GET PAYMENT OPTIONS
// Return the default list of payment options
/* ########################## */
export async function getPaymentsCatalog(){
    const docSnap = await getDoc(doc(db, userDb, "account_settings"));
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
    const docSnap = await getDoc(doc(db, userDb, "account_settings"));
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
    let response;
    await addDoc(colRef, data).then(() => {
        response = returnMessage("New account created")
        console.log("New Bank Created");        
    }).catch( (err) => { 
        console.error(err)
        response = returnMessage("Fail to create account", "error")
    })
    return response
}



/* ################################## */
// DELETE BANK ACCOUNT
// Deletes a bank account and returns a new catalog
/* ########################## */
export async function deletBankAccount(id){
    let response;
    await getAccountMovments(id).then(
        async (res) => {
            if(res != null && res.length > 0){
                console.log("not del", res);
                response = returnMessage("Account can not be deleted because there are movments on it.", "error");
            } else {
                console.log("del", res);
                const docRef = doc(db, userDb, superDocRef, collectionRef, id);
                await deleteDoc(docRef)
                    .then( (res) => {
                        console.log("Bank Account Deleted");
                        response = returnMessage("Account deleted.");
                    }).catch( (err) => console.log(err))
            }
        }
    )
    console.log("final respo", response)
    return response;
}


    
/* ################################## */
// GET BANK STATUS
// Return the current status of a bank account
/* ########################## */
export async function getAccountStatus(id){
    const docSnap = await getDoc(doc(db, userDb, superDocRef, collectionRef, id));
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        alert("Inexistent bank account");
        return undefined;
    }
}

/* ################################## */
// Update an Account Balance
// Add a register to the bank balance and updates the bank current balance
/* ########################## */
export async function updateBankBalance(bankId, newBalance){
    ////////////////////////
    // Updates bank balance
    const ref = doc(db, userDb, superDocRef, collectionRef, bankId);
    await updateDoc(ref, {
        CurrentFunds: newBalance 
    }).then( (newBalance) => {
        console.log(newBalance, "Bank balance updated");
        
    }).catch( err => console.log(err));
}

/* ################################## */
// Add Bank Expense
// Add a register to the bank balance and updates the bank current balance
/* ########################## */
export async function addBankExpense(bankId, expenseData){
    console.log(bankId, expenseData)
    ////////////////////////
    // Add Debit Movment Registration
    let ref = collection(db, userDb, superDocRef, collectionRef, bankId, "balance");
    await addDoc(ref, expenseData)
        .then(
            async (balanceItem) => {
            console.log("New balance added", balanceItem)

            await updateBankBalance(bankId, expenseData.NewBalance );

        }).catch( err => console.log(err))
    
}


/* ################################## */
// Add money to Bank
/* ########################## */
export async function addMoneyToBank(bankId, data){
    console.log(db, userDb, superDocRef, collectionRef, bankId)
    let result;
    ////////////////////////
    // Add Debit Movment Registration
    let ref = collection(db, userDb, superDocRef, collectionRef, bankId, "balance");
    await addDoc(ref, data)
        .then(
            async (balanceItem) => {
                console.log("New balance added", balanceItem)

                await updateBankBalance(bankId, data.NewBalance ).then(
                    (res) => {
                        result = returnMessage("Money added to the account.");
                    }
                );

        }).catch( err => console.log(err))
    return result;
}


/* ################################## */
// Get Bank account movments
// returns the movments of a bank account
/* ########################## */
export async function getAccountMovments(bankId){
    let response;
    ////////////////////////
    // Add Debit Movment Registration
    let ref = collection(db, userDb, superDocRef, collectionRef, bankId, "balance");
    await getDocs(ref)
        .then((snapshot) => {
            response = [];
            snapshot.docs.forEach( (doc) => {
                response.push( {...doc.data(), id: doc.id} )
            });   
        }).catch( 
            (err) => {
                console.log(err);
                response = null
        })
    return response;
}


/* ################################## */
// Delete Bank movment
// Add a register to the bank balance and updates the bank current balance
/* ########################## */
export async function deleteBankBalanceByExpense(bankId, expenseId){
    console.log(bankId, expenseId);
    let result;
    
    // 1. reverse bank balance
    // get last balance
    const balanceResponse = []
    let reverseBalanceRef = collection(db, userDb, superDocRef, collectionRef, bankId, "balance");
    const queryReverse = query(reverseBalanceRef, where("Expense", "==", expenseId)) 
    await getDocs(queryReverse).then(
        async (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                balanceResponse.push( {...doc.data(), id: doc.id} )
            });
            if(balanceResponse.length > 0){
                console.warn("1. get bank last movement")
                let id = balanceResponse[0].id;
                console.log(id)
                /////////////////////////////////
                // delete the movement
                const ref = doc(db, userDb, superDocRef, collectionRef, bankId, "balance", id);
                await deleteDoc(ref).then(
                    (res) => {
                        result = "bank balance deleted"
                        console.log("bank balance delete")
                    }
                    ).catch( (err) => {
                        console.error("Cannot delete bank movement: ", err);
                    })

                /////////////////////////////////
                // Update bank balance
                console.warn("3. update bank balance")
                await updateBankBalance(bankId, balanceResponse[0].LastBalance )
                    .then(
                        (response) => {
                            console.log("balance updated", response)
                        }
                    ).catch( err => console.error(err));
                console.log(balanceResponse);

            } else {
                result = "no balance found";
            }
        }
    ).catch(
        err => console.error(err)
    ) 
    return result;

}



/* ################################## */
// Get Account Balance History
/* ########################## */
export async function getAccountBalanceHistory(accountId){
    let history = [];

    let balanceHistory = collection(db, userDb, superDocRef, collectionRef, accountId, "balance");
    const queryHistory = query(balanceHistory, orderBy('CreatedAt', 'desc')) 
    await getDocs(queryHistory).then(
        (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                history.push( {...doc.data(), id: doc.id} )
            });
        }
    ).catch( err => console.log(err) )

    return history;
}