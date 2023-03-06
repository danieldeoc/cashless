/////////////////////////////////
// Formats a money value
export function formatValueToMoney(value){
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    })
    const moneyFormat = formatter.format(value) // "$1,000.00"
    return moneyFormat;
}

/////////////////////////////////
// Formats a ammount value
export function formatValueTo3Digit(value){
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 3
    })
    const threeDigits = formatter.format(value) // "1.000"
    return threeDigits;
}

/////////////////////////////////
// Multiples the product unit value with a ammount value
export function productTotalPrice(price, ammount){
    const calcPrice = price.split("€");
    const calcPriceNumber = parseFloat( calcPrice[1] );
    const calcAmmount = parseFloat(ammount);
    const calclResult = calcPriceNumber * calcAmmount;
    const totalPrice = formatValueToMoney(calclResult)
    return totalPrice;
}


/////////////////////////////////
// Generates randon number
export function randomNumber(max){
    let randomNumber =  Math.floor(Math.random() * max);
    return randomNumber;
}