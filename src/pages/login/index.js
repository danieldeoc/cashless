import React, { useState } from "react";

import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Input from "../../components/forms/input";
import PrimaryButton from "../../components/elements/buttons/primaryButton";
import { signIn } from "../../firebase/auth";


function LoginPage(){

    const [userEmail, setUserEmail] = useState(undefined);
    const [userPass, setUserPass] = useState(undefined);


    return(
        <>
            <PageTitle text="Login to your account" />
            <PageBox>

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
                    label="Your password:"
                    placeholder="Insert your password"
                    value={userPass}
                    onChangeHandler={(result) => { 
                        setUserPass(result)
                    }}
                    />  

                <PrimaryButton
                    label="Sign-in"
                    onClickHandler={
                        async () => {
                            if( userEmail && userPass){
                                await signIn(userEmail, userPass)
                            } else {
                                alert("Please, provide an e-mail or password")
                            }
                        }} /> 
            </PageBox>
        </>
    )
}

export default LoginPage;