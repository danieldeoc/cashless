import React, { useContext, useEffect, useRef, useState } from "react";
import { 
    getCategoriesCatalog
} from "../../../globalOperators/globalGetters";
import { ExpenseContext } from "../../../pages/expenseRegister";
import { ProductContext } from "../../../pages/expenseRegister/components/productAddOn";


function CategoryFields(props){
    const catalog = props.catalog;

    const [selectedCategory, setSelectedCategory] = useState(undefined)
    const [selectedSubcategory, setSelectedSubcategory] = useState(undefined)

    const [categoriesOptions, setCategoriesOptions] = useState("");
    const [subCategoriesOptions, setSubCategoriesOptions] = useState("");

    const selectCategory = useRef()
    const selectSubCategory = useRef()

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // Page Updates
    ////////////////////////////////////////////////
    function drawSubCategoryOptions(catalog){
        setSubCategoriesOptions(
            catalog.map( (key, i) => (
                <option key={i}>{key}</option>
            ))
        )
    }

    const pageUpdates = useEffect( () => {
        if(catalog !== undefined){
            setSelectedCategory( catalog[0].Name)
            setSelectedSubcategory(catalog[0].Childs)
            setCategoriesOptions(
                catalog.map( (key, i) => (
                    <option key={i}>{key.Name}</option>
                ))
            );
            setSubCategoriesOptions(categoryCatalog[0].Childs)
        }
    }, [categoryCatalog])

    const nameUpdates = useEffect( () => {
        if(selectedProduct !== undefined){
            setSelectedCategory( selectedProduct.Category)
            setSelectedSubcategory(selectedProduct.Subcategory)

            let newSubOptions = categoryCatalog.find( ({Name}) => Name == selectedProduct.Category)
            drawSubCategoryOptions(newSubOptions.Childs)
       }

    }, [selectedProduct])
    
    return(
        <>
            <label>
                    Product Category:
                    <select 
                        ref={selectCategory}
                        value={selectedCategory}
                        onChange={ (e) => {
                            const value = selectCategory.current.value;
                            const subCats = catalog.find( ({Name}) => Name == value);
                            if( typeof subCats.Childs === 'string'){
                                console.log("empty")
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
                    value={selectedSubcategory}
                    onChange={ (e) => {
                        props.onChangeHandler( selectCategory.current.value, selectSubCategory.current.value )
                    }} >
                    {subCategoriesOptions}
                </select>
        </>
    )
}
export default CategoryFields;