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


//////////////
// Adds a new product to the catalog
export async function addProductToCatalog(data){
    const ref = collection(db, "products_catalog");
    const docRef = await addDoc(ref, data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
}

//////////////
// Adds a new product to the catalog
export async function addProductPriceHistory(data, id){
    let ref = collection(db, "products_catalog", id, "price_history");
    await addDoc(ref, data)
        .then((res) => {
            console.log(res)
            console.log("New history added")
        }).catch( err => console.log(err))

}

//////////////
// update a document field
export async function updateProductDoc(data, id){
    const ref = doc(db, "products_catalog", id);
    // Set the "capital" field of the city 'DC'
    await updateDoc(ref, data).then( res => console.log(res, "data Updated"));
}

//////////////
// Get product average price
export async function productAveragePrice(){
    // do something
}

