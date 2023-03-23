import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, updateDoc, serverTimestamp, addDoc, orderBy, doc, deleteDoc, Timestamp } from "firebase/firestore"
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
const collectionRef = "categories";
const superDoc = "categories_catalog";
const colRef = collection(db, userDb, superDoc, collectionRef);


/* ################################## */
// Get Categories Catalog
/* ########################## */
export async function getCategoriesCatalog(){
    let categories = []; 
    const queryList = query(collection(db, userDb, superDoc, collectionRef), orderBy('Name', 'asc')) 
    await getDocs(queryList).then( (snapshot) => {              
        snapshot.docs.forEach((doc) => {
            categories.push({ ...doc.data(), id: doc.id})
        })
    }).catch( (err) => {
        console.log("err")
    }).finally(
        () => {
            if(categories.length == 0){
                categories = ["No categories registered yet"]
            }  
        }
    );
    return categories;
}

/* ################################## */
// Delet a Category
/* ########################## */
export async function deletCategorie(id){
    const docRef = doc(db, userDb, superDoc, collectionRef, id);
    await deleteDoc(docRef)
            .then( (res) => {
                console.error("deleted", res);
            }).catch( (err) => console.log(err))
}

/* ################################## */
// Delet a SubCategory
/* ########################## */
export async function deleteSubCateory(catId, subcategory, catalog){

    const category = catalog.find( ({id}) => id == catId);
    const subCats = category.Childs;

    let delIndex = subCats.indexOf(subcategory);
    if( delIndex > -1){
        subCats.splice(delIndex, 1)
    }

    const upDocRef = doc(db, userDb, superDoc, collectionRef, catId)
    await updateDoc(upDocRef, {
            Childs: subCats
        }).then((res) => {
            console.error("SubCategory removed", res)
        }) 
}



/* ################################## */
// Add New Category 
/* ########################## */
export async function addNewCategory(catalog, data){
    let response = undefined;
    if( data.Name !== undefined){       
        const nameCheck = catalog.find( ({Name}) => Name == data.Name);
        if( nameCheck === undefined ){
            // add a new main category
            await addDoc(colRef, data).then((res) => {
                console.warn("New Category added", res)
                response = returnMessage("New category added")
            }).catch( (err) => {
                console.log(err);
                response = returnMessage("Error:" + err, "error");
            })
        } else {
            response = returnMessage("No name defined:", "error");
        } 
    } else {
        response = returnMessage("No name defined:", "error");
    }
    return response;
}


/* ################################## */
// Add New SubCategory
/* ########################## */
export async function addNewSubCategory(level, catalog, data){
    let result;
    if( data !== undefined){       
        const category = catalog.find( ({Name}) => Name == level);
        console.log(level, catalog, data, category)
            const id = category.id;
            var childs = category.Childs;
            if(childs === undefined || childs == "" ){
                var childs = [];
            }            
            childs.push(data)
            const ref = doc(db, userDb, superDoc, collectionRef, id);
            await updateDoc( ref, {
                Childs: childs
            }).then((res) => {
                console.warn("SubCategories updated", res)
                result = returnMessage("Subcategory added")
            })
    } else {
        alert("You need to define a name for the subcategory")
    }
    return result;
}


export async function setUpCategories(categories){
    

}