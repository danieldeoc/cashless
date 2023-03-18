import React, { useContext, useEffect, useRef, useState } from "react";
import { ExpenseContext } from "../../../pages/expenseRegister";
import { ProductContext } from "../../../pages/expenseRegister/components/productAddOn";

import SelectBox from "../../../components/forms/select";

function CategoryFields(props){

    const { categoryCatalog } = useContext(ExpenseContext);

    

    ////////////////
    // set Initial Values
    const pageUpdates = useEffect( () => {
        if(categoryCatalog !== undefined){
            
        }
    }, [categoryCatalog])


   

    const caegoryId = "mainCategory"+props.id;
    const subCategoryId = "subCategory"+props.id;
    
    return(
        <>
                      
        </>
    )
}
export default CategoryFields;