import React, { useEffect } from "react";
import Loader from "../../components/elements/loader";

import { getAuthCredentias } from "../../firebase/auth";
import { addNewCategory, addNewSubCategory } from "../../firebase/categories";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { addBankAccount } from "../../firebase/accounts";
import { settupSetting } from "../../firebase/settup";


function SetUpAccounts(){

    // setup the app
    const startSetUp = useEffect(() => {
        const setData = async () => {
            const credentials = getAuthCredentias();
            console.log(credentials)
            // generate pre made categories
            // create paper money account

            const categories = [
                {
                    Name: "Donations",
                    Childs: []
                },
                {
                    Name: "Vehicles",
                    Childs: ["Car", "Fuel", "Maintence"]
                },
                {
                    Name: "Food and Snacks",
                    Childs: ["Lunchs", "Breakfasts", "Drinks", "Coffees", "Snacks", "Dinners"]
                },
                {
                    Name: "Comunication",
                    Childs: ["Celphone", "Internet"]
                },
                {
                    Name: "Education",
                    Childs: ["Books", "Courses", "College"]
                },
                {
                    Name: "Extras",
                    Childs: []
                },
                {
                    Name: "Tools",
                    Childs: []
                },
                {
                    Name: "Fitness and Beauty",
                    Childs: ["Hair cut", "Sports"]
                },
                {
                    Name: "House",
                    Childs: ["Mortgage", "Rent", "Energy", "Water", "Gas", "Others", "Home appliances", "Furniture"]
                },
                {
                    Name: "Taxes",
                    Childs: []
                },
                {
                    Name: "Grocery",
                    Childs: ["Food", "Meat", "Cleaning goods", "Candys", "Drinks", "Others", "Fruits", "Vegetables", "Hygiene products"]
                },
                {
                    Name: "Others",
                    Childs: []
                },
                {
                    Name: "Health & Medicine",
                    Childs: ["Medicines", "Suplements", "Doctor appointments", "others"]
                },
                {
                    Name: "Work",
                    Childs: ["Computers", "Office stuff",]
                },
                {
                    Name: "Public Transport",
                    Childs: ["Bus", "Subway", "Bikes", "Taxis", "Uber", "Monthly pass"]
                },
                {
                    Name: "Tourism and leisure",
                    Childs: ["Travels", "Air tickets", "Hotels", "Museuns", "Restaurants", "Others"]
                },
                {
                    Name: "Clothes",
                    Childs: []
                }
            ]

            const addCategories = async () => {

                categories.forEach( 
                    async (key) => {
                    let newCategory = {
                        Name: key.Name,
                        Childs: key.Childs,
                        CreatedAt: serverTimestamp()
                    }
                    await addNewCategory([], newCategory).then(
                        async (response) => {
                            console.warn("Category added", response)
                        }
                    )
                })
            }

            addCategories().then(
                async () => {

                    const paperMoneyAccount = {
                        Name: "Paper Money",
                        InitialDeposit: 0,
                        CurrentFunds: 0,
                        Currency: "Euro",
                        CurrencySymbol: "€",
                        PaymentMethods: ["cash"],
                        Status: true,
                        CreatedAt: serverTimestamp()
                    };
        
                    await addBankAccount(paperMoneyAccount).then(
                        async (response) => {
                            console.warn("Paper money added", response)
                            await settupSetting().then(
                                (response) => {
                                    window.location.href = "/dashboard";
                                }
                            )
                        }
                    )
                }
            )
        }
        setData();
    }, [])

    return(
        <Loader type="fullscreen" />
    )
}

export default SetUpAccounts;