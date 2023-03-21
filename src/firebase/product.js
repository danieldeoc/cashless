import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, getDoc, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc, Timestamp, limit } from "firebase/firestore"
import { returnMessage } from "../tools/alertTools";
import { getExpensesCatalog } from "./expenseRegistration";
import { getAuthCredentias } from "./auth";

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


const credentials = getAuthCredentias();
const userDb = "userdb_"+credentials.id;
const collectionRef = "products_catalog";
const superDoc = "products_catalog";
const colRef = collection(db, userDb, superDoc, collectionRef);



//////////////
// Adds a new product to the catalog
export async function addProductToCatalog(data){
    let response;
    const ref = collection(db, userDb, superDoc, collectionRef);
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
    const docRef = await addDoc(collection(db, userDb, superDoc, collectionRef), data);
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
    const queryList = query(collection(db, userDb, superDoc, collectionRef), orderBy('Name', 'asc')) 
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
// Return Product
export async function getProduct(id){
    let product;    
    await getDoc(doc(db, userDb, superDoc, collectionRef, id))
        .then( (response) => {          
            product = response.data();
        }).catch( (err) => {
            return err;
        });   
    return product;
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
            //console.log("dp: ", avaliableExpenses[0], id, avaliableExpenses, avaliableExpenses.length)
            
            let belongs = [];
            
            if(avaliableExpenses[0] != "No expenses registered yet"){
                avaliableExpenses.forEach( (key) => {
                    if(key.products.includes(id)){
                        belongs.push(key.id)
                    }
                }) 
            }


            if(belongs.length == 0 || avaliableExpenses[0] == "No expenses registered yet"){

                
                if(belongs.length == 0){
                  
                    const ref = doc(db, userDb, superDoc, collectionRef, id);
                    await deleteDoc(ref).then(
                        (res) => {
                            
                            console.warn("Document deleted");
                            response = returnMessage("Product deleted");
                        }
                        ).catch( (err) => {
                            console.error(err);
                            response = returnMessage("Error"+err, "error")
                        })
                }            

            } else {
                response = returnMessage("This product cannot be deleted because there are expenses registered with it.", "error")
            }
        });   
    return response;
}

//////////////
// Adds a new product to the catalog
export async function addProductPriceHistory(data, id){
    let ref = collection(db, userDb, superDoc, collectionRef, id, "price_history");
    await addDoc(ref, data)
        .then((res) => {
            
            console.log("New history added")
        }).catch( err => console.log(err))

}

//////////////
// update a document field
export async function updateProductDoc(data, id){
    const ref = doc(db, userDb, superDoc, collectionRef, id);
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
    let reversePriceHistory = collection(db, userDb, superDoc, collectionRef, productId, "price_history");
    const queryReverse = query(reversePriceHistory, orderBy('CreatedAt', 'asc'), limit(1) ) 
    await getDocs(queryReverse)
        .then(
            async (snapshot) => {
                snapshot.docs.forEach( (doc) => {
                    historyResponse.push( {...doc.data(), id: doc.id} )
                });

                const ref = doc(db, userDb, superDoc, collectionRef, productId, "price_history", historyResponse[0].id);
                await deleteDoc(ref).then(
                    (res) => {
                        result = "Price History deleted";
                    }).catch( (err) => {
                        console.error(err);
                    })
            
            }).catch( err => console.log(err))
    return result;
}

//////////////
// Produc price hisory
export async function getProductPriceHistory(productId){
    let results = [];

    let priceHistory = collection(db, userDb, superDoc, collectionRef, productId, "price_history");
    const queryHistory = query(priceHistory, orderBy('CreatedAt', 'asc')) 
    await getDocs(queryHistory).then(
        (snapshot) => {
            snapshot.docs.forEach( (doc) => {
                results.push( {...doc.data(), id: doc.id} )
            });
        }
    ).catch( err => console.log(err) ).finally(() => {
        if(results.length == 0){
            results.push(["No prices rsgitered yet."])
        }
    })  
    return results;
}




