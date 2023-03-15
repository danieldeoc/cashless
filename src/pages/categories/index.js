import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, serverTimestamp, addDoc, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { addNewCategory, addNewSubCategory, deletCategorie, deleteSubCateory, getCategoriesCatalog } from "../../firebase/categories";
import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";

function CategoriesSettings(){
    ///////////////////////
    // Catalogs
    const [categoriesCatalog, setCategoriesCatalog] = useState(undefined)

    ///////////////////////
    // Data 
    const [newCategoryName, setNewCategoryName] = useState(undefined);
    const [mainCategory, setMainCategory] = useState("Main");

    const newCategory = {
        Name: newCategoryName,
        Childs: [],
        CreatedAt: serverTimestamp()
    }

    ///////////////////////
    // page 
    const [listOfCategories, setListOfCategories] = useState("Wait...");
    const [fatherCategoryOptions, setFatherCategoryOptions] = useState([])


    ///////////////////////
    // functions
    
    // update categories page
    function updatePageList(){
        if(categoriesCatalog){

            setListOfCategories( 
                categoriesCatalog.map((key, i) => (
                    <li key={i}>
                        {key.Name} <i onClick={ () => { 
                            deletCategorie(key.id).then(performPageDraw);
                             } }>X</i>
                        {key.Childs.length > 0 &&
                            <ul>
                                {key.Childs.map((subKey, i) => (
                                    <li key={i}>{subKey} <i onClick={() => { 
                                        deleteSubCateory(key.id, subKey, categoriesCatalog).then(performPageDraw)
                                     }}>X</i></li>
                                ))}
                            </ul>
                        }
                    </li>
                ))
            );
    
            setFatherCategoryOptions(
                categoriesCatalog.map((key, i) => (
                    <option key={i}>
                        {key.Name}
                    </option>
                ))
            )
        }
    }
    
    ////////////////////
    // Page loads
    function performPageDraw(){
        getCategoriesCatalog().then( (catalog) => {
            setCategoriesCatalog(catalog);
            updatePageList()
        });
    }
    const getCatalogs = useEffect( () => {
        performPageDraw();
    }, []);

    const updatePage = useEffect( () => {
        updatePageList();
    }, [categoriesCatalog])

    return(
        <PageBox>
            <PageTitle text="Categories" />
            <h2>Add Category</h2>
            {newCategoryName} {mainCategory}
            <input 
                type="text" 
                value={newCategoryName} 
                onChange={(e) => { 
                    setNewCategoryName(e.target.value) ;
                }}
                placeholder="Category name" />
            <select 
                id="fatherOptions"
                onChange={(event) => { 
                    setMainCategory(event.target.value)
                }} >
                <option placeholder="Category father" value="Main">Main</option>
                {fatherCategoryOptions}
            </select>
            <button onClick={() => { 
                if(mainCategory == "Main"){
                    addNewCategory(categoriesCatalog, newCategory).then( () => {
                        performPageDraw();
                    });
                } else {
                    addNewSubCategory(mainCategory, categoriesCatalog, newCategoryName).then( () => {
                        performPageDraw();
                    });
                }
                 }}>Add New Category</button>
           <h2>Avaliable Categories</h2>
           <ul className="listOfCategories">
                {listOfCategories}
           </ul>
        </PageBox>
    )
}

export default CategoriesSettings;