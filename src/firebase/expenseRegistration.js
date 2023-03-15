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
const collectionRef = "expenses";
const db = getFirestore();


/* ################################## */
// EXPENSE REGISTER
// Adds a new expense register to the general list
/* ########################## */
export async function expenseRegistration(data){
    await addDoc(collection(db, collectionRef) , data)
        .then((res) => {
            return res;            
        }).catch( err => console.log(err))
}




/* ################################## */
// Get Expenses Catalog
// Options: Query options, 
/* ########################## */
export async function getExpensesCatalog(queryOptions){
    const expensesCatalog = [];
    if(queryOptions === undefined || queryOptions === "default"){
        var queryKey = query(collection(db, collectionRef), orderBy('CreatedAt', 'asc')) 
    } else {
        var queryKey = queryOptions;
    }
    await getDocs(queryKey)
        .then( (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                expensesCatalog.push( {...doc.data(), id: doc.id} )
            })
        });
    return expensesCatalog;
}