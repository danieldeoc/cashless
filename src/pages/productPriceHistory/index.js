import React, { useEffect, useState } from "react";
import PageBox from "../../components/elements/pageBox";
import { getProductPriceHistory, getProduct } from "../../firebase/product";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Loader from "../../components/elements/loader";
import { getDate } from "../../tools/dateTools";
import { currencySymbol, formatValueTo2Digit } from "../../tools/mathTools";

function ProductPriceHistory(){

    const [priceHistoryList, setPriceListHistory] = useState(<Loader />)
    const [productName, setProductName] = useState(undefined)

    let title = "Price History for "+productName;

    const firstLoad = useEffect( () => {
        let param = 'productId';
        const urlParams = new URL(window.location.href).searchParams;
        
        function listHistory(response){
            setPriceListHistory(
                response.map( (key, i) => (
                    <li key={i}>
                        {getDate(key.CreatedAt)}
                        <span className="table-list-right-side table-list-currency no-margin">
                            {formatValueTo2Digit(key.Price)} {currencySymbol("Euro")}
                        </span>
                        <div className="li-container">
                            <span className="li-container-label">
                                Amount purchased:<br/>
                                <strong>{key.Amount}</strong>
                            </span>
                            <span className="li-container-label">
                                Store:<br/>
                                <strong>{key.Store}</strong>
                            </span>
                            <span className="li-container-label">
                                Total purchased:<br/>
                                <strong>{key.TotalPrice}</strong>
                            </span>
                        </div>
                    </li>
                ))
            );
        
        }

        if(urlParams.has(param)) {
            const productId = urlParams.get('productId');
            if(
                productId != undefined && 
                productId != null && 
                typeof productId === "string" && 
                productId.length > 3 && productId.length < 30 ){
                
                const fetchData = async (productId) => {
                    await getProduct(productId).then(
                        (response) => {
                            setProductName(response.Name)
                        }
                    )

                    await getProductPriceHistory(productId)
                        .then(
                            (response) => {
                                listHistory(response);
                            }
                        ).catch( err => console.log(err) )
                }
                fetchData(productId);
            } else {
                console.warn("param may be incorrect")
            }
        } else {
            console.warn("no product to display")
        };
    }, []);

    const rerender = useEffect( () => {

    }, [priceHistoryList])

    return(
        <>
            <PageTitle text={title} />
            <PageBox>
                <SectionTitle text="Price history" />
                <ul className="table-list">
                    {priceHistoryList}
                </ul>
            </PageBox>
        </>        
    )
}

export default ProductPriceHistory;