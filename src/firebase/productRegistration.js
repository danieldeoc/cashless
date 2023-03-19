import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp, limit } from "firebase/firestore"
import { returnMessage } from "../tools/alertTools";
import { getExpensesCatalog } from "./expenseRegistration";

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
const collectionRef = "products_catalog";


//////////////
// Adds a new product to the catalog
export async function addProductToCatalog(data){
    let response;
    const ref = collection(db, collectionRef);
    const docRef = await addDoc(ref, data).then( 
        (res) => {
            response = returnMessage("New product added")
        }
    ).catch( (err) => {
        response = returnMessage("Fail to register " + err)
    })
    return response;
}

/// custom function to add a product by the expense process and return the id
export async function addProductToCatalogByExpenses(data){
    const docRef = await addDoc(collection(db, collectionRef), data);
    return docRef.id;
}


/* #################################################################### */
/* #################################################################### */
/* #################################################################### */
// Products CRUD

//////////////
// Return Products Catalog
export async function getProductCatalog(){
    let productCatalog = [];
    const queryList = query(collection(db, "products_catalog"), orderBy('Name', 'asc')) 
    await getDocs(queryList)
        .then( (snapshot) => {              
            snapshot.docs.forEach((doc) => {
                productCatalog.push({ ...doc.data(), id: doc.id})
            })
        }).catch( (err) => {
            return err;
        }).finally(() => {
            if(productCatalog.length == 0){
                productCatalog.push("No products rsgitered yet.")
            }
        })    
    return productCatalog;
}


//////////////
// Deletes a product to the catalog
export async function deleteProductFromCatalog(id){
    let queryOptions = {
        field: "products",
        operator: "array-contains",
        criteria: id
    }
    let response;

    await getExpensesCatalog(queryOptions).then(
        async (avaliableExpenses) => {
            console.log(avaliableExpenses, avaliableExpenses.length)
            if(avaliableExpenses.length > 0){
                response = returnMessage("This product cannot be deleted because there are expenses registered with it.", "error")
                console.log(response)
            } else {
                const ref = doc(db, collectionRef, id);
                await deleteDoc(ref).then(
                    (res) => {
                        console.warn("Document deleted");
                        response = returnMessage("Product deleted");
                    }
                    ).catch( (err) => {
                        console.error(err);
                        response = returnMessage("Error"+err, "error")
                    })
            };
        });   
    return response;
}

//////////////
// Adds a new product to the catalog
export async function addProductPriceHistory(data, id){
    let ref = collection(db, collectionRef, id, "price_history");
    await addDoc(ref, data)
        .then((res) => {
            console.log(res)
            console.log("New history added")
        }).catch( err => console.log(err))

}

//////////////
// update a document field
export async function updateProductDoc(data, id){
    const ref = doc(db, collectionRef, id);
    // Set the "capital" field of the city 'DC'
    await updateDoc(ref, data).then( res => console.log(res, "data Updated"));
}

//////////////
// Get product average price
export async function productAveragePrice(){
    // do something
}

//////////////
// Delete product price history by expense
export async function deleteProductHistoryByExpense(productId){
    let result;

    let historyResponse = [];
    // get latest record
    let reversePriceHistory = collection(db, collectionRef, productId, "price_history");
    const queryReverse = query(reversePriceHistory, orderBy('CreatedAt', 'asc'), limit(1) ) 
    await getDocs(queryReverse)
        .then(
            async (snapshot) => {
                snapshot.docs.forEach( (doc) => {
                    historyResponse.push( {...doc.data(), id: doc.id} )
                });

                const ref = doc(db, collectionRef, productId, "price_history", historyResponse[0].id);
                await deleteDoc(ref).then(
                    (res) => {
                        result = "Price History deleted";
                    }).catch( (err) => {
                        console.error(err);
                    })
            
            }).catch( err => console.log(err))
    return result;
}


