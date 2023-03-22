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
import AddMoney from "./pages/addMoney";
import { getAuthCredentias } from "./firebase/auth";
import Header from "./components/elements/header";
import Footer from "./footer";

function App(){
    const [menu, setMenu] = useState(undefined)
    const [padTop, setPadTop] = useState("")
     
    useEffect( () => {
        
        const logged = getAuthCredentias()
        if(logged.id){
            setMenu(<Header />)
            setPadTop("app-container")
        }
    }, [])

    return(
        <div className={padTop}>
            <Router>
                {menu}
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
                    <Route path="/bankaccounts/movements/addmoney" element={<AddMoney /> } />
                    
                    <Route path="/expenses" element={<RegisterExpenses /> } />
                    <Route path="/expenses/registernotavaliable" element={<ExpenseRegistrationNotAvaliable /> } />
                    
                </Routes>
            </Router> 
            <Footer />
        </div>
    )
}

export default App;