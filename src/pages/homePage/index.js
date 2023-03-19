import React from "react";
import PrimaryButton from "../../components/elements/buttons/primaryButton";

function HomePage(){

    function goToLogin(){
        window.location.href = "/login";
    }
    function goToRegister(){
        window.location.href = "/register";
    }

    return(
        <>
            Home page

            <PrimaryButton
                    label="Sign-In"
                    onClickHandler={goToLogin} /> 

            <PrimaryButton
                    label="Sign-Up"
                    onClickHandler={goToRegister} /> 
        </>
    )
}

export default HomePage;