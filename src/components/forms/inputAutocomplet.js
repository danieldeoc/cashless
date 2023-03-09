import React, { useCallback, useEffect,useRef, useState } from "react";
import { randomNumber } from "../../customOperators/mathOperators";

function InputAutoComplete(props){

    const [producCatalog, setProductsCatalog] = useState(undefined)
    const [inputValue, setInputValue] = useState(props.value);
    const input = useRef();
    const [inputId, setInputId] = useState(undefined)
    const [ulId, setUlId] = useState(undefined)
    const [optionList, setOptionList] = useState([])
    

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

    

    ///////////////////////////////
    // first load
    const firstLoad = useEffect( () => {
        const randomId = "autocomplete"+randomNumber("222");
        setInputId(randomId)
        setUlId(randomId+"_listBox")
        setProductsCatalog(props.list)
    }, [])

    const updateList = useEffect( () => {
        setOptionList(
            props.list.map( (key, i) => (      
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
    }, [producCatalog])

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
                    {optionList}
                </ul>
            </label>
        </>
    )
}

export default InputAutoComplete;