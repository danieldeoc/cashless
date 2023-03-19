import React, { useCallback, useEffect,useRef, useState, useContext } from "react";
import { randomNumber } from "../../tools/mathTools";
import { ExpenseContext }  from '../../pages/expenseRegister/index.js';
import { ProductContext } from "../../pages/expenseRegister/components/productAddOn";

import Input from "../../components/forms/input";

function InputAutoComplete(props){

    //////////////////////////////////
    // get the productCatalog
    const { productsCatalog } = useContext(ExpenseContext);   
    
    const { expenseName, setExpenseName } = useContext(ProductContext);  

    /////////////////////
    // get the input values
    const [inputValue, setInputValue] = useState(props.value); // the default value of the input
    const [inputId, setInputId] = useState(undefined) // the input id
    const [ulId, setUlId] = useState(undefined) // the list id

    /////////////////
    // get product catalog list
    const [productCatalogList, setProductCatalogList] = useState(["Wait..."]);

    ///////////////////////////////
    // first load
    const firstLoad = useEffect( () => {
        const randomId = "autocomplete"+randomNumber("222");
        setInputId(randomId)
        setUlId(randomId+"_listBox")
    }, []);

    ///////////////////////////////
    // catalog loaded
    const catalogLoaded = useEffect( () => {
        if( productsCatalog !== undefined && inputId !== undefined){
            setProductCatalogList(
                productsCatalog.map( (key, i) => (      
                    <li 
                        key={inputId+"_"+key.id} 
                        className={`li_${inputId} hide`}
                        onClick={ () => {
                            setExpenseName(key.Name);
                            document.getElementById(inputId).value = key.Name;
                            document.getElementById(inputId+"_listBox").classList.remove("visible")
                        }}
                    >
                        {key.Name}
                    </li>
                ))
            )
        }        
    }, [productsCatalog, inputId]);
    
    //////////////////////////
    // Filter the sugestion list
    function filterList(product)  {
        let classSelector = ".li_"+inputId;
        const liList = document.querySelectorAll(classSelector)
        let listContainer = document.getElementById(inputId+"_listBox")
        let typedUp = product.toUpperCase();
        let typeDown = product.toLowerCase();
        listContainer.classList.add("visible");

        liList.forEach( (node) => {
            if(product.length > 0){ 
                if(node.textContent.includes(product) || node.textContent.toUpperCase().includes(typedUp) || node.textContent.toLowerCase().includes(typeDown) ){
                    node.classList.remove("hide")
                    if(node.textContent == product){
                        listContainer.classList.remove("visible");
                    }

                } else {
                    node.classList.add("hide")
                }
            } else {
                node.classList.add("hide")
            }
        })
    }

    const autoListShow = useEffect( () => {
        if(productsCatalog){
            let ele = document.getElementById("inputContainer");
            let list = document.getElementById(ulId);
            if(ele){
                ele.addEventListener("focus", () =>{
                   list.classList.add("visible")
                })
                ele.addEventListener("focusout", () =>{
                    setTimeout( () => {
                        list.classList.remove("visible")
                    }, 500)
                })
            }
        }
    }, [productsCatalog])


    return(
        <div id="inputContainer" className="input-autocomplete-box">
            <Input 
                id={inputId}
                type="text"
                label={props.label}
                placeholder={props.placeholder}
                value={inputValue}
                onChangeHandler={ (result) => { 
                    setInputValue(result);
                    props.onChangeHandler(result)
                }}
                onKeyUpHandler={ (result) => { 
                    filterList(result);
                    props.onChangeHandler(result) } }
                />
            <ul id={ulId} className="autoCompleteList">
                {productCatalogList}
            </ul>
        </div>
    )
}

export default InputAutoComplete;