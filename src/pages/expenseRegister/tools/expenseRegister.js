import { serverTimestamp } from "firebase/firestore";
import { addProductToCatalog, addProductPriceHistory, updateProductDoc } from "../../../firebase/productRegistration";
import { expenseRegistration } from "../../../firebase/expenseRegistration";

export async function expenseRegisterProcess(expenses, productCatalog){

    console.log("Expenses: ", expenses)
    console.log("Catalog of products: ", productCatalog)

    ////////////////
    // set the arrays for both process
    const existentProducts = [];
    const newProducts = [];

    ////////////////
    // define new and existing products
    expenses.products.forEach( product => {
        if(productCatalog.find( ({Name}) => Name == product.Name)){
            existentProducts.push(product)
        } else {
            newProducts.push(product)
        }
    });
    console.log("Existentes", existentProducts, "Novos", newProducts)
    
    ////////////////
    // Add New Products
    //// para cada novo produto
    newProducts.forEach(product => {
        // define um novo objeto
        let TempProduct = {
            Name: product.Name,
            Category: product.Category,
            Subcategory: product.Subcategory, 
            AmountType: product.AmountType,
            LastPrice: product.LastPrice,
            AveragePrice: product.AveragePrice,
            CreatedAt: serverTimestamp(),
        }
        // e adiciona ao firebase
        addProductToCatalog(TempProduct)
            .then( (res) => {
                // entao, cria-se um historico de preco
                const priceHistoryItem = {
                    CreatedAt: serverTimestamp(),
                    Price: product.Price,
                    Amount: product.Amount,
                    TotalPrice: product.TotalPrice,
                    Store: product.Store
                }
                // e se adiciona ao firebase
                addProductPriceHistory(priceHistoryItem, res)
            }    
        )
    });

    /////////////////
    /// produtos existentes
    existentProducts.forEach( product => {

        // calc average price
        // update last price
        let docId =  product.id;
        let productDoc = {
            LastPrice: product.Price
        }
        updateProductDoc(productDoc, docId)

        const priceHistoryItem = {
            CreatedAt: serverTimestamp(),
            Price: product.Price,
            Amount: product.Amount,
            TotalPrice: product.TotalPrice,
            Store: product.Store
        }
        addProductPriceHistory(priceHistoryItem, docId)
    });
    // ir no getCatalogs e adicionar ao objeto de produtos


    ///////////////////////////////////////
    // Register New Expense
    let nameProducts = expenses.products.map( key => key.Name )
    let newExpense = {
        products: nameProducts,
        totalExpense: expenses.totalExpense,
        store: expenses.store,
        paymenMethod: expenses.paymenMethod,
        account: expenses.account,
        CreatedAt: serverTimestamp()
    }
    expenseRegistration(newExpense);

    ///////////////////////
    // Run bank account catalog



}

        /*
        console.log("Add nonexistent products to the catalog / also fix the catalog page")
        console.log("Add price history to existent products in the catalog")
        console.log("add expense register to the expenses history")
        console.log("add movment to the bank account")
        console.log("update the screen")
        */