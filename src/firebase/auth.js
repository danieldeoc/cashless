
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { returnMessage } from "../tools/alertTools";

const firebaseConfig = {
    apiKey: "AIzaSyC1BQg_aO360A1QUQiQaOAOatwBQqu6lu8",
    authDomain: "cashless-20f70.firebaseapp.com",
    projectId: "cashless-20f70",
    storageBucket: "cashless-20f70.appspot.com",
    messagingSenderId: "735776965674",
    appId: "1:735776965674:web:22b9fae0f28ca91603af53",
    measurementId: "G-JF2X1KH38Z"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


////////////////////////////////
// Sign-out user
export async function logOut() {
    await signOut(auth).then(() => {
         console.log("loged out")
         sessionStorage.removeItem('User Auth')
         sessionStorage.removeItem('User Name')
         sessionStorage.removeItem('User E-mail')
         window.location.href = "/";
         // Sign-out successful.
     }).catch((error) => {
         // An error happened.
         console.error("logout could not be performed")
     })
 }

////////////
// manage session storage creation
function sessionStorageControl(id, name, email){
    
    sessionStorage.setItem('User Auth', id);
    if(name){
        sessionStorage.setItem('User Name', name);
    }
    if(email){
        sessionStorage.setItem('User E-mail', email);
    }
}

export function getAuthCredentias(){
    let credentials = {
        id: undefined,
        name: undefined,
        email: undefined
    }
    credentials.id = sessionStorage.getItem('User Auth')
    credentials.name = sessionStorage.getItem('User Name')
    credentials.email = sessionStorage.getItem('User E-mail')
    
    return credentials;
}

//////////////////////////////////////
// User Registration
export async function createUser(name, email, password) {
    let result;
    await createUserWithEmailAndPassword(auth, email, password)
        .then(
            async (userCredential) => {
            const user = userCredential.user;
                // sets user name
                await updateProfile(user, {
                    displayName: name
                }).then( () => {

                    result = returnMessage("Register completed");
                    sessionStorageControl(user.uid, name, user.email)
                })
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage)
        });
    return result
}



////////////////////////////////
// Sign-in with user email and passwor
export async function signIn(email, password) {
    
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorageControl(user.uid, user.displayName, user.email)
        window.location.href = "/dashboard";
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
      });

}