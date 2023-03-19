import React from "react";
import PageBox from "../../../components/elements/pageBox";

import {Link} from "react-router-dom";

function ExpenseRegistrationNotAvaliable(){

    return(
        <PageBox>

            <div className="empty-page">
                You cannot register an expense yet. Please, check if you have registered an account and setted the products categories.
                <br/>
                <Link to="/categories">Addn an category</Link> or <Link to="/bankaccounts">Add an Account</Link>
            </div>
        </PageBox>
    )
}

export default ExpenseRegistrationNotAvaliable;