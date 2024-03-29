import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp, where } from "firebase/firestore"
import { deleteBankBalanceByExpense } from "./accounts";
import { deleteProductHistoryByExpense } from "./product";
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
const collectionRef = "expenses";
const superDoc = "expenses_catalog";
const colRef = collection(db, userDb, superDoc, collectionRef);


/* ################################## */
// EXPENSE REGISTER
// Adds a new expense register to the general list
/* ########################## */
export async function expenseRegistration(data){
    const docRef = await addDoc(colRef, data);
    return docRef.id;
}

/* ################################## */
// EXPENSE DETAIL
// GET A SINGLE EXPENSE DETAIL
/* ########################## */

//getExpenseDetail


/* ################################## */
// Get Expenses Catalog
// Options: Query options, 
/* ########################## */
export async function getExpensesCatalog(queryOptions){
    let expensesCatalog = [];
    let querySettings;
    if(queryOptions === undefined || queryOptions === "default"){
        querySettings = query(colRef, orderBy('CreatedAt', 'desc')) 
    } else {
        querySettings = query(colRef, orderBy('CreatedAt', 'asc'), where(queryOptions.field, queryOptions.operator, queryOptions.criteria));
    }
    await getDocs(querySettings)
        .then( (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                expensesCatalog.push( {...doc.data(), id: doc.id} )
            })
        }).finally(
            () => {
                if(expensesCatalog.length == 0){
                    expensesCatalog = ["No expenses registered yet"]
                }
            }
        );
        console.log()
    return expensesCatalog;
}


/* ################################## */
// Delete expense
// Options: Query options, 
/* ########################## */

export async function deleteExpense(deleteInfos){
    let result;
    console.warn("1. Starts delete")

    const deleteProductsHistory = async () => {
        // delete product price history
        deleteInfos.products.forEach(
            async (key) => {
                await deleteProductHistoryByExpense(key).then(
                    (res) => {
                        console.warn("2. Deletes product price history", res)
                    }
                )
            }
        )
    }
    await deleteProductsHistory().then(
        async () => {
            /// delete account register
            await deleteBankBalanceByExpense(deleteInfos.bankId, deleteInfos.expenseId).then(
                async (res) => {
                    console.warn("3. Deletes accoutn balance movment", res)

                    // deltes the expense
                    const ref = doc(db, userDb, superDoc, collectionRef, deleteInfos.expenseId);
                    await deleteDoc(ref).then(
                        (res) => {
                            console.warn("Expense deleted");
                            result = returnMessage("Expense deleted")
                        }).catch( (err) => {
                            console.error(err);
                        })
                }
            ).catch( err => console.error(err))
        }
    )
    return result;
}