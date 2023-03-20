import React, { useEffect, useState } from "react";
import CategoriesSettings from './pages/categories/index';
import ProductsCatalog from './pages/productsRegister/index';
import Navigator from './components/elements/navigator';

import {
  BrowserRouter as Router,
  Routes,
  Route} from "react-router-dom";
import RegisterExpenses from './pages/expenseRegister/index';
import BankAccounts from './pages/bankAccounts/index';
import Dashboard from './pages/dashboard/index';
import ProductPriceHistory from './pages/productPriceHistory';
import AccountMovements from './pages/accountMovements';
import ExpenseRegistrationNotAvaliable from './pages/expenseRegister/notavaliable';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import HomePage from "./pages/homePage";
import SetUpAccounts from "./pages/register/setUp";

function App(){

    const [userID, setUserId] = useState(undefined)
    const [userName, setUserName] = useState(undefined)
    const [userEmail, setUserEmail] = useState(undefined)
     
    useEffect( () => {
        
    })


    return(
        <Router>
            <Navigator />
            <Routes>                
                <Route  path="/" element={<HomePage />} />
                <Route  path="/dashboard" element={<Dashboard />} />
                
                <Route  path="/register" element={<RegisterPage />} />

                <Route  path="/register/setup" element={<SetUpAccounts />} />

                <Route  path="/login" element={<LoginPage />} />
                
                <Route  path="/products" element={<ProductsCatalog />} />
                <Route  path="/products/priceHistory" element={<ProductPriceHistory />} />
                
                <Route path="/categories" element={<CategoriesSettings /> } />

                <Route path="/bankaccounts" element={<BankAccounts /> } />
                <Route path="/bankaccounts/movements" element={<AccountMovements /> } />
                
                <Route path="/expenses" element={<RegisterExpenses /> } />
                <Route path="/expenses/registernotavaliable" element={<ExpenseRegistrationNotAvaliable /> } />
                
            </Routes>
        </Router> 
    )
}

export default App;