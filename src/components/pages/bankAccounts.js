import React from "react";

function BankAccounts(){
    /* In the bank account register it will:
        Add new bank accounts:
            {
                id:
                Name:
                InitialDeposit: $
                Currency:
                PaymentMethods: []
                Status: true|false // if open or closed
                Movments: // a collection of movments containing
                    {
                        date:
                        movmentType:
                        operatingValue:
                        payMethod:
                        position:
                    }
            }
    */

    return(
        <>Bank Accounts</>
    )
}

export default BankAccounts;