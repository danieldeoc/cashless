import React from "react";
import PrimaryButton from "../../components/elements/buttons/primaryButton";

import homeintro from "../../images/home-intro.svg"

function HomePage(){

    function goToLogin(){
        window.location.href = "/login";
    }
    function goToRegister(){
        window.location.href = "/register";
    }

    return(
        <>

            <div className="divIntro">

                <div className="textIntro">
                    <h1>Cashless</h1>
                    <p>Finances fot those with a low budget.</p>
                </div>

                <div className="bottom-box-align">
                    <PrimaryButton
                            label="Sign-In"
                            
                            onClickHandler={goToLogin} /> 

                    <PrimaryButton
                            label="Sign-Up"
                            classes="green"
                            onClickHandler={goToRegister} /> 
                </div>
            </div>

        </>
    )
}

export default HomePage;