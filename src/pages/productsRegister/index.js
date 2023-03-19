import React, { useEffect, useRef, useState } from "react";
import { 
    
    getProductUnitsCatalog,    
    
} from "../../globalOperators/globalGetters";

import { getCategoriesCatalog } from "../../firebase/categories";
import { addProductToCatalog, deleteProductFromCatalog, getProductCatalog } from "../../firebase/product"

import { Timestamp, serverTimestamp } from "firebase/firestore";
import Loader from "../../components/elements/loader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import ConfirmDialog from "../../components/elements/messages/confirm";
import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Input from "../../components/forms/input";
import SelectBox from "../../components/forms/select";
import Alert from "../../components/elements/messages/alert";
import PrimaryButton from "../../components/elements/buttons/primaryButton";
import { getDate } from "../../tools/dateTools";

import {Link} from "react-router-dom";

function ProductsCatalog(){   
    //////////////////////////////
    // Get General Information
    const [productsCatalog, setProductsCatalog] = useState(undefined);   
    const [unitsCatalog, setUnitsCatalog] = useState(undefined);
    const [categoryCatalog, setCategoryCatalog] = useState(undefined)

    const [mainCategoriesCatalog, setMainCategoriesCatalog] = useState(undefined)
    const [currentSubCategoriesCatalog, setCurrentSubCategoriesCatalog] = useState(undefined)
    
    //////////////////////////////
    // Set new product information    
    const [productName, setProductName] = useState(undefined)
    const [productCategory, setProductCategory] = useState(undefined)
    const [productSubCategory, setProductSubCategory] = useState(undefined)
    const [productAmmountType, setProductAmmountType] = useState(undefined)

    const [productPriceHistory, setProductPriceHistory] = useState(false)

    const newProduct = {
        Name: productName,
        Category: productCategory,
        Subcategory: productSubCategory, 
        AmountType: productAmmountType,
        LastPrice: 0.00,
        AveragePrice: 0.00,
        CreatedAt: serverTimestamp(),
    }

    //////////////////////////////
    // Interface information
    const [loader, setLoader] = useState(<Loader />)
    const [productCatalogList, setProductCatalogList] = useState(loader);
    const [newCategory, setNewCategory] = useState("")
    const [newSubCategory, setNewSubCategory] = useState("");
    

    //////////////////////
    // messages
    const [returningAlerts, setReturningAlerts] = useState("");


    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // DELETE ACTIONS
    ////////////////////////////////////////////////
    function confirmeProductDelete(id){
        setReturningAlerts(null);
        setProductCatalogList(loader);
        deleteProductFromCatalog(id).then( 
            (response) => {
                console.log("res", response)
                setReturningAlerts(
                    <Alert
                        message={response.message}
                        classes={response.classes}
                        display={response.display}
                        />
                )
                getCatalogs();
            })
    }

    function denyDelete(){
        setReturningAlerts(null);
    }

    ////////////////////////////
    // Categories management
    function changeSubCategories(category){
        const categoryInfo = categoryCatalog.find( ({Name}) => Name == category);
        setSubcategories(categoryInfo)
    }

    function setSubcategories(subSet){      
        let subCats = subSet.Childs;
        if(subCats == ""){
            let subcat = ["Not avaliable"];
            setProductSubCategory(subcat)
            setCurrentSubCategoriesCatalog(subcat)
        } else {
           setProductSubCategory(subCats[0])
           setCurrentSubCategoriesCatalog(subCats.map( key => key))
        }
    }

    //////////////////////////////
    // Get the catalogs
    async function getCatalogs(){
        await getProductCatalog()
            .then((res) => {
                setProductsCatalog(res);                
            })
        await getProductUnitsCatalog()
            .then(
                (res) => {
                    setUnitsCatalog(res)
                    setProductAmmountType(res[0])
                } 
            ) 
        await getCategoriesCatalog()
            .then(
                (res) => {
                    setCategoryCatalog(res)
                    setProductCategory(res[0].Name)
                    setMainCategoriesCatalog(
                        res.map( (key) => key.Name)
                        )
                    setSubcategories(res[0])
                } 
            )
    }

    function checkPriceHistory(key){
        let hasPriceHistory = productsCatalog.find( ({id}) => id == key);
        if(hasPriceHistory.LastPrice != 0){
            let linkAdress = "/products/priceHistory?productId="+key;
            return <Link to={linkAdress}>Check Price History</Link>
        } 
    }

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // FIRST PAGE LOAD
    ////////////////////////////////////////////////
    const firstLoad =  useEffect( () => {
        getCatalogs();
    }, []);

    const catalogUpdate =  useEffect( () => {
        drawPageList()
    }, [productsCatalog]);

    function drawPageList(){
        if(productsCatalog !== undefined){
            if(productsCatalog[0] == "No products rsgitered yet."){
                setProductCatalogList(
                    productsCatalog.map( (key, i) => ( 
                        <li key={i} className="empty-list">  
                            {key}
                        </li>
                    ))
                )
            } else {

                setProductCatalogList(
                    productsCatalog.map((key, i) => (
                        <li key={i}>
                            {key.Name}
    
                            <span 
                                className="delete-item-list" 
                                onClick={ () => {
                                    setReturningAlerts(
                                        <ConfirmDialog 
                                            message="Do you realy want to delete this product from the catalog?"
                                            onConfirmHandler={(event) => { confirmeProductDelete(key.id) }}
                                            onDenyHandle={denyDelete}
                                            />)
                                    }}>
                                <FontAwesomeIcon icon={faX} />
                            </span>
    
                            <div className="li-container">
                                <span className="li-container-label">
                                    <strong>Category:</strong> <br/>
                                    {key.Category}
                                </span>
                                <span className="li-container-label">
                                    <strong>Sub-category:</strong><br/>
                                    {key.Subcategory}
                                </span>
                                <span className="li-container-label">
                                    <strong>Ammount type:</strong> <br/>
                                    {key.AmountType}
                                </span>
                                <span className="li-container-label">
                                    <strong>Created at:</strong><br/>
                                     {getDate(key.CreatedAt)}
                                </span>
    
                                {checkPriceHistory(key.id)}
                            </div>
    
                        </li>
                    ))
                )               
            }
        }
    }  
    



    //////////////////////////////
    // Creates a new product catalog
    async function createNewProduct(){
        if(
            productName &&
            productCategory &&
            productSubCategory &&
            productAmmountType
        ) {    
            setReturningAlerts(<Loader type="fullscreen" /> )
            setProductCatalogList(loader)
            addProductToCatalog(newProduct).then(
                (response) => {
                    setReturningAlerts(
                        <Alert
                            message={response.message}
                            classes={response.classes}
                            display={response.display}
                            />
                    );
                    getCatalogs();
                }
            )
        } else {
            setReturningAlerts(
                <Alert
                    message="Please, fill all fields"
                    classes="warning"
                    display="true"
                    />
            )
            if(!productName){
                document.getElementById("product_name").focus()
            }

        }
    }

    
    /////////////////////
    /// manages the categories and units changes
    function categoriesChanges(category, subcategory){
        setNewCategory(category);
        setNewSubCategory(subcategory)
    }

    return(
        <>
            <PageTitle text="Products" />
            <PageBox>
                <SectionTitle text="Add a new product" />  

                <Input 
                    type="text"
                    id="product_name"
                    label="Product name:"
                    placeholder="Insert product name"
                    value={productName} 
                    onChangeHandler={(result) => { 
                        setProductName(result) ;
                    }}
                    />

                <SelectBox 
                    id="categories"
                    label="Select a category"
                    onChangeHandler={ (result) => { 
                        setProductCategory(result);
                        changeSubCategories(result)
                    }}
                    classes="category-select"
                    options={mainCategoriesCatalog}
                    />

                <SelectBox 
                    id="subCategories"
                    label="Select a subcategory"
                    onChangeHandler={ (result) => { 
                        setProductSubCategory(result)
                    }}
                    classes="category-select"
                    options={currentSubCategoriesCatalog}
                    />

                <SelectBox 
                    id="ammountType"
                    label="Select an ammount type"
                    onChangeHandler={ (result) => { 
                        setProductAmmountType(result)
                    }}
                    classes="category-select"
                    options={unitsCatalog}
                    />              
                
                    
                <PrimaryButton
                    label="Add New Product"
                    onClickHandler={createNewProduct} /> 

                    
                
            </PageBox>

            <PageBox>
                <SectionTitle text="Products Catalog" />  
                <ul className="table-list">
                    {productCatalogList}
                </ul>
            </PageBox>
            

            {returningAlerts}
        </>
    )
}

export default ProductsCatalog;