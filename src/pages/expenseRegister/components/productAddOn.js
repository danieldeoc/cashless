import React, { useEffect, useState, useContext, createContext } from "react";
import { ExpenseContext}  from '../index.js';

import InputAutoComplete from "../../../components/forms/inputAutocomplet";
import Input from "../../../components/forms/input";
import {formatValueToMoney, formatValueTo3Digit, productTotalPrice, randomNumber} from "../../../customOperators/mathOperators.js";
import UnitSelect from "./unitySelect.js";
import CategoryFields from "./categorySelects.js";

export const ProductContext = createContext();

////////////////////////////////
// Multiple produc expense registration 
function ProductAddOn(){

    /* ################################# */
    // Gets the information catalogs from userContext
    const { productsCatalog } = useContext(ExpenseContext);
    const { calcTotalPurchasePrice } = useContext(ExpenseContext);
    const { unitsCatalog } = useContext(ExpenseContext);
    const { purchaseProductList, setPurchaseProductList} = useContext(ExpenseContext);
    const { expenseStore } = useContext(ExpenseContext);

    const [selectedProduct, setSelectedProduct] = useState(undefined)
    
    /* ################################# */
    // New Expense Constant
    const [tempId, setTempId] = useState(null);
    const [expenseId, setExpenseId] = useState(undefined);
    const [expenseName, setExpenseName] = useState(undefined);
    const [expenseCategory, setExpenseCategory] = useState(undefined);
    const [expenseSubCategory, setExpenseSubCategory] = useState(undefined);
    const [expenseAmmount, setExpenseAmmount] = useState("1");
    const [expenseAmmountType, setExpenseAmmountType] = useState(undefined);
    const [expensePrice, setExpensePrice] = useState("0.00");
    const [expenseLastPrice, setExpenseLastPrice] = useState("0.00");
    const [expenseTotalPrice, setExpenseTotalPrice] = useState("0.00");
    

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
        AmmountType: expenseAmmountType,
        LastPrice: expenseLastPrice,
        AveragePrice: 0.00,
        PriceHistory: [
            {
                Date: Date(),
                Price: expensePrice,
                Ammount: expenseAmmount,
                TotalPrice: expenseTotalPrice,
                Store: expenseStore
            },
        ],
        CreatedAt: Date()
    }
    
    ///////////////////////////////////////
    // updates the list of products
    const productManger = useEffect( () => {
        if( newProductRegister.listId != null){
            const purchaseIndex = purchaseProductList.findIndex( ({listId}) => listId == tempId );
            if(purchaseIndex == -1){
                purchaseProductList.push(newProductRegister)
            } else {
                purchaseProductList[purchaseIndex] = newProductRegister;
            }
            
        }
    }, [expenseName, expenseCategory, expenseSubCategory, expenseAmmountType, expenseAmmount, expensePrice, expenseTotalPrice ])
    
    const totalPurchase = useEffect( () => {
        calcTotalPurchasePrice();
    }, [expenseTotalPrice]);
    
    const initialAmmount = useEffect( () => {
        if(unitsCatalog !== undefined){
            setExpenseAmmountType(unitsCatalog[0])
        }
    }, [unitsCatalog])

    const expenseTotalPriceCalc = () => {
        setExpenseTotalPrice(productTotalPrice(expensePrice, expenseAmmount));
    }

    function setExpenseDetails(name){
        const product = productsCatalog.find( ({Name}) => Name == name)
        if(product !== undefined){
            setExpenseId(product.id)
            setSelectedProduct(product)
            setExpenseCategory(product.Category)
            setExpenseSubCategory(product.Subcategory)
            setExpenseAmmountType(product.AmmountType)
        } 
    }

    const productGlobals = { selectedProduct, setSelectedProduct }
    
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
                        setExpenseDetails(key)           
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
                    steps="0.001"
                    value={expenseAmmount}
                    onKeyUpHandler={() => {
                        expenseTotalPriceCalc()
                    }}
                    onChangeHandler={ (key) => { 
                        const ammountUnit = formatValueTo3Digit(key)
                        setExpenseAmmount(ammountUnit) 
                        expenseTotalPriceCalc()
                    }}
                    />

                <UnitSelect
                    onChangeHandler={ (value) => { setExpenseAmmountType(value) } } />

                <Input
                    id="price"
                    label="Price per unit:"
                    value={expensePrice}
                    type="number"
                    steps="0.01"
                    onKeyUpHandler={() => {
                        expenseTotalPriceCalc()
                    }}
                    onChangeHandler={ (key) => { 
                        const priceUnit = formatValueToMoney(key)
                        setExpensePrice(priceUnit);
                        setExpenseLastPrice(priceUnit)
                        expenseTotalPriceCalc()
                    }}
                    />

                    <span>
                        {expenseTotalPrice}
                    </span>
                
            </blockquote>
        </ProductContext.Provider>
    )   
}

export default ProductAddOn;