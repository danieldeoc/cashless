import React from "react";
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

function App(){
    return(
        <Router>
            <Navigator />
            <Routes>                
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
                
                <Route exact path="/register" element={<RegisterPage />} />
                <Route exact path="/login" element={<LoginPage />} />
                
                <Route exact path="/products" element={<ProductsCatalog />} />
                <Route exact path="/products/priceHistory" element={<ProductPriceHistory />} />
                
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