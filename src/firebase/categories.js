import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, updateDoc, serverTimestamp, addDoc, orderBy, doc, deleteDoc, Timestamp } from "firebase/firestore"

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

const collectionRef = "categories";
const colRef = collection(db, collectionRef);


/* ################################## */
// Get Categories Catalog
/* ########################## */
export async function getCategoriesCatalog(){
    const categories = []; 
    const queryList = query(collection(db, collectionRef), orderBy('Name', 'asc')) 
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
// Delet a Category
/* ########################## */
export async function deletCategorie(id){
    const docRef = doc(db, collectionRef, id);
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

    const upDocRef = doc(db, collectionRef, catId)
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
    if( data.Name !== undefined){       
       
        const nameCheck = catalog.find( ({Name}) => Name == data.Name);
        if( nameCheck === undefined ){
            // add a new main category
            await addDoc(colRef, data).then((res) => {
                console.warn("New Category added", res)
            }).catch( err => console.log(err))
        } else {
            alert("Name already exists")
        } 
    
    } else {
        alert("You need to define a name for the category")
    }
}


/* ################################## */
// Add New SubCategory
/* ########################## */
export async function addNewSubCategory(level, catalog, data){
    if( data !== undefined){       
        const category = catalog.find( ({Name}) => Name == level);
            const id = category.id;
            var childs = category.Childs;
            if(childs === undefined || childs == "" ){
                var childs = [];
            }
            childs.push(data)
            console.log(id, childs, data)
            
            const ref = doc(db, collectionRef, id);
            await updateDoc( ref, {
                Childs: childs
            }).then((res) => {
                console.warn("SubCategories updated", res)
            })
    } else {
        alert("You need to define a name for the subcategory")
    }
}
