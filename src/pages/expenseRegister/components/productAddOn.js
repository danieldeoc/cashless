import React, { useEffect, useState, useContext } from "react";
import { ExpenseContext}  from '../index.js';

import InputAutoComplete from "../../../components/forms/inputAutocomplet";
import Input from "../../../components/forms/input";
import {formatValueToMoney, formatValueTo3Digit, productTotalPrice, randomNumber} from "../../../customOperators/mathOperators.js";
import UnitSelect from "../../../components/forms/UnitSelect/index.js";
import CategoryFields from "../../../components/forms/CategoryFields/index.js";

////////////////////////////////
// Multiple produc expense registration 
function ProductAddOn(){

    /* ################################# */
    // Gets the information catalogs from userContext
    const { productsCatalog } = useContext(ExpenseContext);
    const { calcTotalPurchasePrice } = useContext(ExpenseContext)
    const { purchaseProductList, setPurchaseProductList} = useContext(ExpenseContext);
    
    /* ################################# */
    // New Expense Constant
    const [tempId, setTempId] = useState(null);
    const [expenseName, setExpenseName] = useState(undefined);
    const [expenseCategory, setExpenseCategory] = useState(undefined);
    const [expenseSubCategory, setExpenseSubCategory] = useState(undefined);
    const [expenseAmmount, setExpenseAmmount] = useState("1");
    const [expenseAmmountType, setExpenseAmmountType] = useState(undefined);
    const [expensePrice, setExpensePrice] = useState("0.00");
    const [expenseTotalPrice, setExpenseTotalPrice] = useState("0.00");

    //////////////////////////////
    // First render and load of information
    const firstRender = useEffect( () => {
        if(newProductRegister.listId === null){
            let temp = randomNumber(1000000);
            setTempId(temp)
        }


    }, [productsCatalog])

    const newProductRegister = {
        listId: tempId,
        Name: expenseName,
        Category: expenseCategory,
        Subcategory: expenseSubCategory, 
        AmmountType: expenseAmmountType,
        LastPrice: 0.00,
        AveragePrice: 0.00,
        PriceHistory: [
            {
                Date: Date(),
                Price: expensePrice,
                Ammount: expenseAmmount,
                TotalPrice: expenseTotalPrice,
                Store: "Name"
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
    }, [expenseTotalPrice])


    ///////////////////////
    // Page update on product Name change
    const producVariablesChange = useEffect(() => {
/*        let expenseFinder = productsCatalog.find( 
            ({Name}) => Name === expenseName);
            if(expenseFinder !== undefined){
                setExpenseCategory(expenseFinder.category);                
                setExpenseSubCategory(expenseFinder.categoryChild)
            } */
        }, [expenseName])

    const expenseTotalPriceCalc = () => {
        setExpenseTotalPrice(productTotalPrice(expensePrice, expenseAmmount));
    }

    function setExpenseDetails(name){
        const product = productsCatalog.find( ({Name}) => Name == name)

        if(product !== undefined){
            console.log("Expense: ", product) 
            setExpenseName(product.Name);  
            setExpenseCategory(product.Category)
            setExpenseSubCategory(product.Subcategory)
            setExpenseAmmountType(product.AmmountType)

            

        }

    }
    
    ///////////////////////
    // INTERFACE
    return(
        <blockquote>
            <h3>Product</h3>
            <InputAutoComplete 
                value={expenseName}
                list={productsCatalog}
                onChangeHandler={ (key) => { 
                    setExpenseDetails(key)           
                }}
                    />
            
        </blockquote>
        )   
}

export default ProductAddOn;