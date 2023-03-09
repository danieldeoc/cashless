import React, { useEffect, useRef, useState } from "react";

import { 
    getProductUnitsCatalog
} from "../../../globalOperators/globalGetters";

function UnitSelect(props){
    const [unitsCatalog, setUnitsCatalog] = useState(undefined);
    const [unitsOptions, setUnitsOptions] = useState([]);
    const productAmmountType = useRef();

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    // FIRST PAGE LOAD
    ////////////////////////////////////////////////
    const firstLoad =  useEffect(() => {
        // GET AVALIABLE DATA
        const fetchData = async () => {
            const avaliableUnits = await getProductUnitsCatalog()
                .then((res) => {
                    setUnitsCatalog(res)
                });
        }
        fetchData();
    }, [])

    ////////////
    // updates in catalog unit
    const pageUpdates = useEffect( () => {
        if(unitsCatalog !== undefined){
            setUnitsOptions(
                unitsCatalog.map( (key, i) => (
                    <option key={i}>{key}</option>
                ))
            )
        }    
    }, [unitsCatalog])


    return(
        <label>
            Product Ammount Type:
            <select 
                ref={productAmmountType}
                onChange={ (e) => {
                    props.onChangeHandler( productAmmountType.current.value)
                }} >
                {unitsOptions}
            </select>
        </label>
    )
}
export default UnitSelect;