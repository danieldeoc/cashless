import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp, where } from "firebase/firestore"

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
// DELETE EXPENSE
// Delets the last expense
/* ########################## */
export async function deleteExpense(id){
    let result;

   // const expense = getExpenseDetail(id);

   // console.log(expense)

    // delete product price history
    // delete bank account movment
    // delete expense register    

    return result;
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
    const expensesCatalog = [];
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
        });
    return expensesCatalog;
}