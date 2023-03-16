import { serverTimestamp } from "firebase/firestore";
import { addProductToCatalog, addProductPriceHistory, updateProductDoc } from "../../../firebase/productRegistration";
import { expenseRegistration } from "../../../firebase/expenseRegistration";
import { getAccountStatus, addBankExpense } from "../../../firebase/accounts";


export async function expenseRegisterProcess(expenses, productCatalog){

    console.log("Expenses: ", expenses, "Catalog of products: ", productCatalog)

    const expenseProductMapId = [];

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
        ///////////////
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
        ///////////////
        // e adiciona ao firebase
        addProductToCatalog(TempProduct)
            .then( (productIdResponse) => {
                console.warn("New product Added to the catalog", productIdResponse)
                expenseProductMapId.push(productIdResponse)
                ///////////////
                // entao, cria-se um historico de preco
                const priceHistoryItem = {
                    CreatedAt: serverTimestamp(),
                    Price: product.Price,
                    Amount: product.Amount,
                    TotalPrice: product.TotalPrice,
                    Store: product.Store
                }
                // e se adiciona ao firebase
                addProductPriceHistory(priceHistoryItem, productIdResponse).then( (hisotryResponse) => {
                    console.warn("New Product Price history added", hisotryResponse)
                })
            }    
        )
    });

    /////////////////
    /// for each existent product
    existentProducts.forEach( product => {
        let docId = product.id;
        expenseProductMapId.push(docId)
        ///////////////
        // Creates a price history
        const priceHistoryItem = {
            CreatedAt: serverTimestamp(),
            Price: product.Price,
            Amount: product.Amount,
            TotalPrice: product.TotalPrice,
            Store: product.Store
        }
        addProductPriceHistory(priceHistoryItem, docId).then( (response) => {
            console.warn("Existing Product price history added", response)
            ///////////////
            // then calc the product average price

            ///////////////
            // update product last price
            
            let productDoc = {
                LastPrice: product.Price
            }
            updateProductDoc(productDoc, docId).then( (response) => {
                console.warn("Existing Product Doc updated", response)
            });
        })
    });
    // ir no getCatalogs e adicionar ao objeto de produtos


    ///////////////////////////////////////
    // Register a New Expense
    // create a new expense object
    let newExpense = {
        products: expenseProductMapId,
        totalExpense: expenses.totalExpense,
        store: expenses.store,
        paymenMethod: expenses.paymenMethod,
        account: expenses.account,
        CreatedAt: serverTimestamp()
    }
    expenseRegistration(newExpense).then( (response) => {
        console.warn("Expense register created", response)
    });

    ///////////////////////
    // Run bank account catalog
    // get the bank account status and validates    
    getAccountStatus(expenses.accountId).then( (account) => {
        const status = account.Status;
        const funds = account.CurrentFunds;  
        
        ///////////////////////////////////
        // new balance object
        const newBalance = {
            CreatedAt: serverTimestamp(),
            Type: "debit",
            Value: expenses.totalExpense,
            PayMethod: expenses.paymenMethod,
            LastBalance: account.CurrentFunds,
            NewBalance: (account.CurrentFunds - expenses.totalExpense)
        }
        // validates
        if(status === true){
            if(newBalance.Value > funds){
                alert("Insuficient funds");
                return;
            } else {
                
                ///////////////////////////////////
                // add new balance
                addBankExpense(expenses.accountId, newBalance).then( (balance) => {
                    console.warn("Bank expense registration done", balance)
                })
            }
        } else {
            alert("Bank account not avaliable");
            return; 
        }
    })
}