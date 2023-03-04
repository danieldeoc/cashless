import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"

function CategoriesSettings(){

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

    const [listOfCategories, setListOfCategories] = useState("Wait...")
    const [categoriesCatalog, setCategoriesCatalog] = useState([])
    
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryFather, setNewCategoryFather] = useState("Main");
    
    const [fathersOptions, setFathersOptions] = useState([])

    function delLook(id){
        const docRef = doc(db, collectionRef, id);
            deleteDoc(docRef)
                .then( () => {
                    console.log("deleted");
                    listCategories()
                }).catch( (err) => console.log(err))
    }

    function deleteSubCateory(father, subcategory){

        categoriesCatalog.map( (key, index) => {
            if(key.Name === father){
                let newChilds = key.Childs;
                console.log(newChilds)
                let indexer = newChilds.indexOf(subcategory)
                if( indexer > -1){
                    newChilds.splice(indexer, 1)
                }
                console.log(newChilds)


                const upDocRef = doc(db, collectionRef, key.id)
                updateDoc(upDocRef, {
                    Childs: newChilds
                }).then(() => {
                    // do something
                    console.log("updated")
                    listCategories();
                }) 
            } 
        });

    }
    
    // get all categories from server
    function listCategories(){
        let categories = [];
        // get docs
        const queryList = query(colRef, orderBy('Name', 'asc')) 
        getDocs(queryList).then( (snapshot) => {
            
            snapshot.docs.forEach((doc) => {
                categories.push({ ...doc.data(), id: doc.id})
            })
            setCategoriesCatalog(categories)
            setListOfCategories( 
                categories.map((key, i) => (
                    <li key={i}>
                        {key.Name} <i onClick={ () => { delLook(key.id) } }>X</i>
                        {key.Childs.length > 0 &&
                            <ul>
                                {key.Childs.map((subKey, i) => (
                                    <li key={i}>{subKey} <i onClick={() => { deleteSubCateory(key.Name, subKey) }}>X</i></li>
                                ))}
                            </ul>
                        }
                    </li>
                ))
            );
    
            setFathersOptions(
                categories.map((key, i) => (
                    <option key={i}>
                        {key.Name}
                    </option>
                ))
            )
        }).catch( (err) => {
            console.log("err")
            setListOfCategories("Failed to obtain the categories list")
        });

    };

    function addNewCategory(){
        if(newCategoryFather == "Main"){
            
            if(categoriesCatalog.indexOf(newCategoryName) != -1 ){
                // add a new father category
                addDoc(colRef, {
                    Name: newCategoryName,
                    Childs: "",
                    CreatedAt: serverTimestamp()
                }).then(() => {
                    setNewCategoryName("")
                    setNewCategoryFather("Main")
                    listCategories();    
                    console.log("New Category Created")
                }).catch( err => console.log(err))

            } else {
                alert("Name already exists")
            }


        } else {
            console.log("t", categoriesCatalog)
            categoriesCatalog.map( (key, index) => {
                if(key.Name === newCategoryFather){
                    
                    if(typeof key.Childs === "string"){
                        var newChilds = []
                    } else {
                        var newChilds = key.Childs;
                    }
                    console.log(newChilds)
                    newChilds.push(newCategoryName)
                    //console.log("update: ", key, key.id)
                    const upDocRef = doc(db, 'categories', key.id)
                    updateDoc(upDocRef, {
                        Childs: newChilds
                    }).then(() => {
                        // do something
                        console.log("updated")
                        listCategories();
                    }) 
                }
            });
        }
    }
    
    // only one render
    useEffect(() => {
        listCategories();    
    }, []);




    return(
        <>
            <h2>Add Category</h2>
            {newCategoryName} {newCategoryFather}
            <input 
                type="text" 
                value={newCategoryName} 
                onChange={(e) => { setNewCategoryName(e.target.value) }}
                placeholder="Category name" />
            <select 
                id="fatherOptions"
                onChange={(event) => { setNewCategoryFather(event.target.value)}} >
                <option placeholder="Category father" value="Main">Main</option>
                {fathersOptions}
            </select>
            <button onClick={addNewCategory}>Save</button>
           <h2>Avaliable Categories</h2>
           <ul className="listOfCategories">
                {listOfCategories}
           </ul>
        </>
    )
}

export default CategoriesSettings;