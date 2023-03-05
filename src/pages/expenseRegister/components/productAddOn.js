import React, { useEffect, useState, useContext } from "react";
import { ExpenseContext}  from '../registerExpenses.js';

import InputAutoComplete from "../../../components/forms/inputAutocomplet";
import SelectBox from "../../../components/forms/select";
import Input from "../../../components/forms/input";

function ProductAddOn(){
    const { unitsCatalog } = useContext(ExpenseContext);
    const { productsCatalog } = useContext(ExpenseContext);
    const { accountCatalog } = useContext(ExpenseContext);
    const { categoriesCatalog } = useContext(ExpenseContext);
    const { expensesCatalog } = useContext(ExpenseContext);

    /* ################################# */
    // EXPENSE CONSTANTS
    const [expenseName, setExpenseName] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expenseSubCategory, setExpenseSubCategory] = useState("");
    const [expenseAmmount, setExpenseAmmount] = useState(1);
    const [expenseAmmountType, setExpenseAmmountType] = useState("");
    const [expensePrice, setExpensePrice] = useState("0,00");
    const [expenseTotalPrice, setExpenseTotalPrice] = useState("0,00");
    


    /* ################################# */
    // PAGE CONSTANTS
    const [subCategoriesOptions, setSubCategoriesOptions] = useState(["Wait..."])
    


    const firstRegister = useEffect( () => {
        //console.log("expense Catalog changed", expensesCatalog, expensesCatalog.length)
        if(expensesCatalog.length > 1){

            setExpenseCategory( categoriesCatalog[0].Name);
            setExpenseSubCategory( categoriesCatalog[0].Childs)
            setExpenseAmmountType( unitsCatalog[0])
            setSubCategoriesOptions(
                categoriesCatalog[0].Childs
            );
        }
       
    }, [expensesCatalog])

    ///////////////////////
    // products exange
    const producVariablesChange = useEffect(() => {
        
        let expenseFinder = productsCatalog.find( 
            ({Name}) => Name === expenseName
            );
            if(expenseFinder !== undefined){
                
                console.log("ex", expenseFinder);
                
                setExpenseCategory(expenseFinder.category);
                setExpenseSubCategory(expenseFinder.Childs)

                //  subCategoriesOptions( expenseFinder.Childs)
            }

        }, [expenseName])
    
    return(
        
        
        <blockquote>
            <ul>
                <li>Nome: {expenseName} </li>
                <li>Categoria: {expenseCategory} </li>
                <li>Sub-categoria: {expenseSubCategory} </li>
                <li>Ammount: {expenseAmmount} </li>
                <li>Ammount type: {expenseAmmountType} </li>
                <li>Price: {expensePrice}</li>
                <li>Total price: {expenseTotalPrice}</li>
                
            </ul>

                    <h3>Product</h3>
                    <InputAutoComplete 
                        id="productCatalogFilter" 
                        value={expenseName}
                        list={productsCatalog}
                        onChangeHandler={ (key) => { 
                            setExpenseName(key);
                        }}
                         />
                    <SelectBox 
                        label="Categoria:"
                        value={expenseCategory}
                        options={categoriesCatalog.map( key => key.Name )} 
                        onChangeHandler={ (key) => { 
                            console.log(key, categoriesCatalog)
                            setSubCategoriesOptions("");
                            setExpenseCategory(key);
                            let subOptions = categoriesCatalog.find(({Name}) => Name === key)
                            setExpenseSubCategory(subOptions.Childs[0])
                            setSubCategoriesOptions(subOptions.Childs)
                        }}/>
                    <SelectBox 
                        label="Sub-categoria"
                        options={ subCategoriesOptions }
                        onChangeHandler={ (key) => { 
                            setExpenseSubCategory(key)
                        }} />

                    

                    <Input
                        id="ammount"
                        label="Ammount:"
                        value={expenseAmmount}
                        onChangeHandler={ (key) => { 
                            setExpenseAmmount(key)
                        }}
                        />

                    <SelectBox 
                        label="Units"
                        options={unitsCatalog}
                        onChangeHandler={ (key) => { 
                            setExpenseAmmountType(key)
                        }}  />

                    <Input
                        id="price"
                        label="Price per unit:"
                        value={expensePrice}
                        onChangeHandler={ (key) => { 
                            setExpensePrice(key)
                            let totalPrice = key * expenseAmmount;
                            //let formatedPrice = totalPrice.replace(",", ".");
                            setExpenseTotalPrice(totalPrice)
                        }}
                        />

                    <span>
                        {expenseTotalPrice}
                    </span>
   

                </blockquote>
        )

    
}

export default ProductAddOn;