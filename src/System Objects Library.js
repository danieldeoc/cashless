////////////////////////////
// PRODUCT REGISTRATION
const Product = {
    id: "",
    Name: "",
    Category: "",
    Subcategory: "", 
    AmmountType: "",
    LastPrice: 0.00,
    AveragePrice: 0.00,
    PriceHistory: [
        {
            Date: Date(),
            Price: 0.00,
            Store: "Name"
        },
    ],
    CreatedAt: Date()
}

