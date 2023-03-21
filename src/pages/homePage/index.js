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
            <img src={homeintro} className="homeIntroSplash" alt="Cashless: finances for those with few money" />

            <div className="bottom-box-align">
                <PrimaryButton
                        label="Sign-In"
                        classes="purple"
                        onClickHandler={goToLogin} /> 

                <PrimaryButton
                        label="Sign-Up"
                        classes="green"
                        onClickHandler={goToRegister} /> 
            </div>
        </>
    )
}

export default HomePage;