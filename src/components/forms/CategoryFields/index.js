import React, { useEffect, useRef, useState } from "react";
import { 
    getCategoriesCatalog
} from "../../../globalOperators/globalGetters";


function CategoryFields(){
    
    const [categoryCatalog, setCategoryCatalog] = useState(undefined);
    const [categoriesOptions, setCategoriesOptions] = useState("");
    const [subCategoriesOptions, setSubCategoriesOptions] = useState("");

    const selectCategory = useRef()
    const selectSubCategory = useRef()
 
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // FIRST PAGE LOAD
    ////////////////////////////////////////////////
    const firstLoad =  useEffect(() => {
        // GET AVALIABLE DATA
        const fetchData = async () => {
            const avaliableCategories = await getCategoriesCatalog()
                .then( (res) => {
                    setCategoryCatalog(res)
                })
        }
        fetchData();
    }, [])

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // Page Updates
    ////////////////////////////////////////////////

    const pageUpdates = useEffect( () => {
        if(categoryCatalog !== undefined){
            setCategoriesOptions(
                categoryCatalog.map( (key, i) => (
                    <option key={i}>{key.Name}</option>
                ))
            );
            setSubCategoriesOptions(categoryCatalog[0].Childs)
        }
    }, [categoryCatalog])
    
    return(
        <>
            <label>
                    Product Category:
                    <select 
                        ref={selectCategory}
                        onChange={ (e) => {
                            const value = selectCategory.current.value;
                            const subCats = categoryCatalog.find( ({Name}) => Name == value);
                            if( typeof subCats.Childs === 'string'){
                                console.log("empty")
                                setSubCategoriesOptions("")
                            } else {
                                setSubCategoriesOptions(
                                    subCats.Childs.map( (key, i) => (
                                        <option key={i}>{key}</option>
                                    ))
                                )
                            }
                        }} >
                        {categoriesOptions}
                    </select>
                </label>
                <label>Product Sub Category</label>
                <select 
                    ref={selectSubCategory} >
                    {subCategoriesOptions}
                </select>
        </>
    )
}
export default CategoryFields;