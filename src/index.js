import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import CategoriesSettings from './pages/categories/index';
import ProductsCatalog from './pages/productsRegister/index';
import Navigator from './components/elements/navigator';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link} from "react-router-dom";
import RegisterExpenses from './pages/expenseRegister/index';
import BankAccounts from './pages/bankAccounts/index';
import Dashboard from './pages/dashboard/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
        <Navigator />
        <Routes>            
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/products" element={<ProductsCatalog />} />
            <Route path="/categories" element={<CategoriesSettings /> } />
            <Route path="/expenses" element={<RegisterExpenses /> } />
            <Route path="/bankaccounts" element={<BankAccounts /> } />
        </Routes>
    </Router> 
);
