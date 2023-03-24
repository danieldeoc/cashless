import React, { useEffect, useState, useContext, createContext, useRef, useCallback } from "react";
import { ExpenseContext}  from '../index.js';
import { randomNumber,productTotalPrice, formatValueTo2Digit } from "../../../tools/mathTools.js";

import InputAutoComplete from "../../../components/forms/inputAutocomplet";


import CategoryFields from "./categorySelects.js";

import { serverTimestamp } from "firebase/firestore";

import PageBox from "../../../components/elements/pageBox.js";
import PageTitle from "../../../components/elements/texts/pageTitle";
import SectionTitle from "../../../components/elements/texts/sectionTitle";
import Input from "../../../components/forms/input";
import SelectBox from "../../../components/forms/select";
import PrimaryButton from "../../../components/elements/buttons/primaryButton";
import Alert from "../../../components/elements/messages/alert";
import Loader from "../../../components/elements/loader";
import FormSection from "../../../components/forms/formSection.js";
import SubTitle from "../../../components/elements/texts/subTitle.js";


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

    const {expenseStore, setExpenseStore} = useContext(ExpenseContext);

   
    
    /* ################################# */
    // New Expense Constant
    const [tempId, setTempId] = useState(randomNumber(1000000));
    const [expenseId, setExpenseId] = useState(undefined); // document ID
    const [expenseName, setExpenseName] = useState("");
    const [expenseCategory, setExpenseCategory] = useState(undefined);
    const [expenseSubCategory, setExpenseSubCategory] = useState(undefined);
    const [expenseAmount, setExpenseAmount] = useState(1);
    const [expenseAmountType, setExpenseAmountType] = useState(undefined);
    const [expensePrice, setExpensePrice] = useState(0.00);
    const [expenseLastPrice, setExpenseLastPrice] = useState(0.00);
    const [expenseAveragePrice, setExpenseAveragePrice] = useState(0.00);
    const [expenseTotalPrice, setExpenseTotalPrice] = useState(0.00);    
    const [creationDate, setCreationDate] = useState(serverTimestamp());

    const productGlobals = { expenseName, setExpenseName }

    

    const [categoriesOptions, setCategoriesOptions] = useState(undefined);
    const [subCategoriesOptions, setSubCategoriesOptions] = useState(undefined);


    ///////
    // new product object
    const newProductRegister = {
        listId: tempId,
        id: expenseId,
        Name: expenseName,
        Category: expenseCategory,
        Subcategory: expenseSubCategory, 

        Amount:  Number(expenseAmount),
        AmountType: expenseAmountType,

        Price: Number(expensePrice),
        TotalPrice: expenseTotalPrice,
        LastPrice: expenseLastPrice,
        AveragePrice: expenseAveragePrice,

        CreatedAt: creationDate
    }
    
    ///////////////////////////////////////
    // updates the list of products
    const productManger = useEffect( () => {
        if( newProductRegister.listId != null){
            const purchaseIndex = purchaseProductList.findIndex( ({listId}) => listId == tempId );
            if(purchaseIndex == -1){
                purchaseProductList.push(newProductRegister)
            } else {
                let productList = purchaseProductList;
                productList[purchaseIndex] = newProductRegister;
                setPurchaseProductList(productList)
            }
        }
    }, [expenseName, expenseCategory, expenseSubCategory, expenseAmountType, expenseAmount, expensePrice, expenseTotalPrice ])
    


    ///////////////////////////////
    // updates a info in the catalog
    const autoCompleteWithList = useEffect( () => {
        if(productsCatalog){
            let product = productsCatalog.find( ({Name}) => Name == expenseName);        
            if(product !== undefined){ // produc exist, so, get data from catalog
                setExpenseId(product.id)
                setExpenseCategory(product.Category)
                drawSubCategoryOptions(product.Category, product.Subcategory)
                          
                let amount = product.AmountType;
                setExpenseAmountType(amount)  
                document.getElementById("amountType"+tempId).value = amount;
    
                setCreationDate(product.CreatedAt);      
                
                let price = formatValueTo2Digit(product.LastPrice)
                setExpenseLastPrice(Number(price))
                setExpensePrice(Number(price))
                document.getElementById("price"+tempId).value = price;
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
            setExpenseAmountType(unitsCatalog[0])
        }
    }, [unitsCatalog])

    const priceConstants = useEffect(() => {
        let price = formatValueTo2Digit(Number(expensePrice));
        let ammount = Number(expenseAmount);
        let total = productTotalPrice(price, ammount);
        setExpenseTotalPrice(total);
        document.getElementById("totalprice"+tempId).value = total;
    }, [expensePrice, expenseAmount])
    
    
    ////////////////////////////////////
    ///////////////////////////////////
    // set Initial values
    const initialValues = useEffect( () => {
        if(categoryCatalog){
            setExpenseCategory(categoryCatalog[0].Name);
            setExpenseSubCategory(categoryCatalog[0].Childs);
            drawSubCategoryOptions(categoryCatalog[0].Name)
        }

    }, [categoryCatalog])

     ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // Page Updates
    ////////////////////////////////////////////////
    
    function drawSubCategoryOptions(category, subcategory, catalog){
        let subCats = categoryCatalog.find( ({Name}) => Name == category);
        setCategoriesOptions(
            categoryCatalog.map( (key, i) => (
                key.Name
                ))
            );

        const childs = subCats.Childs;
        if( childs == ""){
            setExpenseSubCategory("")
            setSubCategoriesOptions([""])
        } else {    
            setSubCategoriesOptions(
                childs.map( key => key)
            )
            setTimeout(() => {
                if( subcategory){
                    setExpenseSubCategory(subcategory)
                } else {
                    setExpenseSubCategory(childs[0])
                }
            }, 300)
        }
    }
    

    const subTitleText = `Product: ${expenseName}`;
    ///////////////////////
    // INTERFACE
    return(
        <ProductContext.Provider value={productGlobals}>
            
            <FormSection>
                <SubTitle text={subTitleText} />
                <InputAutoComplete 
                    label="Product name:"
                    placeholder="Inser a product name"
                    value={expenseName}
                    onChangeHandler={ (key) => { 
                        setExpenseName(key);                                    
                    }} />


                <SelectBox 
                    label="Select a category"
                    value={expenseCategory}
                    onChangeHandler={ (result) => { 
                        setExpenseCategory(result)
                        drawSubCategoryOptions(result)
                    }}
                    classes="category-select"
                    options={categoriesOptions}
                    />
                
                <SelectBox 
                    label="Select a subcategory"
                    value={expenseSubCategory}
                    onChangeHandler={ (result) => { 
                        setExpenseSubCategory(result)
                    }}
                    classes="category-select"
                    options={subCategoriesOptions}
                    />  
                
                <Input
                    id="amount"
                    label="Amount:"
                    type="number"
                    steps="0.010"
                    value={expenseAmount}
                    onChangeHandler={ (key) => { 
                        setExpenseAmount(key) 
                    }}
                    />

                <SelectBox 
                    id={"amountType"+tempId}
                    label="Select an amount type"
                    onChangeHandler={ (result) => { 
                        setExpenseAmountType(result)
                    }}
                    options={unitsCatalog}
                    />
                
                <Input
                    id={"price"+tempId}
                    label={"Price per "+expenseAmountType}
                    value={expensePrice}
                    type="number"
                    steps="0.10"
                    onChangeHandler={ (key) => { 
                        let price = formatValueTo2Digit(Number(key))
                        setExpensePrice(price);
                        setExpenseLastPrice(price)
                    }}
                    /> 


                <Input
                    id={"totalprice"+tempId}
                    label="Total: "
                    value={expenseTotalPrice}
                    type="number"
                    steps="0.10"
                    onChangeHandler={ (key) => { 
                        let price = formatValueTo2Digit(Number(key))
                        setExpenseTotalPrice(price)
                    }}
                    /> 
            </FormSection> 
            
        </ProductContext.Provider>
    )   
}

export default ProductAddOn;