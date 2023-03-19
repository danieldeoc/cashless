import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp, where } from "firebase/firestore"
import { deleteBankBalanceByExpense } from "./accounts";
import { deleteProductHistoryByExpense } from "./productRegistration";
import { returnMessage } from "../tools/alertTools";

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
const collectionRef = "expenses";
const db = getFirestore();


/* ################################## */
// EXPENSE REGISTER
// Adds a new expense register to the general list
/* ########################## */
export async function expenseRegistration(data){
    const docRef = await addDoc(collection(db, collectionRef), data);
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
        querySettings = query(collection(db, collectionRef), orderBy('CreatedAt', 'desc')) 
    } else {
        querySettings = query(collection(db, collectionRef), orderBy('CreatedAt', 'asc'), where(queryOptions.field, queryOptions.operator, queryOptions.criteria));
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
                    const ref = doc(db, collectionRef, deleteInfos.expenseId);
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