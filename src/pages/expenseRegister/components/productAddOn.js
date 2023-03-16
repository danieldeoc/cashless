import React, { useEffect, useState, useContext, createContext, useRef } from "react";
import { ExpenseContext}  from '../index.js';
import { randomNumber,productTotalPrice } from "../../../tools/mathTools.js";

import InputAutoComplete from "../../../components/forms/inputAutocomplet";
import Input from "../../../components/forms/input";
import UnitSelect from "./unitySelect.js";
import CategoryFields from "./categorySelects.js";

import { serverTimestamp } from "firebase/firestore";


export const ProductContext = createContext();

////////////////////////////////
// Multiple produc expense registration 
function ProductAddOn(props){

    /* ################################# */
    // Gets the information catalogs from userContext
    const { productsCatalog } = useContext(ExpenseContext);
    const { categoryCatalog } = useContext(ExpenseContext);
    
    const { calcTotalPurchasePrice } = useContext(ExpenseContext);
    const { unitsCatalog } = useContext(ExpenseContext);
    const { purchaseProductList, setPurchaseProductList} = useContext(ExpenseContext);
    const { expenseBankCurrency } = useContext(ExpenseContext);

    const [selectedProduct, setSelectedProduct] = useState(undefined)
    
    /* ################################# */
    // New Expense Constant
    const [tempId, setTempId] = useState(null);

    const [expenseId, setExpenseId] = useState(undefined); // document ID
    const [expenseName, setExpenseName] = useState(undefined);
    const [expenseCategory, setExpenseCategory] = useState(undefined);
    const [expenseSubCategory, setExpenseSubCategory] = useState(undefined);

    const [expenseAmmount, setExpenseAmmount] = useState(1);
    const [expenseAmmountType, setExpenseAmmountType] = useState(undefined);

    const [expensePrice, setExpensePrice] = useState(0.00);
    const [expenseLastPrice, setExpenseLastPrice] = useState(0.00);
    const [expenseAveragePrice, setExpenseAveragePrice] = useState(0.00);
    const [expenseTotalPrice, setExpenseTotalPrice] = useState(0.00);

    const [expenseStore, setExpenseStore] = useState(undefined)
    
    const [creationDate, setCreationDate] = useState(serverTimestamp());

    const productGlobals = { selectedProduct, setSelectedProduct }

    //////////////////////////////
    // First render and load of information
    const firstRender = useEffect( () => {
        if(newProductRegister.listId === null){
            let temp = randomNumber(1000000);
            setTempId(temp)
        }
    }, [productsCatalog])

    ///////
    // new product object
    const newProductRegister = {
        listId: tempId,
        id: expenseId,
        Name: expenseName,
        Category: expenseCategory,
        Subcategory: expenseSubCategory, 

        Amount:  Number(expenseAmmount),
        AmountType: expenseAmmountType,

        Price: Number(expensePrice),
        TotalPrice: expenseTotalPrice,
        LastPrice: expenseLastPrice,
        AveragePrice: expenseAveragePrice,

        CreatedAt: creationDate,
        Store: expenseStore
    }
    
    ///////////////////////////////////////
    // updates the list of products
    const productManger = useEffect( () => {
        if( newProductRegister.listId != null){
            const purchaseIndex = purchaseProductList.findIndex( ({listId}) => listId == tempId );
            if(purchaseIndex == -1){
                console.log("added register")
                purchaseProductList.push(newProductRegister)
            } else {
                let productList = purchaseProductList;
                productList[purchaseIndex] = newProductRegister;
                setPurchaseProductList(productList)
            }
        }
    }, [expenseName, expenseCategory, expenseSubCategory, expenseAmmountType, expenseAmmount, expensePrice, expenseTotalPrice ])
    


    ///////////////////////////////
    // updates a info in the catalog
    const catalogAutoComplete = useEffect( () => {
        if(productsCatalog){
            let product = productsCatalog.find( ({Name}) => Name == expenseName);        
            if(product !== undefined){ // produc exist, so, get data from catalog
                console.log("prod", product)
                setExpenseId(product.id)
                setExpenseCategory(product.Category)
                setExpenseSubCategory(product.Subcategory)            
                setExpenseAmmountType(product.AmmountType)   
                setExpenseLastPrice(product.LastPrice)
                setExpensePrice(product.LastPrice)
                setCreationDate(product.CreatedAt);
                setSelectedProduct(product);
            } 
        }
    }, [expenseName])


    //////////////////////////
    /// product price and total price calculations
    const totalPurchase = useEffect( () => {
        calcTotalPurchasePrice();
    }, [expenseTotalPrice]);
    
    const initialAmmount = useEffect( () => {
        if(unitsCatalog !== undefined){
            setExpenseAmmountType(unitsCatalog[0])
        }
    }, [unitsCatalog])

    const priceConstants = useEffect(() => {
        let price = Number(expensePrice);
        let ammount = Number(expenseAmmount);
        setExpenseTotalPrice(productTotalPrice(price, ammount));
    }, [expensePrice, expenseAmmount])
    
    
    ////////////////////////////////////
    ///////////////////////////////////
    // set Initial values
    const initialValues = useEffect( () => {
        if(categoryCatalog){
            setExpenseCategory(categoryCatalog[0].Name);
            setExpenseSubCategory(categoryCatalog[0].Childs);
        }

    }, [categoryCatalog])

    

    
    ///////////////////////
    // INTERFACE
    return(
        <ProductContext.Provider value={productGlobals}>
            <blockquote>
                <h3>Product</h3>
                
                <InputAutoComplete 
                    value={expenseName}
                    onChangeHandler={ (key) => { 
                        setExpenseName(key);                                    
                    }} />
                
                <CategoryFields 
                    expenseName={expenseName} // when this var changes, its needed o change the states
                    onChangeHandler={ (category, subCategory) => { 
                        setExpenseCategory(category)
                        setExpenseSubCategory(subCategory)
                     }} />
                
                <Input
                    id="ammount"
                    label="Ammount:"
                    type="number"
                    steps="0.010"
                    value={expenseAmmount}
                    onChangeHandler={ (key) => { 
                        setExpenseAmmount(key) 
                    }}
                    />

                <UnitSelect
                    onChangeHandler={ (value) => { setExpenseAmmountType(value) } } />
                    | 
                
                <Input
                    id="price"
                    label="Price per unit: "
                    value={expensePrice}
                    type="number"
                    steps="0.10"
                    onChangeHandler={ (key) => { 
                        setExpensePrice(key);
                        setExpenseLastPrice( Number(key) )
                    }}
                    /> {expenseBankCurrency}

                    <span>
                         {expenseTotalPrice} {expenseBankCurrency}
                    </span>
                
            </blockquote>
        </ProductContext.Provider>
    )   
}

export default ProductAddOn;