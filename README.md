# Cashless Financial App

App developed for my to manange my finances

## versions
- 0.1.02 - store regiser added
- 0.1.01 - expense price register bug fix, expense register total price field added to allow price corrections, totalfunds counts added to the dashboard, session stored changed to cookies for better performance in app, insufienct funds alert added on expense register page in case of an account without suficient monney selected
- 0.1.00 - bank account payment methods bug fix, getUnitsCatalog function moved to products.js, globalgetters file deleted. Accounts moved to appdoc firebase.
- 0.0.90 - android icons added
- 0.0.89 - categories bug fix, account bug fix, add money link added, css styles added, link to support added
- 0.0.88 - header and navigator menu added, categories page bug fixes, product page fields clean up after register, 
- 0.0.87 - text label bug fixes, android app test version added (ionic and capacitor)
- 0.0.86 - add money to account added, sessionstorage bug fixes, product delete: fixed bug: do not allow product delet if an expense exist
- 0.0.85 - register process created, login process created, dashboard created, block on fisical money delete, account settup created, accounts, products, setttings and expenses firebase reference fixed to user ref id,
- 0.0.84 - pricehistory screen created, account history screen created, login and register page created, home page inserted, dashboard inserted
- 0.0.83 - expense, products anda accounts empty result list bug fix, autocomplete bug fixes, empty screen added for no categories or accounts setted, expense delte process added (deletes expense, deletes bank account movment and updates balance, deletes product history price register)
- 0.0.82 - expense screen interface added, code bugs fixed, expense register await and async bug fixes,
- 0.0.81 - product price history screen created, accounts interface created, account movements screen added
- 0.0.80 - Category page interface added / select component created / input component improvaed, category page logic improved / fontawesome instlled > free solid and core / message system component started / loader image added / confirm dialog added / block page loader added / ul table list style created / button styles primary / default, green and red created / interface added to product page / product page code improvments
- 0.0.79 - Category page code rewrited, firebase categories added, first interface layout itens added, sass style added
- 0.0.78 - Bank registration code upgraded, bank balance history created, bank balance update function added, expense register added, product price history added, general bug corrections
- 0.0.41 -form clear after submit
- 0.0.4 - Expense register added, first beta version

## Bugs list
- payments method not showing up in bank list account

## task list
- include expense overview in bankaccount

- validate data before submit
- just enable button if data is valid
- bank movements: add filter: all, debits, deposits
- bank movements: add pagination or page limits
- bank movements: add history chart


Categories
- on add subcategorie alert gets null in message (use useref)



expenses
- add unitary price in product listage
- add product price history is duplicated

Bank Account register

- create an option to close the account if there are movments
- get only open accounts
- set bank currency symbol

Expense register
- cannot register an expense in insufient funds
- registering 3 products

# Add Interface

# Add Login and register

# code review
- review react code

-----------------

## Future Improvments
# Categories Register
- Add contract/expand in ul list
- discont: allow the difference between expense total price and price be registered as discount - se chesse 0.060kg at 10.59 payd 0.64 when it was 0.635
- 
