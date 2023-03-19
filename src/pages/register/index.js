import React, { useState } from "react";

import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Input from "../../components/forms/input";
import PrimaryButton from "../../components/elements/buttons/primaryButton";


function RegisterPage(){

    const [userEmail, setUserEmail] = useState(undefined);
    const [userPass, setUserPass] = useState(undefined);
    const [userName, setUserName] = useState(undefined);

    function createAccount(){
        console.log(userEmail, userPass)
    }

    return(
        <>
            <PageTitle text="Create an account" />
            <PageBox>
                <SectionTitle text="Insert your data" />  

                <Input 
                    type="text"
                    id="userName"
                    label="Your name:"
                    placeholder="Insert your name"
                    value={userEmail}
                    onChangeHandler={(result) => { 
                        setUserName(result)
                    }}
                    />

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
                    label="Create account"
                    onClickHandler={createAccount} /> 
            </PageBox>
        </>
    )
}

export default RegisterPage;