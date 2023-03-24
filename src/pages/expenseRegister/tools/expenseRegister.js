import { serverTimestamp } from "firebase/firestore";
import { addProductToCatalogByExpenses, addProductPriceHistory, updateProductDoc } from "../../../firebase/product";
import { expenseRegistration } from "../../../firebase/expenseRegistration";
import { getAccountStatus, addBankExpense } from "../../../firebase/accounts";
import { returnMessage } from "../../../tools/alertTools";
import { addStore } from "../../../firebase/stores";

export async function expenseRegisterProcess(expenses, productCatalog){
    let finalResult;
    console.log("Expenses: ", expenses, "Catalog of products: ", productCatalog)
    
    /// create a map of produc id and keys for run final functions
    const expenseProductMapId = [];
    let settedAccount = undefined;

    ////////////////
    // set the arrays for both process, new and existing products
    const existentProducts = [];
    const newProducts = [];

    ////////////////
    // define new and existing products separating then in two different arrays
    expenses.products.forEach( product => {
        let isInCatalog = productCatalog.find( ({Name}) => Name == product.Name)
        if(isInCatalog){
            existentProducts.push(product)
        } else {
            newProducts.push(product)
        }
    });

    console.log("Existentes", existentProducts, "Novos", newProducts)

    ///////////////////////
    // 1 - Start process: Run bank account check
    // get the bank account status and validates    
    await getAccountStatus(expenses.accountId).then( 
        async (account) => {
            console.warn("1. get accounts")
            settedAccount = account;
            const accountStatus = account.Status;
            const accountBalance = account.CurrentFunds;  
        
            // validates if account is active and have funds
            if(accountStatus === true){
                if(accountBalance => expenses.totalExpense){


                    ///////////////////////////////////////
                    // register expense
                    const registerExpense = async () => {
                        console.warn("3. after register products", )
                        ///////////////////////////////////////
                        // 2 - once products are updates, it creates an expense register
                        // create a new expense object
                        
                        // check if keys allows register
                        
                        // then creates an object
                        console.log("Map of ids: ", expenseProductMapId)
                        let newExpense = {
                            products: expenseProductMapId,
                            totalExpense: expenses.totalExpense,
                            store: expenses.store,
                            paymenMethod: expenses.paymenMethod,
                            account: expenses.account,
                            CreatedAt: serverTimestamp(),
                            Hash: expenses.expenseHash
                        }

                        await addStore(expenses.store);

                        //and add its to firebase
                        await expenseRegistration(newExpense).then( 
                            async (expenseId) => {
                                console.warn("4. Expense register created", expenseId)
                                /////////////////////
                                // 3. THEN UPDATES ACCOUNT PAGE                            
                                // new balance object
                                const newBalance = {
                                    CreatedAt: serverTimestamp(),
                                    Type: "debit",
                                    Value: expenses.totalExpense,
                                    PayMethod: expenses.paymenMethod,
                                    LastBalance: settedAccount.CurrentFunds,
                                    NewBalance: (settedAccount.CurrentFunds - expenses.totalExpense),
                                    Expense: expenseId,
                                    Hash: expenses.expenseHash
                                }
                                ///////////////////////////////////
                                // add new balance to firebase
                                await addBankExpense(expenses.accountId, newBalance).then( 
                                    (balance) => {
                                        console.warn("5. bank balance added")
                                        console.warn("Bank expense registration done", balance);
                                    })
                            });
                    }

                    async function tryExpense(){
                        let result;
                        if(expenseProductMapId.length == expenses.products.length){
                            console.log("all ids here")
                            console.log(expenseProductMapId, expenseProductMapId.length, expenses.products, expenses.products.length)
                            await registerExpense();
                        } else {
                            console.log(expenseProductMapId, expenseProductMapId.length, expenses.products, expenses.products.length)
                            console.log("unsuccesfull run")
                        }
                    }

                    

                    ////////////////
                    // Add Existing Products
                    const addExistingProducts = async () => {

                        /////////////////
                        /// for each existent product
                        existentProducts.forEach( 
                            async (product) => {
                                console.warn("2.1 add existing product")
                            let docId = product.id;
                            expenseProductMapId.push(docId)

                            await tryExpense()

                            ///////////////
                            // Creates a price history
                            const priceHistoryItem = {
                                CreatedAt: serverTimestamp(),
                                Price: product.Price,
                                Amount: product.Amount,
                                TotalPrice: product.TotalPrice,
                                Store: expenses.store,
                                Hash: expenses.expenseHash
                            }
                            await addProductPriceHistory(priceHistoryItem, docId).then(
                                async (response) => {
                                    console.warn("2.3 Existing Product price history added", response)
                                    ///////////////
                                    // then calc the product average price

                                    ///////////////
                                    // update product last price
                                    
                                    let productDoc = {
                                        LastPrice: product.Price
                                    }
                                    await updateProductDoc(productDoc, docId).then( 
                                        async (response) => {
                                        console.warn("2.4 Existing Product Doc updated", response);
                                    });
                                })
                        });
                    }

                    ////////////////
                    // Add New Products
                    const addNewProducts = async () => {
                        //// for each new product
                        newProducts.forEach(
                            async (product) => {
                                console.warn("2.1 add new product")
                                ///////////////
                                // defines an temp object
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
                                // en add it to firebase
                                await addProductToCatalogByExpenses(TempProduct)
                                    .then( 
                                        async (productIdResponse) => {
                                            console.warn("2.1 New product Added to the catalog", productIdResponse)
                                            // gets an id in response
                                            console.log("id response: ", productIdResponse)
                                            expenseProductMapId.push(productIdResponse)
                                            console.log("new id added")
                                            
                                            await tryExpense();

                                            ///////////////
                                            // then, creates a pricehistory data
                                            const priceHistoryItem = {
                                                CreatedAt: serverTimestamp(),
                                                Price: product.Price,
                                                Amount: product.Amount,
                                                TotalPrice: product.TotalPrice,
                                                Store: expenses.store,
                                                Hash: expenses.expenseHash
                                            }
                                            // and add its to the firebase
                                            await addProductPriceHistory(priceHistoryItem, productIdResponse)
                                                .then( 
                                                    async (hisotryResponse) => {
                                                        console.warn("2.2 New Product Price history added", hisotryResponse)
                                                })
                                        }    
                                    )
                                });  
                                                             
                    }
                    
                    if(newProducts.length > 0){
                        // register new products, then existent products, then run expense
                        await addNewProducts().then(
                            () => {
                                finalResult = returnMessage("Expense registered with success");
                            }
                        );
                    }
                    if(existentProducts.length > 0){
                        // register existent products, then run expense
                        await addExistingProducts().then(
                            () => {
                                finalResult = returnMessage("Expense registered with success");
                            }
                        );
                    }                    
                
            } else {
                finalResult = returnMessage("Bank account has insificient funds: "+accountBalance, "error");
            }
        } else {
            finalResult = returnMessage("Bank account not avaliable", "error");
        }
    })
    return finalResult
}