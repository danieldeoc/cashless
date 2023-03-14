import React, { useContext, useEffect, useRef, useState } from "react";
import { ExpenseContext } from "../../../pages/expenseRegister";
import { ProductContext } from "../../../pages/expenseRegister/components/productAddOn";


function CategoryFields(props){
    const { categoryCatalog } = useContext(ExpenseContext)
    const { selectedProduct } = useContext(ProductContext)

    const [selectedCategory, setSelectedCategory] = useState("Caridade")
    const [selectedSubcategory, setSelectedSubcategory] = useState("")

    const [categoriesOptions, setCategoriesOptions] = useState("");
    const [subCategoriesOptions, setSubCategoriesOptions] = useState("");

    const selectCategory = useRef()
    const selectSubCategory = useRef()

    ////////////////
    // set Initial Values
    const pageUpdates = useEffect( () => {
        if(categoryCatalog !== undefined){
            setSelectedCategory( categoryCatalog[0].Name)
            setSelectedSubcategory(categoryCatalog[0].Childs)
            setCategoriesOptions(
                categoryCatalog.map( (key, i) => (
                    <option key={i}>{key.Name}</option>
                ))
            );
            setSubCategoriesOptions(categoryCatalog[0].Childs, categoryCatalog[0].Childs[0])
        }
    }, [categoryCatalog])


    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // Page Updates
    ////////////////////////////////////////////////
    function drawSubCategoryOptions(catalog, subcategory){
        setSubCategoriesOptions(
            catalog.map( (key, i) => (
                <option key={i}>{key}</option>
            ))
        )
        setTimeout( () => {
            selectSubCategory.current.value = subcategory;
        }, 100)
    }

 
    const nameUpdates = useEffect( () => {
        if(selectedProduct !== undefined){
            console.log("prod", selectedProduct)
            let newSubOptions = categoryCatalog.find( ({Name}) => Name == selectedProduct.Category)
            
            selectCategory.current.value = newSubOptions.Name;
            setSelectedCategory( selectedProduct.Category)
            setSelectedSubcategory(selectedProduct.Subcategory)
            drawSubCategoryOptions(newSubOptions.Childs, selectedProduct.Subcategory)
       }

    }, [selectedProduct])
    
    return(
        <>
            <label>
                    Product Category:
                    <select 
                        ref={selectCategory}
                        defaultValue={selectedCategory}
                        onChange={ (e) => {
                            const value = selectCategory.current.value;
                            const subCats = categoryCatalog.find( ({Name}) => Name == value);
                            if( typeof subCats.Childs === 'string'){
                                setSubCategoriesOptions("")
                            } else {
                                drawSubCategoryOptions(subCats.Childs)
                            }
                            props.onChangeHandler( selectCategory.current.value, subCats.Childs[0] )
                        }} >
                        {categoriesOptions}
                    </select>
                </label>
                <label>Product Sub Category</label>
                <select 
                    ref={selectSubCategory}
                    defaultValue={selectedSubcategory}
                    onChange={ (e) => {
                        props.onChangeHandler( selectCategory.current.value, selectSubCategory.current.value )
                    }} >
                    {subCategoriesOptions}
                </select>
        </>
    )
}
export default CategoryFields;