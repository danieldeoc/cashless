import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, Timestamp } from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { returnMessage } from "../tools/alertTools";



// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyD6txBIF18GfL7EvXyouaADDFqK9rJd6cA",
    authDomain: "cashless-appdoc.firebaseapp.com",
    projectId: "cashless-appdoc",
    storageBucket: "cashless-appdoc.appspot.com",
    messagingSenderId: "3827619937",
    appId: "1:3827619937:web:4b0bedbaa556b077897220",
    measurementId: "G-9Y22LJCR68"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);


////////////////////////////////
// Sign-out user
export async function logOut() {
    await signOut(auth).then(() => {
         console.log("loged out")
         sessionStorage.removeItem('Auth User')
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
    credentials.name =sessionStorage.getItem('User Name')
    credentials.email =sessionStorage.getItem('User E-mail')
    return credentials;
}

//////////////////////////////////////
// User Registration
export async function createUser(name, email, password) {
    let result;
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
                // sets user name
                updateProfile(user, {
                    displayName: name
                })
            result = returnMessage("Register completed");
            sessionStorageControl(user.uid, name, user.email)
            //window.location.href = "/";
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