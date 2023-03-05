import React, { useEffect, useState } from "react";

function InputAutoComplete(props){
    const [inputValue, setInputValue] = useState(props.value);
    const ulId = props.id + "_listBox";
    const list = props.list.map( key => (
        <li key={key.id} onClick={ () => {
            setInputValue(key.Name);
            props.onChangeHandler(key.Name);
            document.querySelectorAll("#"+props.id+" li.show").forEach( node => node.classList.remove("show") )
        }}>
            {key.Name}
        </li>
    ));

    //////////////////////////
    // Filter the sugestion list
    function filterList(product){
        const list = document.querySelectorAll("#"+ulId + " li");
        const typed = product;
        const typedUp = typed.toUpperCase();
        const typeDown = typed.toLowerCase();
        list.forEach( (node) => {
            if(product.length > 0){
                if(node.textContent.includes(typed) || node.textContent.toUpperCase().includes(typedUp) || node.textContent.toLowerCase().includes(typeDown) ){
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
                    id={props.id}
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
                    {list}
                </ul>
            </label>
        </>
    )
}

export default InputAutoComplete;