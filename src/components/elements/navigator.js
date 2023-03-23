import React from "react";
import { logOut } from "../../firebase/auth";

import {Link} from "react-router-dom";

function Navigator(){



    return(
        <nav id="navigator" className="navigator">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/products">Products</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/bankaccounts">Bank Accounts</Link>

            

                <a onClick={ (event) => {
                    logOut()
                }}>Log-out</a>
        </nav>
    )
}

export default Navigator;