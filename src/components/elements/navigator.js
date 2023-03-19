import React from "react";

import {Link} from "react-router-dom";

function Navigator(){
    return(
        <nav className="navigator">
            <Link to="/categories">Categories</Link>
            <Link to="/products">Products Catalog</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/bankaccounts">Bank Accounts</Link>
        </nav>
    )
}

export default Navigator;