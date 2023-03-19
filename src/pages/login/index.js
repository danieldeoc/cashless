import React, { useState } from "react";

import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Input from "../../components/forms/input";
import PrimaryButton from "../../components/elements/buttons/primaryButton";


function LoginPage(){

    const [userEmail, setUserEmail] = useState(undefined);
    const [userPass, setUserPass] = useState(undefined);

    function signIn(){
        console.log(userEmail, userPass)
    }

    return(
        <>
            <PageTitle text="Create an account" />
            <PageBox>
                <SectionTitle text="Insert your data" />  

                <Input 
                    type="email"
                    id="email"
                    label="Your e-mail:"
                    placeholder="Insert your e-mail"
                    value={userEmail}
                    onChangeHandler={(result) => { 
                        setUserEmail(result)
                    }}
                    />

                <Input 
                    type="password"
                    id="password"
                    label="Your e-mail:"
                    placeholder="Insert your e-mail"
                    value={userPass}
                    onChangeHandler={(result) => { 
                        setUserPass(result)
                    }}
                    />  

                <PrimaryButton
                    label="Sign-in"
                    onClickHandler={signIn} /> 
            </PageBox>
        </>
    )
}

export default LoginPage;