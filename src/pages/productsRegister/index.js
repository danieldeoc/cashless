import React, { useEffect, useRef, useState } from "react";
import { getAnalytics } from "firebase/analytics";
import { 
    getProductCatalog, 
    getProductUnitsCatalog, 
    AddProductToCatalog, 
    deletProductFromCatalog  
} from "../../globalOperators/globalGetters";

import { serverTimestamp } from "firebase/firestore";
import CategoryFields from "../../components/forms/CategoryFields/index";
import UnitSelect from "../../components/forms/UnitSelect/index";

function ProductsCatalog(){   
    //////////////////////////////
    // Get General Information
    const [productsCatalog, setProductsCatalog] = useState(undefined);   
    
    //////////////////////////////
    // Set new product information    
    const productName = useRef();

    //////////////////////////////
    // Interface information
    const [loader, setLoader] = useState("Wait...")
    const [productCatalogList, setProductCatalogList] = useState(loader);
    const [newCategory, setNewCategory] = useState("")
    const [newSubCategory, setNewSubCategory] = useState("");
    const [newAmmountType, setNewAmmountType] = useState("")

    //////////////////////////////
    // Creates a new product catalog
    async function createNewProduct(){
        const newProduct = {
            Name: productName.current.value,
            Category: newCategory,
            Subcategory: newSubCategory, 
            AmmountType: newAmmountType,
            LastPrice: "Not defined",
            AveragePrice: "Not avaliable",
            PriceHistory: ["Not avaliable"],
            CreatedAt: serverTimestamp()
        }
        

        if( newProduct.Name.length > 0){

           await AddProductToCatalog(newProduct)
                .then( (res) => {
                    getTheProductCatalog();
                }).catch( err => console.error(err) ) 


        } else {
            alert("Please, enter a product name")
        }

    }

    //////////////////////////////
    // get and creates the units options
    async function getTheProductCatalog(){
        const avaliableProducts = await getProductCatalog()
                .then((res) => {
                    setProductsCatalog(res);
                }).catch( err => console.error(err) )
    }
        

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // FIRST PAGE LOAD
    ////////////////////////////////////////////////
    const firstLoad =  useEffect( () => {
        // GET AVALIABLE DATA
        getTheProductCatalog()
    }, [])

    const pageUpdates = useEffect( () => {
        if(productsCatalog !== undefined){

            if(typeof productsCatalog[0] === 'string'){
                setProductCatalogList(productsCatalog[0])
            } else {
                setProductCatalogList(
                    productsCatalog.map((key, i) => (
                        <li key={i}>
                            {key.Name}
                            {key.Category}
                            {key.Subcategory}
                            {key.AmmountType}
                            {Date(key.CreatedAt)}
                            <i onClick={ async () => { 
                                await deletProductFromCatalog(key.id)
                                    .then( () => {
                                        getTheProductCatalog()
                                    }) 
                                }}>X</i>
                        </li>
                    ))
                )               
            }
        }    
    }, [productsCatalog])

    /////////////////////
    /// manages the categories and units changes
    function categoriesChanges(category, subcategory){
        setNewCategory(category);
        setNewSubCategory(subcategory)
    }

    return(
        <>
            <div className="addProductForm">
                <label>
                    Product Name:
                    <input 
                        type="text" 
                        ref={productName}  />
                </label>
                <CategoryFields onChangeHandler={(category, subcategory) => categoriesChanges(category, subcategory)} />
                <UnitSelect onChangeHandler={(unitType) => {
                    console.log(unitType)
                    setNewAmmountType(unitType) }} />
                <button onClick={createNewProduct}>Add</button>
            </div>
            <h2>Products Catalog</h2>
            <ul>
                {productCatalogList}
            </ul>
        </>
    )
}

export default ProductsCatalog;