import React, { useEffect, useState } from "react";
import { serverTimestamp } from "firebase/firestore"
import { addNewCategory, addNewSubCategory, deletCategorie, deleteSubCateory, getCategoriesCatalog } from "../../firebase/categories";
import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Input from "../../components/forms/input";
import SelectBox from "../../components/forms/select";
import PrimaryButton from "../../components/elements/buttons/primaryButton";
import Alert from "../../components/elements/messages/alert";
import Loader from "../../components/elements/loader";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import ConfirmDialog from "../../components/elements/messages/confirm";


function CategoriesSettings(){
    ///////////////////////
    // Catalogs
    const [categoriesCatalog, setCategoriesCatalog] = useState(undefined)

    ///////////////////////
    // Data 
    const [newCategoryName, setNewCategoryName] = useState("");
    const [mainCategory, setMainCategory] = useState("Main");

    const newCategory = {
        Name: newCategoryName,
        Childs: [],
        CreatedAt: serverTimestamp()
    }

    ///////////////////////
    // page 
    const [listOfCategories, setListOfCategories] = useState(<Loader />);
    const [parentOptions, setParentOptions] = useState([])

    //////////////////////
    // messages
    const [returningAlerts, setReturningAlerts] = useState("");
    
    ////////////////////
    // Page loads
    const getCatalogs = useEffect( () => {
        performPageDraw();
    }, []);

    function performPageDraw(){
        setMainCategory("Main")
        setNewCategoryName("")
        newCategory.Childs = [];

        document.getElementById("newCategoryName").value = "";
        document.getElementById("fatherOptions").value = "Main";
        

        getCategoriesCatalog().then( (catalog) => {
            setCategoriesCatalog(catalog);
            updatePageList(catalog)
        });
    }

    ///////////////////////
    // Delet Functions
    function confirmCatDelete(id){
        setReturningAlerts(null);
        setListOfCategories(<Loader />)
        deletCategorie(id).then(performPageDraw);
    };

    function denyDelete(){
        setReturningAlerts(null);
    }

    async function confirmSubCatDelete(id, subKey){
        setReturningAlerts("");
        setListOfCategories(<Loader />)
        await deleteSubCateory(id, subKey, categoriesCatalog).then(performPageDraw)
    };
    
    // update categories page
    function updatePageList(catalog){
        if(catalog){
            if(catalog[0] == "No categories registered yet"){
                setListOfCategories( 
                    catalog.map((key, i) => (
                        <li className="empty-list">
                            {key}
                        </li>
                        )
                    )
                )
            } else {
                setListOfCategories( 
                    catalog.map((key, i) => (
                        <li key={i}>
                            {key.Name} 
                            
                            <span 
                                className="delete-item-list" 
                                onClick={ () => { 
                                    setReturningAlerts(
                                        <ConfirmDialog 
                                            message="Do you realy want to delete this category?"
                                            onConfirmHandler={() => { confirmCatDelete(key.id) }}
                                            onDenyHandle={denyDelete}
                                            />)
                                    }}>
                                <FontAwesomeIcon icon={faX} />
                            </span>

                            
                            {key.Childs.length > 0 &&
                                <ul>
                                    {key.Childs.map((subKey, i) => (
                                        <li key={i}>
                                            {subKey} 
                                            <span 
                                                className="delete-item-list" 
                                                onClick={ () => { 
                                                    setReturningAlerts(
                                                        <ConfirmDialog 
                                                            message="Do you realy want to delete this subcategory?"
                                                            onConfirmHandler={() => { confirmSubCatDelete(key.id, subKey) }}
                                                            onDenyHandle={denyDelete}
                                                            />)
                                                    }}>
                                                <FontAwesomeIcon icon={faX} />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </li>
                    ))
                );
                setParentOptions(
                    catalog.map( (option) => option.Name)
                ) 
            } 
        }
    }
    
    

    return(
        <>        
            <PageTitle text="Categories" />
            <PageBox>
                <SectionTitle text="Add a new Category" />                

                <Input 
                    id="newCategoryName"
                    type="text"
                    label="Category name:"
                    placeholder="Insert a name"
                    value={newCategoryName} 
                    onChangeHandler={(result) => { 
                        setNewCategoryName(result) ;
                    }}
                    />

                <SelectBox 
                    id="fatherOptions"
                    label="Select a parent category"
                    defaultOption="Main"
                    onChangeHandler={ (result) => { 
                        setMainCategory(result)
                    }}
                    classes="category-select"
                    options={parentOptions}
                    />

                <PrimaryButton
                    label="Add New Category"
                    onClickHandler={() => { 
                        setReturningAlerts(<Loader type="fullscreen" /> )
                        setListOfCategories(<Loader />)
                        if(mainCategory == "Main"){
                            addNewCategory(categoriesCatalog, newCategory).then(
                                (response) => {
                                    setReturningAlerts(
                                        <Alert
                                            message={response.message}
                                            classes={response.classes}
                                            display={response.display}
                                            />
                                    )
                                    performPageDraw();
                                }
                            )
                        } else {
                            addNewSubCategory(mainCategory, categoriesCatalog, newCategoryName).then(
                                (response) => {
                                    setReturningAlerts(
                                        <Alert
                                            message={response.message}
                                            classes={response.classes}
                                            display={response.display}
                                            />
                                    )
                                    performPageDraw();
                                }
                            );
                        }
                        }} />                    
            </PageBox>

            <PageBox>
                <SectionTitle text="Avaliable Categories" />
                <ul className="table-list">
                        {listOfCategories}
                </ul>
            </PageBox>
            {returningAlerts}         
            
        </>
    )
}

export default CategoriesSettings;