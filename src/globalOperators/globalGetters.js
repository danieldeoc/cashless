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


/* ################################## */
// Get products amount units
/* ########################## */
export async function getProductUnitsCatalog(){
    let productUnits = [];
    await getDoc(doc(db, "settings", "product_settings"))
        .then( (snap) => {
            snap.data().Weights.map( key => productUnits.push(key) );
        }).catch( (err) => {
            console.log("err")
        });
    return productUnits;
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
                productCatalog.push("No products avaliable")
            }
        })
    return productCatalog;
}

//////////////
// Adds a new product to the catalog
export async function AddProductToCatalog(data){
    await addDoc(collection(db, "products_catalog") , data)
        .then((res) => {
            console.log(res)
            console.log("New product added")
        }).catch( err => console.log(err))
        .finally( () => {
            console.log("product addicion ended")
        }) 
}

//////////////
// Delets a product from the catalog
export async function deletProductFromCatalog(id){
    const docRef = doc(db, "products_catalog", id);
    await deleteDoc(docRef)
            .then( (res) => {
                console.log("deleted");
                return "deleted";
            }).catch( (err) => console.log(err))
}



/* ################################## */
// Get list of avaliable bankAccounts
/* ########################## */
export async function getAccountsCatalog(){
    let bankCatalog = []
    const queryList = query(collection(db, "bank_accounts"), orderBy('Name', 'asc')) 
    await getDocs(queryList).then( (snapshot) => {
        snapshot.docs.forEach( (doc) => {
            if(doc.data().Status === true){
                bankCatalog.push( {...doc.data(), id: doc.id} )
            }
        });        
    }).catch( (err) => {
        console.log("err")
    });;
    return bankCatalog;
}


/* ################################## */
// Get Categories Catalog
/* ########################## */
export async function getCategoriesCatalog(){
    const categories = []; 
    const queryList = query(collection(db, "categories"), orderBy('Name', 'asc')) 
    await getDocs(queryList).then( (snapshot) => {              
        snapshot.docs.forEach((doc) => {
            categories.push({ ...doc.data(), id: doc.id})
        })
    }).catch( (err) => {
        console.log("err")
    });
    return categories;
}


/* ################################## */
// Get Expenses Catalog
// Options: Query options, 
/* ########################## */
export async function getExpensesCatalog(queryOptions){
    const expensesCatalog = [];
    if(queryOptions === undefined || queryOptions === "default"){
        var queryKey = query(collection(db, "expenses"), orderBy('Name', 'asc')) 
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