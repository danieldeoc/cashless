import React, { useCallback, useEffect,useRef, useState, useContext } from "react";
import { randomNumber } from "../../tools/mathTools";
import { ExpenseContext }  from '../../pages/expenseRegister/index.js';

function InputAutoComplete(props){

    //////////////////////////////////
    // get the productCatalog
    const { productsCatalog } = useContext(ExpenseContext);    

    /////////////////////
    // get the input values
    const input = useRef();

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
                        className={`li_${inputId}`}
                        onClick={ () => {
                            setInputValue(key.Name);
                            props.onChangeHandler(key.Name);
                            document.querySelectorAll(".li_"+inputId+".show").forEach( node => node.classList.remove("show") )
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
        let liList = document.querySelectorAll(classSelector)
        let typedUp = product.toUpperCase();
        let typeDown = product.toLowerCase();
        liList.forEach( (node) => {
            if(product.length > 0){ 
                if(node.textContent.includes(product) || node.textContent.toUpperCase().includes(typedUp) || node.textContent.toLowerCase().includes(typeDown) ){
                    node.classList.add("show")
                } else if(product.length > 0 && node.textContent.includes(product)) {
                    node.classList.add("show")
                } else {
                    node.classList.remove("show")
                }
            } else {
                node.classList.remove("show") 
            }
        })
    }

    return(
        <>
            <label>
                <input 
                    id={inputId}
                    ref={input}
                    type="text" 
                    value={inputValue}
                    onChange={ (e) => { 
                        setInputValue(e.target.value);
                        props.onChangeHandler(inputValue)
                    }}
                    onKeyUp={ (e) => { 
                        filterList(e.target.value);
                        props.onChangeHandler(inputValue) } }
                    />
                <ul id={ulId} className="autoCompleteList">
                    {productCatalogList}
                </ul>
            </label>
        </>
    )
}

export default InputAutoComplete;