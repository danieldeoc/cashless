export function defineCurrencySymbols(currency){
    let curerncy;
    switch(currency) {
        case "Euro":
            curerncy = "€"
            break;
        case "Dollar":
            curerncy = "$"
            break;
        case "Real":
            curerncy = "R$"
            break;
        case "Libra":
            curerncy = "£"
            break;
        default:
            curerncy = "€"
            break;
      } 
    return curerncy;
}