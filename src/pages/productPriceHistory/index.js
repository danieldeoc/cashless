import React, { useEffect } from "react";

function ProductPriceHistory(props){

    const firstLoad = useEffect( () => {
        let param = 'productId';
        const urlParams = new URL(window.location.href).searchParams;
        
        if(urlParams.has(param)) {
            const productId = urlParams.get('productId');
            if(productId != undefined && productId != null && typeof productId === "string" && productId.length > 3 && productId.length < 30 ){
                console.warn("param correct")
            } else {
                console.warn("param may be incorrect")
            }
        } else {
            console.warn("no product to display")
        }
    }, [])

    return(
        <>
            Price history
        </>
    )
}

export default ProductPriceHistory;