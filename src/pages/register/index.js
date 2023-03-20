import React, { useState } from "react";

import PageBox from "../../components/elements/pageBox";
import PageTitle from "../../components/elements/texts/pageTitle";
import SectionTitle from "../../components/elements/texts/sectionTitle";
import Input from "../../components/forms/input";
import PrimaryButton from "../../components/elements/buttons/primaryButton";
import CheckBoxGroups from "../../components/forms/checkboxes";
import ModalOverlay from "../../components/elements/modal";
import { createUser } from "../../firebase/auth";
import Loader from "../../components/elements/loader";
import Alert from "../../components/elements/messages/alert";


function RegisterPage(){

    const [userEmail, setUserEmail] = useState(undefined);
    const [userPass, setUserPass] = useState(undefined);
    const [userName, setUserName] = useState(undefined);
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [returningAlerts, setReturningAlerts] = useState("");

    const terms = [];
    const termsContent = "terms";



    function showModal(id){
        document.getElementById(id).classList.add("show");
    }

    async function createAccount(){
        console.log(userEmail, userPass, acceptedTerms)
        if(acceptedTerms === false){
            alert("You need to accept or terms and conditions in order to continue")
        } else {
            setReturningAlerts(<Loader type="fullscreen" />)
            await createUser(userName, userEmail, userPass).then(
                (response) => {
                    window.location.href = "/register/setup";
                }
            )
        }
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
                    label="Create a password:"
                    placeholder="Use 6 to 8 characters"
                    value={userPass}
                    onChangeHandler={(result) => { 
                        setUserPass(result)
                    }}
                    />  

                <CheckBoxGroups
                    id="ckGroup_1"
                    data={terms}
                    OnClickHandler={res => ""} />
                {acceptedTerms}
                <div>
                    <input type="checkbox"
                        onChange={() => { setAcceptedTerms(true) }} /><span className="termsShowUp" onClick={() => { showModal("termsAndConditions") }}>I've read and accepted the terms and conditions.</span>
                </div>

                <ModalOverlay
                    id="termsAndConditions"
                    title="Terms and Conditions"
                    content={termsContent} />

                <PrimaryButton
                    label="Create account"
                    onClickHandler={createAccount} /> 
            </PageBox>
            {returningAlerts}   
        </>
    )
}

export default RegisterPage;